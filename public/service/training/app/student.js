(() => {
  const PAGES = [
    "join", "open", "a1", "why", "wiliam", "a2",
    "s1", "s2", "s3", "hattie", "hattie_quiz", "shute",
    "break", "s4", "s5", "human", "dashboard", "end",
  ];

  /** Short titles for the bottom page scroller (skip login). */
  const PAGE_LABELS = {
    open: "Opening",
    a1: "Activity 1 · Is this formative?",
    why: "Why FA matters",
    wiliam: "Five key strategies",
    a2: "Activity 2 · Match strategies",
    s1: "Strategy 1 · Intentions & criteria",
    s2: "Strategy 2 · Eliciting evidence",
    s3: "Strategy 3 · Feedback forward",
    hattie: "Hattie & Timperley",
    hattie_quiz: "Feedback practice",
    shute: "Shute guidelines",
    break: "Break",
    s4: "Strategy 4 · Peers as resources",
    s5: "Strategy 5 · Owners of learning",
    human: "What must stay human",
    dashboard: "Your dashboard",
    end: "Thank you",
  };

  const MATCH_KEY = {
    s1: "Know what excellence looks like before drafting",
    s2: "Surface misunderstandings early with quick checks",
    s3: "Get next-step comments that change the next draft",
    s4: "Use structured peer feedback on shared criteria",
    s5: "Self-assess, set SMART goals, track your growth",
  };

  const MATCH_LABELS = {
    s1: "Strategy 1 · Intentions & criteria",
    s2: "Strategy 2 · Eliciting evidence",
    s3: "Strategy 3 · Feedback that moves forward",
    s4: "Strategy 4 · Peers as resources",
    s5: "Strategy 5 · Owners of learning",
  };

  function lsGet(key, fallback = "") {
    try {
      return localStorage.getItem(key) || localStorage.getItem(key.replace(/^ittc_/, "lttc_")) || fallback;
    } catch {
      return fallback;
    }
  }

  const state = {
    studentId: lsGet("ittc_student_id"),
    name: lsGet("ittc_name"),
    session: lsGet("ittc_session", "202607"),
    pageIndex: 0,
    stats: {
      translate_clicks: 0,
      quiz_attempted: 0,
      quiz_correct: 0,
      pages_viewed: 0,
      choices: 0,
      share_ideas: 0,
      scenario_votes: 0,
    },
    answered: JSON.parse(lsGet("ittc_answered", "{}")),
    votes: JSON.parse(lsGet("ittc_votes", "{}")),
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function uid() {
    return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  async function apiJoin(body) {
    if (window.TrainingStore?.join) return window.TrainingStore.join(body);
    // Fallback: pure local join (no network)
    const student_id = uid();
    const session_code = (body.session_code || "202607").trim().toUpperCase();
    const name = body.name || "Student";
    const roomKey = "ittc_room_v1";
    const db = JSON.parse(localStorage.getItem(roomKey) || localStorage.getItem("lttc_room_v1") || "{}");
    db[session_code] ||= { students: {}, events: [] };
    db[session_code].students[student_id] = {
      id: student_id,
      name,
      device_id: body.device_id,
      joined_at: Date.now() / 1000,
      session_code,
    };
    localStorage.setItem(roomKey, JSON.stringify(db));
    return { student_id, session_code, name };
  }

  async function apiEvent(body) {
    if (window.TrainingStore?.postEvent) return window.TrainingStore.postEvent(body);
    const roomKey = "ittc_room_v1";
    const db = JSON.parse(localStorage.getItem(roomKey) || localStorage.getItem("lttc_room_v1") || "{}");
    let code = null;
    for (const [c, room] of Object.entries(db)) {
      if (room.students?.[body.student_id]) {
        code = c;
        break;
      }
    }
    if (!code) throw new Error("unknown student");
    db[code].events.push({
      student_id: body.student_id,
      event_type: body.event_type,
      payload: body.payload || {},
      created_at: Date.now() / 1000,
    });
    localStorage.setItem(roomKey, JSON.stringify(db));
    return { ok: true, stats: state.stats };
  }

  async function apiMe(studentId) {
    if (window.TrainingStore?.me) return window.TrainingStore.me(studentId);
    return {
      student: { id: studentId, name: state.name, session_code: state.session },
      stats: state.stats,
    };
  }

  async function sendEvent(event_type, payload = {}) {
    if (!state.studentId) return null;
    try {
      const data = await apiEvent({
        student_id: state.studentId,
        event_type,
        payload,
      });
      if (data.stats) {
        state.stats = data.stats;
        renderStats();
      }
      return data;
    } catch (e) {
      console.warn("event failed", e);
      return null;
    }
  }

  function renderStats() {
    const map = {
      st_tr: "translate_clicks",
      st_q: "quiz_attempted",
      st_c: "quiz_correct",
      st_p: "pages_viewed",
      st_share: "share_ideas",
      st_vote: "scenario_votes",
    };
    Object.entries(map).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = state.stats[key] || 0;
    });
  }

  function isJoined() {
    return Boolean(state.studentId && state.name);
  }

  function navPages() {
    return PAGES.map((id, index) => ({ id, index, label: PAGE_LABELS[id] })).filter((p) => p.label);
  }

  function buildPageScroller() {
    const scroller = $("#pageScroller");
    if (!scroller || scroller.dataset.built === "1") return;
    scroller.innerHTML = "";
    navPages().forEach((p, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "page-chip";
      btn.dataset.page = p.id;
      btn.dataset.index = String(p.index);
      btn.setAttribute("role", "listitem");
      btn.innerHTML = `<span class="n">${String(i + 1).padStart(2, "0")}</span>${p.label}`;
      btn.onclick = () => {
        if (!isJoined()) return;
        showPage(p.index);
      };
      scroller.appendChild(btn);
    });
    scroller.dataset.built = "1";
  }

  function syncPageScroller() {
    const scroller = $("#pageScroller");
    if (!scroller) return;
    const page = PAGES[state.pageIndex];
    let active = null;
    scroller.querySelectorAll(".page-chip").forEach((btn) => {
      const on = btn.dataset.page === page;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-current", on ? "page" : "false");
      if (on) active = btn;
    });
    if (active) {
      const left = active.offsetLeft - (scroller.clientWidth - active.offsetWidth) / 2;
      scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
    const prev = $("#prevBtn");
    const next = $("#nextBtn");
    if (prev) prev.disabled = state.pageIndex <= 1;
    if (next) next.disabled = state.pageIndex >= PAGES.length - 1;
  }

  function showPage(index, { forceJoin = false } = {}) {
    // Never leave the login screen until name login succeeds this visit.
    if (forceJoin) index = 0;
    else if (!isJoined()) index = 0;
    else if (PAGES[index] === "join") index = 1;
    state.pageIndex = Math.max(0, Math.min(index, PAGES.length - 1));
    const page = PAGES[state.pageIndex];
    $$(".screen").forEach((el) => el.classList.toggle("active", el.dataset.page === page));
    const joined = isJoined() && page !== "join";
    $("#navdock").hidden = !joined;
    if (joined) {
      buildPageScroller();
      syncPageScroller();
    }
    if (isJoined() && page !== "join") sendEvent("page_view", { page });
    if (page === "dashboard") refreshMe();
  }

  async function refreshMe() {
    if (!state.studentId) return;
    try {
      const data = await apiMe(state.studentId);
      state.stats = data.stats;
      renderStats();
      const note = lsGet("ittc_transfer");
      $("#transferOut").textContent = note || "No reflection yet.";
      if (note && $("#transferBox")) $("#transferBox").innerText = note;
    } catch (e) {
      console.warn(e);
    }
  }

  function clearSavedLogin() {
    [
      "ittc_student_id",
      "ittc_name",
      "ittc_session",
      "ittc_device",
      "ittc_answered",
      "ittc_votes",
      "ittc_transfer",
      "ittc_ican",
      "lttc_student_id",
      "lttc_name",
      "lttc_session",
      "lttc_device",
      "lttc_answered",
      "lttc_votes",
      "lttc_transfer",
      "lttc_ican",
    ].forEach((k) => localStorage.removeItem(k));
    ["s1", "s2", "s3", "s4", "s5"].forEach((s) => {
      localStorage.removeItem(`ittc_share_${s}`);
      localStorage.removeItem(`lttc_share_${s}`);
    });
    state.studentId = "";
    state.name = "";
    state.session = "202607";
    state.answered = {};
    state.votes = {};
    if ($("#nameInput")) $("#nameInput").value = "";
    if ($("#codeInput")) $("#codeInput").value = "202607";
    if ($("#whoLabel")) $("#whoLabel").textContent = "Not joined — enter your name";
    const clearBtn = $("#clearLoginBtn");
    if (clearBtn) clearBtn.hidden = true;
    showPage(0);
    $("#nameInput")?.focus();
  }

  async function join() {
    const name = $("#nameInput").value.trim();
    const session_code = ($("#codeInput").value.trim() || "202607").toUpperCase();
    if (!name) {
      alert("Please enter your name.");
      return;
    }
    const prevId = lsGet("ittc_student_id");
    const prevName = lsGet("ittc_name");
    const prevSession = (lsGet("ittc_session") || "").toUpperCase();
    // Reuse this browser session only when the same name + code are submitted again.
    if (prevId && prevName === name && prevSession === session_code) {
      state.studentId = prevId;
      state.name = prevName;
      state.session = prevSession;
      $("#whoLabel").textContent = `${state.name} · ${state.session}`;
      const clearBtn = $("#clearLoginBtn");
      if (clearBtn) clearBtn.hidden = true;
      showPage(1);
      refreshMe();
      return;
    }
    $("#joinBtn").disabled = true;
    try {
      const data = await apiJoin({
        name,
        session_code,
        device_id: lsGet("ittc_device") || uid(),
      });
      localStorage.setItem("ittc_device", data.student_id.slice(0, 8));
      state.studentId = data.student_id;
      state.name = data.name;
      state.session = data.session_code;
      localStorage.setItem("ittc_student_id", state.studentId);
      localStorage.setItem("ittc_name", state.name);
      localStorage.setItem("ittc_session", state.session);
      $("#whoLabel").textContent = `${state.name} · ${state.session}`;
      const clearBtn = $("#clearLoginBtn");
      if (clearBtn) clearBtn.hidden = true;
      showPage(1);
    } catch (e) {
      alert("Could not join. Please try again, or clear this site’s data for apriljzhang.com and reload.");
      console.error(e);
    } finally {
      $("#joinBtn").disabled = false;
    }
  }

  function setupTranslations() {
    $$(".tr-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.tr;
        const panel = document.querySelector(`[data-tr-panel="${id}"]`);
        if (!panel) return;
        const showing = panel.classList.toggle("show");
        btn.classList.toggle("active", showing);
        btn.textContent = showing ? "EN" : "中文";
        sendEvent("translate_click", { block_id: id, to: showing ? "zh" : "en" });
      });
    });
  }

  function setupQuizzes() {
    $$(".choice[data-quiz]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const quizId = btn.dataset.quiz;
        if (state.answered[quizId]) return;
        const group = $$(`.choice[data-quiz="${quizId}"]`);
        group.forEach((b) => b.classList.remove("selected", "correct", "wrong"));
        btn.classList.add("selected");
        const correct = btn.dataset.correct === "true";
        group.forEach((b) => {
          if (b.dataset.correct === "true") b.classList.add("correct");
        });
        if (!correct) btn.classList.add("wrong");
        state.answered[quizId] = btn.dataset.answer;
        localStorage.setItem("ittc_answered", JSON.stringify(state.answered));
        const result = $(`#qr_${quizId}`);
        if (result) {
          result.hidden = false;
          result.textContent = correct ? "Correct." : "Not quite — see the highlighted answer.";
        }
        sendEvent("quiz_answer", {
          quiz_id: quizId,
          answer: btn.dataset.answer,
          correct,
        });
      });
    });
  }

  function setupScenarioVotes() {
    $$(".choice.vote").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sid = btn.dataset.scenario;
        const vote = btn.dataset.vote;
        const group = $$(`.choice.vote[data-scenario="${sid}"]`);
        group.forEach((b) => b.classList.remove("selected", "correct", "wrong"));
        btn.classList.add("selected");
        state.votes[sid] = vote;
        localStorage.setItem("ittc_votes", JSON.stringify(state.votes));
        sendEvent("scenario_vote", { scenario_id: sid, vote });
      });
    });
    // restore
    Object.entries(state.votes).forEach(([sid, vote]) => {
      const btn = $(`.choice.vote[data-scenario="${sid}"][data-vote="${vote}"]`);
      if (btn) btn.classList.add("selected");
    });
    const reveal = $("#revealA1Key");
    if (reveal) {
      reveal.onclick = () => {
        $("#a1Key").hidden = false;
        // lightly mark keys
        const key = { sc1: "YES", sc2: "NO", sc3: "YES", sc4: "NO" };
        Object.entries(key).forEach(([sid, ans]) => {
          $$(`.choice.vote[data-scenario="${sid}"]`).forEach((b) => {
            if (b.dataset.vote === ans) b.classList.add("correct");
            else if (b.classList.contains("selected")) b.classList.add("wrong");
          });
        });
      };
    }
  }

  function setupMatch() {
    const board = $("#matchBoard");
    if (!board) return;
    const goals = Object.entries(MATCH_KEY)
      .map(([id, text]) => ({ id, text }))
      .sort(() => Math.random() - 0.5);

    board.innerHTML = Object.keys(MATCH_LABELS)
      .map((sid) => {
        const opts = goals
          .map((g) => `<option value="${g.id}">${g.text}</option>`)
          .join("");
        return `<div class="match-item strategy" data-sid="${sid}">
          ${MATCH_LABELS[sid]}
          <select data-match="${sid}">
            <option value="">Choose the matching goal…</option>
            ${opts}
          </select>
        </div>`;
      })
      .join("");

    $("#submitMatch").onclick = () => {
      const pairs = {};
      let score = 0;
      const total = Object.keys(MATCH_KEY).length;
      Object.keys(MATCH_KEY).forEach((sid) => {
        const sel = $(`select[data-match="${sid}"]`);
        const val = sel.value;
        pairs[sid] = val;
        const row = sel.closest(".match-item");
        row.classList.remove("correct", "wrong");
        if (val === sid) {
          score += 1;
          row.style.borderColor = "var(--color-ok)";
        } else if (val) {
          row.style.borderColor = "var(--color-danger)";
        }
      });
      const correct = score === total;
      const result = $("#matchResult");
      result.hidden = false;
      result.textContent = correct
        ? "All five matched — nice work."
        : `You matched ${score}/${total}. Adjust and try again, or continue and revisit later.`;
      sendEvent("match_answer", { pairs, correct, score, total });
    };
  }

  function setupShares() {
    $$(".share-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const strategy = btn.dataset.strategy;
        const input = $(`.share-input[data-strategy="${strategy}"]`);
        const text = (input?.value || "").trim();
        if (!text) {
          alert("Write one short idea before sharing.");
          return;
        }
        btn.disabled = true;
        const data = await sendEvent("share_idea", { strategy, text });
        btn.disabled = false;
        if (data) {
          const saved = $(`.share-saved[data-strategy="${strategy}"]`);
          if (saved) saved.classList.add("show");
          localStorage.setItem(`ittc_share_${strategy}`, text);
        }
      });
    });
    $$(".share-input").forEach((el) => {
      const saved = lsGet(`ittc_share_${el.dataset.strategy}`);
      if (saved) el.value = saved;
    });

    const icanBtn = $("#saveIcan");
    if (icanBtn) {
      icanBtn.onclick = () => {
        const text = ($("#icanDraft").value || "").trim();
        localStorage.setItem("ittc_ican", text);
        $("#icanSaved").classList.add("show");
        sendEvent("choice", { kind: "ican_draft", text });
      };
      const prev = lsGet("ittc_ican");
      if (prev) $("#icanDraft").value = prev;
    }
  }

  function setupNav() {
    buildPageScroller();
    $("#prevBtn").onclick = () => {
      if (!isJoined()) return;
      showPage(state.pageIndex - 1);
    };
    $("#nextBtn").onclick = () => {
      if (!isJoined()) return;
      showPage(state.pageIndex + 1);
    };
    window.addEventListener("keydown", (e) => {
      if (e.target && (e.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName))) return;
      if (!isJoined()) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        showPage(state.pageIndex + 1);
      }
      if (e.key === "ArrowLeft") showPage(state.pageIndex - 1);
    });
  }

  function openPortfolioPdf() {
    if (!state.studentId) {
      alert("Please login with your name first.");
      return;
    }
    window.open(`./portfolio.html?v=7&sid=${encodeURIComponent(state.studentId)}`, "_blank");
  }

  $("#joinBtn").onclick = join;
  $("#clearLoginBtn")?.addEventListener("click", clearSavedLogin);
  $("#nameInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      join();
    }
  });
  // Click the top name line to return to login and change name.
  $("#whoLabel")?.addEventListener("click", () => {
    showPage(0, { forceJoin: true });
    if ($("#nameInput")) $("#nameInput").value = state.name || "";
    if ($("#codeInput")) $("#codeInput").value = state.session || "202607";
    const clearBtn = $("#clearLoginBtn");
    if (clearBtn) clearBtn.hidden = !lsGet("ittc_name");
    $("#nameInput")?.focus();
  });
  $("#saveTransfer").onclick = () => {
    const text = $("#transferBox").innerText.trim();
    localStorage.setItem("ittc_transfer", text);
    $("#transferSaved").hidden = false;
    sendEvent("choice", { kind: "transfer_note", text });
    $("#transferOut").textContent = text || "No reflection yet.";
  };
  const pdfDash = $("#downloadPdfBtn");
  const pdfEnd = $("#downloadPdfBtnEnd");
  if (pdfDash) pdfDash.onclick = openPortfolioPdf;
  if (pdfEnd) pdfEnd.onclick = openPortfolioPdf;

  setupTranslations();
  setupQuizzes();
  setupScenarioVotes();
  setupMatch();
  setupShares();
  setupNav();

  // Do not auto-resume a previous visit — always require Login on this page load.
  // (Old name "a" on this laptop came from localStorage after an earlier test.)
  if (state.studentId && !state.name) {
    localStorage.removeItem("ittc_student_id");
  }
  state.studentId = "";
  state.name = "";
  state.session = lsGet("ittc_session", "202607");

  if ($("#nameInput")) $("#nameInput").value = "";
  if ($("#codeInput")) $("#codeInput").value = state.session || "202607";
  if ($("#whoLabel")) {
    $("#whoLabel").textContent = "Not joined — enter your name";
    $("#whoLabel").title = "Click to change name after login";
    $("#whoLabel").style.cursor = "pointer";
  }
  const clearBtn = $("#clearLoginBtn");
  if (clearBtn) clearBtn.hidden = !(lsGet("ittc_name") || lsGet("ittc_student_id"));
  showPage(0, { forceJoin: true });
  $("#nameInput")?.focus();
})();
