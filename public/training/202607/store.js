/* Client training API: Supabase REST when configured, else localStorage room sync. */
(() => {
  const cfg = window.TRAINING_CONFIG || {};
  const SB_URL = (cfg.supabaseUrl || "").replace(/\/$/, "");
  const SB_KEY = cfg.supabaseAnonKey || "";
  const USE_SB = Boolean(SB_URL && SB_KEY);

  const LOCAL_KEY = "lttc_room_v1";

  function uuid() {
    return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function loadLocal() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveLocal(db) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(db));
  }

  function ensureSession(db, code) {
    if (!db[code]) db[code] = { students: {}, events: [] };
    return db[code];
  }

  function computeStats(events, studentId) {
    const mine = events.filter((e) => e.student_id === studentId);
    let translate_clicks = 0;
    let quiz_answers = [];
    let pages = new Set();
    let choices = 0;
    let scenario_votes = 0;
    let match_answers = 0;
    let share_ideas = 0;
    const scenario_map = {};
    const share_by_strategy = {};
    let match_latest = null;
    const choice_items = [];
    for (const e of mine) {
      const p = e.payload || {};
      if (e.event_type === "translate_click") translate_clicks += 1;
      else if (e.event_type === "quiz_answer") quiz_answers.push(p);
      else if (e.event_type === "page_view") pages.add(p.page);
      else if (e.event_type === "choice") {
        choices += 1;
        choice_items.push(p);
      } else if (e.event_type === "scenario_vote") {
        scenario_votes += 1;
        if (p.scenario_id && p.vote) scenario_map[p.scenario_id] = String(p.vote).toUpperCase();
      } else if (e.event_type === "match_answer") {
        match_answers += 1;
        match_latest = p;
      } else if (e.event_type === "share_idea") {
        share_ideas += 1;
        if (p.text) share_by_strategy[p.strategy || ""] = p.text;
      }
    }
    const quiz_correct = quiz_answers.filter((a) => a.correct === true).length;
    const quiz_attempted = quiz_answers.length;
    return {
      translate_clicks,
      quiz_attempted,
      quiz_correct,
      accuracy: quiz_attempted ? Math.round((1000 * quiz_correct) / quiz_attempted) / 10 : 0,
      pages_viewed: [...pages].filter(Boolean).length,
      choices,
      scenario_votes,
      match_answers,
      share_ideas,
      quiz_answers,
      scenario_map,
      share_by_strategy,
      match_latest,
      choice_items,
      pages: [...pages].filter(Boolean).sort(),
    };
  }

  function hostSnapshotLocal(code) {
    const db = loadLocal();
    const room = ensureSession(db, code);
    const students = Object.values(room.students).sort((a, b) => a.joined_at - b.joined_at);
    const items = [];
    let total_translate = 0,
      total_correct = 0,
      total_attempted = 0,
      total_shares = 0;
    const quiz_breakdown = {};
    const scenario_breakdown = {};
    const match_breakdown = { n: 0, correct: 0, pairs: {} };
    const shares = [];

    for (const s of students) {
      const st = computeStats(room.events, s.id);
      total_translate += st.translate_clicks;
      total_correct += st.quiz_correct;
      total_attempted += st.quiz_attempted;
      total_shares += st.share_ideas;
      for (const ans of st.quiz_answers) {
        const qid = ans.quiz_id || "unknown";
        quiz_breakdown[qid] ||= { n: 0, correct: 0, options: {} };
        quiz_breakdown[qid].n += 1;
        if (ans.correct) quiz_breakdown[qid].correct += 1;
        const opt = String(ans.answer ?? "");
        quiz_breakdown[qid].options[opt] = (quiz_breakdown[qid].options[opt] || 0) + 1;
      }
      if (st.match_latest) {
        match_breakdown.n += 1;
        if (st.match_latest.correct) match_breakdown.correct += 1;
      }
      for (const [sid, vote] of Object.entries(st.scenario_map)) {
        scenario_breakdown[sid] ||= { YES: 0, NO: 0, n: 0 };
        scenario_breakdown[sid][vote] = (scenario_breakdown[sid][vote] || 0) + 1;
        scenario_breakdown[sid].n += 1;
      }
      for (const [strategy, text] of Object.entries(st.share_by_strategy)) {
        shares.push({
          student_id: s.id,
          name: s.name,
          strategy,
          text,
          created_at: Date.now() / 1000,
        });
      }
      items.push({
        id: s.id,
        name: s.name,
        joined_at: s.joined_at,
        ...st,
      });
    }

    return {
      session_code: code,
      student_count: items.length,
      totals: {
        translate_clicks: total_translate,
        quiz_attempted: total_attempted,
        quiz_correct: total_correct,
        accuracy: total_attempted ? Math.round((1000 * total_correct) / total_attempted) / 10 : 0,
        share_ideas: total_shares,
        scenario_votes: Object.values(scenario_breakdown).reduce((a, b) => a + b.n, 0),
        match_n: match_breakdown.n,
        match_correct: match_breakdown.correct,
      },
      quiz_breakdown,
      scenario_breakdown,
      match_breakdown,
      shares: shares.reverse().slice(0, 80),
      students: items,
      ts: Date.now() / 1000,
      mode: USE_SB ? "supabase" : "local",
    };
  }

  async function sb(path, opts = {}) {
    const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
      ...opts,
      headers: {
        apikey: SB_KEY,
        authorization: `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
        Prefer: opts.prefer || "return=representation",
        ...(opts.headers || {}),
      },
    });
    if (!res.ok) throw new Error(await res.text());
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  async function join({ name, session_code, device_id }) {
    const code = (session_code || "202607").trim().toUpperCase();
    const student_id = uuid();
    const joined_at = Date.now() / 1000;
    if (USE_SB) {
      await sb("training_students", {
        method: "POST",
        body: JSON.stringify({ id: student_id, session_code: code, name, device_id, joined_at }),
      });
    } else {
      const db = loadLocal();
      const room = ensureSession(db, code);
      room.students[student_id] = { id: student_id, name, device_id, joined_at, session_code: code };
      saveLocal(db);
    }
    return { student_id, session_code: code, name };
  }

  async function postEvent({ student_id, event_type, payload }) {
    if (USE_SB) {
      const rows = await sb("training_students?select=session_code,name&id=eq." + encodeURIComponent(student_id));
      if (!rows?.[0]) throw new Error("unknown student");
      const session_code = rows[0].session_code;
      await sb("training_events", {
        method: "POST",
        body: JSON.stringify({
          student_id,
          session_code,
          event_type,
          payload: payload || {},
          created_at: Date.now() / 1000,
        }),
      });
      const stats = await meStats(student_id);
      return { ok: true, stats };
    }
    const db = loadLocal();
    let found = null;
    let code = null;
    for (const [c, room] of Object.entries(db)) {
      if (room.students[student_id]) {
        found = room.students[student_id];
        code = c;
        break;
      }
    }
    if (!found) throw new Error("unknown student");
    const room = ensureSession(db, code);
    room.events.push({
      id: room.events.length + 1,
      student_id,
      session_code: code,
      event_type,
      payload: payload || {},
      created_at: Date.now() / 1000,
    });
    saveLocal(db);
    return { ok: true, stats: computeStats(room.events, student_id) };
  }

  async function meStats(student_id) {
    if (USE_SB) {
      const ev = await sb(
        `training_events?student_id=eq.${encodeURIComponent(student_id)}&select=event_type,payload,created_at&order=id.asc`
      );
      const events = (ev || []).map((e) => ({
        event_type: e.event_type,
        payload: e.payload,
        created_at: e.created_at,
        student_id,
      }));
      return computeStats(events, student_id);
    }
    const db = loadLocal();
    for (const room of Object.values(db)) {
      if (room.students[student_id]) return computeStats(room.events, student_id);
    }
    throw new Error("unknown student");
  }

  async function me(student_id) {
    if (USE_SB) {
      const rows = await sb(
        `training_students?id=eq.${encodeURIComponent(student_id)}&select=id,name,session_code,joined_at`
      );
      if (!rows?.[0]) throw new Error("unknown student");
      return { student: rows[0], stats: await meStats(student_id) };
    }
    const db = loadLocal();
    for (const room of Object.values(db)) {
      if (room.students[student_id]) {
        return { student: room.students[student_id], stats: computeStats(room.events, student_id) };
      }
    }
    throw new Error("unknown student");
  }

  async function hostSnapshot(session_code) {
    const code = session_code.trim().toUpperCase();
    if (!USE_SB) return hostSnapshotLocal(code);

    const students = await sb(
      `training_students?session_code=eq.${encodeURIComponent(code)}&select=id,name,joined_at&order=joined_at.asc`
    );
    const events = await sb(
      `training_events?session_code=eq.${encodeURIComponent(code)}&select=student_id,event_type,payload,created_at&order=id.asc`
    );
    // reuse local aggregator shape
    const db = { [code]: { students: {}, events: [] } };
    for (const s of students || []) {
      db[code].students[s.id] = { ...s, session_code: code };
    }
    for (const e of events || []) {
      db[code].events.push({ ...e, payload: e.payload || {} });
    }
    saveLocal(db); // cache
    return hostSnapshotLocal(code);
  }

  async function reset(session_code, token) {
    if (token !== "lttc-host") throw new Error("forbidden");
    const code = session_code.trim().toUpperCase();
    if (USE_SB) {
      await sb(`training_events?session_code=eq.${encodeURIComponent(code)}`, { method: "DELETE", prefer: "return=minimal" });
      await sb(`training_students?session_code=eq.${encodeURIComponent(code)}`, { method: "DELETE", prefer: "return=minimal" });
    } else {
      const db = loadLocal();
      delete db[code];
      saveLocal(db);
    }
    return { ok: true };
  }

  // Patch fetch for /api/* used by student.js / host.js / portfolio.html
  const origFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    let path = url;
    try {
      path = new URL(url, location.href).pathname + new URL(url, location.href).search;
    } catch {}

    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: { "Content-Type": "application/json" },
      });

    try {
      if (path === "/api/join" || path.endsWith("/api/join")) {
        const body = JSON.parse(init.body || "{}");
        return json(await join(body));
      }
      if (path === "/api/event" || path.endsWith("/api/event")) {
        const body = JSON.parse(init.body || "{}");
        return json(await postEvent(body));
      }
      if (path.startsWith("/api/me/") && path.endsWith("/portfolio")) {
        const id = path.split("/")[3];
        return json(await me(id));
      }
      if (path.startsWith("/api/me/")) {
        const id = path.split("/")[3];
        return json(await me(id));
      }
      if (path.startsWith("/api/host/") && !path.includes("/stream")) {
        const code = decodeURIComponent(path.split("/")[3] || "202607");
        return json(await hostSnapshot(code));
      }
      if (path === "/api/reset" || path.endsWith("/api/reset")) {
        const body = JSON.parse(init.body || "{}");
        return json(await reset(body.session_code || "202607", body.token));
      }
    } catch (e) {
      return json({ error: String(e.message || e) }, 400);
    }

    // SSE stream: poll snapshot
    if (path.includes("/api/host/") && path.includes("/stream")) {
      const code = decodeURIComponent(path.split("/")[3] || "202607");
      const stream = new ReadableStream({
        async start(controller) {
          const enc = new TextEncoder();
          const send = (obj) => controller.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));
          send({ type: "hello", snapshot: await hostSnapshot(code) });
          const timer = setInterval(async () => {
            try {
              send({ type: "ping", ts: Date.now() / 1000, snapshot: await hostSnapshot(code) });
            } catch {
              /* ignore */
            }
          }, 4000);
          // stop when aborted
          const abort = () => {
            clearInterval(timer);
            try {
              controller.close();
            } catch {}
          };
          if (init.signal) init.signal.addEventListener("abort", abort);
        },
      });
      return new Response(stream, {
        headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
      });
    }

    return origFetch(input, init);
  };

  // Improve EventSource for relative /api host stream — patch host.js uses absolute /api
  // Also expose helper
  window.TrainingStore = { join, postEvent, me, hostSnapshot, reset, mode: USE_SB ? "supabase" : "local" };
})();
