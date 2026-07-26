(() => {
  const PAGES = [
    "join", "open", "a1", "why", "wiliam", "a2",
    "s1", "s2", "s3", "hattie", "hattie_quiz", "shute",
    "break", "s4", "s5", "human", "dashboard", "end",
  ];

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

  const state = {
    studentId: localStorage.getItem("lttc_student_id") || "",
    name: localStorage.getItem("lttc_name") || "",
    session: localStorage.getItem("lttc_session") || "202607",
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
    answered: JSON.parse(localStorage.getItem("lttc_answered") || "{}"),
    votes: JSON.parse(localStorage.getItem("lttc_votes") || "{}"),
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
    const roomKey = "lttc_room_v1";
    const db = JSON.parse(localStorage.getItem(roomKey) || "{}");
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
    const roomKey = "lttc_room_v1";
    const db = JSON.parse(localStorage.getItem(roomKey) || "{}");
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

  function showPage(index) {
    if (PAGES[index] === "join" && state.studentId) index = 1;
    state.pageIndex = Math.max(0, Math.min(index, PAGES.length - 1));
    const page = PAGES[state.pageIndex];
    $$(".screen").forEach((el) => el.classList.toggle("active", el.dataset.page === page));
    $("#pageLabel").textContent = `${Math.max(1, state.pageIndex)} / ${PAGES.length - 1}`;
    const joined = Boolean(state.studentId);
    $("#navdock").hidden = !joined || page === "join";
    if (joined && page !== "join") sendEvent("page_view", { page });
    if (page === "dashboard") refreshMe();
  }

  async function refreshMe() {
    if (!state.studentId) return;
    try {
      const data = await apiMe(state.studentId);
      state.stats = data.stats;
      renderStats();
      const note = localStorage.getItem("lttc_transfer") || "";
      $("#transferOut").textContent = note || "No reflection yet.";
      if (note && $("#transferBox")) $("#transferBox").innerText = note;
    } catch (e) {
      console.warn(e);
    }
  }

  async function join() {
    const name = $("#nameInput").value.trim();
    const session_code = ($("#codeInput").value.trim() || "202607").toUpperCase();
    if (!name) {
      alert("Please enter your name.");
      return;
    }
    $("#joinBtn").disabled = true;
    try {
      const data = await apiJoin({
        name,
        session_code,
        device_id: localStorage.getItem("lttc_device") || uid(),
      });
      localStorage.setItem("lttc_device", data.student_id.slice(0, 8));
      state.studentId = data.student_id;
      state.name = data.name;
      state.session = data.session_code;
      localStorage.setItem("lttc_student_id", state.studentId);
      localStorage.setItem("lttc_name", state.name);
      localStorage.setItem("lttc_session", state.session);
      $("#whoLabel").textContent = `${state.name} · ${state.session}`;
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
        localStorage.setItem("lttc_answered", JSON.stringify(state.answered));
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
        localStorage.setItem("lttc_votes", JSON.stringify(state.votes));
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
          localStorage.setItem(`lttc_share_${strategy}`, text);
        }
      });
    });
    $$(".share-input").forEach((el) => {
      const saved = localStorage.getItem(`lttc_share_${el.dataset.strategy}`);
      if (saved) el.value = saved;
    });

    const icanBtn = $("#saveIcan");
    if (icanBtn) {
      icanBtn.onclick = () => {
        const text = ($("#icanDraft").value || "").trim();
        localStorage.setItem("lttc_ican", text);
        $("#icanSaved").classList.add("show");
        sendEvent("choice", { kind: "ican_draft", text });
      };
      const prev = localStorage.getItem("lttc_ican");
      if (prev) $("#icanDraft").value = prev;
    }
  }

  function setupNav() {
    $("#prevBtn").onclick = () => showPage(state.pageIndex - 1);
    $("#nextBtn").onclick = () => showPage(state.pageIndex + 1);
    $("#dashBtn").onclick = () => showPage(PAGES.indexOf("dashboard"));
    window.addEventListener("keydown", (e) => {
      if (e.target && (e.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName))) return;
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
    window.open(`./portfolio.html?sid=${encodeURIComponent(state.studentId)}`, "_blank");
  }

  $("#joinBtn").onclick = join;
  $("#saveTransfer").onclick = () => {
    const text = $("#transferBox").innerText.trim();
    localStorage.setItem("lttc_transfer", text);
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

  if (state.studentId && state.name) {
    $("#whoLabel").textContent = `${state.name} · ${state.session}`;
    $("#nameInput").value = state.name;
    $("#codeInput").value = state.session;
    showPage(1);
    refreshMe();
  } else {
    showPage(0);
  }
})();
