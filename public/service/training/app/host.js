(() => {
  let es = null;
  let shareFilter = "all";
  let lastSnap = null;
  const $ = (s) => document.querySelector(s);

  const SCENARIO_LABELS = {
    sc1: "1 · Draft revise loop",
    sc2: "2 · Mid-term score only",
    sc3: "3 · Exit ticket → next class",
    sc4: "4 · Final comments after term",
  };
  const SCENARIO_KEY = { sc1: "YES", sc2: "NO", sc3: "YES", sc4: "NO" };

  function log(msg) {
    const el = document.createElement("div");
    const t = new Date().toLocaleTimeString();
    el.textContent = `[${t}] ${msg}`;
    $("#liveLog").prepend(el);
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function renderShares(snap) {
    const wall = $("#shareWall");
    const shares = (snap.shares || []).filter(
      (s) => shareFilter === "all" || s.strategy === shareFilter
    );
    if (!shares.length) {
      wall.innerHTML = "<p class='figure-caption'>No shared ideas yet.</p>";
      return;
    }
    wall.innerHTML = shares
      .map(
        (s) => `<div class="share-card">
        <div class="meta">${escapeHtml(s.strategy || "?").toUpperCase()} · ${escapeHtml(s.name)}</div>
        <div class="body">${escapeHtml(s.text)}</div>
      </div>`
      )
      .join("");
  }

  function showStudentDetail(s) {
    const box = $("#studentDetail");
    if (!s) {
      box.innerHTML = "<p class='figure-caption'>Select a student to inspect performance detail.</p>";
      return;
    }
    const votes = Object.entries(s.scenario_map || {})
      .map(([id, v]) => `${SCENARIO_LABELS[id] || id}: <strong>${escapeHtml(v)}</strong> (key ${SCENARIO_KEY[id] || "?"})`)
      .join("<br>") || "<em>No votes yet</em>";
    const shares = Object.entries(s.share_by_strategy || {})
      .map(([k, t]) => `<strong>${escapeHtml(k).toUpperCase()}:</strong> ${escapeHtml(t)}`)
      .join("<br>") || "<em>No GenAI ideas yet</em>";
    const match = s.match_latest
      ? `${s.match_latest.score}/${s.match_latest.total}${s.match_latest.correct ? " · all correct" : ""}`
      : "—";
    box.innerHTML = `
      <h3 style="margin-top:0">${escapeHtml(s.name)}</h3>
      <p>Pages ${s.pages_viewed} · Quiz ${s.quiz_correct}/${s.quiz_attempted} (${s.accuracy || 0}%) ·
      Votes ${s.scenario_votes || 0} · Shares ${s.share_ideas || 0} · Match ${match}</p>
      <h3>Scenario votes</h3>
      <p>${votes}</p>
      <h3>GenAI ideas</h3>
      <p>${shares}</p>
    `;
  }

  function renderSnapshot(snap) {
    lastSnap = snap;
    $("#sessionLabel").textContent = `Instructor live dashboard · Session ${snap.session_code}`;
    $("#nStudents").textContent = snap.student_count;
    $("#nTranslate").textContent = snap.totals.translate_clicks;
    $("#nQuiz").textContent = snap.totals.quiz_attempted;
    $("#nAcc").textContent = `${snap.totals.accuracy}%`;
    $("#nShare").textContent = snap.totals.share_ideas || 0;
    $("#nMatch").textContent = snap.totals.match_n || 0;

    const sb = $("#scenarioBreak");
    const scenarios = Object.entries(snap.scenario_breakdown || {});
    if (!scenarios.length) {
      sb.innerHTML = "<p class='figure-caption'>No scenario votes yet.</p>";
    } else {
      sb.innerHTML = scenarios
        .map(([id, info]) => {
          const n = info.n || 0;
          const yes = info.YES || 0;
          const no = info.NO || 0;
          const yesPct = n ? Math.round((100 * yes) / n) : 0;
          const key = SCENARIO_KEY[id] || "";
          return `<div style="margin-bottom:12px">
            <strong>${SCENARIO_LABELS[id] || id}</strong>
            <span class="figure-caption"> · key ${key} · Yes ${yes} / No ${no}</span>
            <div class="bar"><i style="width:${yesPct}%"></i></div>
          </div>`;
        })
        .join("");
    }

    const qb = $("#quizBreak");
    const entries = Object.entries(snap.quiz_breakdown || {});
    if (!entries.length) {
      qb.innerHTML = "<p class='figure-caption'>No quiz answers yet.</p>";
    } else {
      qb.innerHTML = "";
      entries.forEach(([qid, info]) => {
        const acc = info.n ? Math.round((100 * info.correct) / info.n) : 0;
        const div = document.createElement("div");
        div.style.marginBottom = "12px";
        div.innerHTML = `<strong>${escapeHtml(qid)}</strong> · ${info.correct}/${info.n} (${acc}%)
          <div class="bar"><i style="width:${acc}%"></i></div>`;
        qb.appendChild(div);
      });
    }

    const mb = $("#matchBreak");
    const m = snap.match_breakdown || { n: 0, correct: 0 };
    if (!m.n) {
      mb.innerHTML = "<p class='figure-caption'>No match submissions yet.</p>";
    } else {
      const acc = Math.round((100 * m.correct) / m.n);
      mb.innerHTML = `<p><strong>${m.correct}/${m.n}</strong> fully correct (${acc}%)</p>
        <div class="bar"><i style="width:${acc}%"></i></div>`;
    }

    renderShares(snap);

    const body = $("#studentRows");
    body.innerHTML = "";
    (snap.students || []).forEach((s, i) => {
      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";
      const matchLabel = s.match_latest
        ? `${s.match_latest.score || 0}/${s.match_latest.total || 0}`
        : "—";
      tr.innerHTML = `<td>${i + 1}</td><td>${escapeHtml(s.name)}</td><td>${s.pages_viewed}</td>
        <td>${s.quiz_correct}/${s.quiz_attempted}</td><td>${s.accuracy || 0}%</td>
        <td>${s.scenario_votes || 0}</td><td>${s.share_ideas || 0}</td><td>${matchLabel}</td>`;
      tr.onclick = () => showStudentDetail(s);
      body.appendChild(tr);
    });
  }

  async function fetchSnapshot() {
    const code = ($("#codeInput").value || "202607").trim().toUpperCase();
    let snap;
    if (window.TrainingStore?.hostSnapshot) {
      snap = await window.TrainingStore.hostSnapshot(code);
    } else {
      const res = await fetch(`/api/host/${code}`);
      snap = await res.json();
    }
    renderSnapshot(snap);
    return code;
  }

  function connectStream(code) {
    if (es) {
      clearInterval(es);
      es = null;
    }
    log("Connected — live refresh every 4s");
    fetchSnapshot();
    es = setInterval(() => {
      fetchSnapshot().catch(() => log("Refresh failed — retrying…"));
    }, 4000);
  }

  $("#shareFilters").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-filter]");
    if (!btn) return;
    shareFilter = btn.dataset.filter;
    Array.from(document.querySelectorAll("#shareFilters button")).forEach((b) =>
      b.classList.toggle("active", b === btn)
    );
    if (lastSnap) renderShares(lastSnap);
  });

  $("#connectBtn").onclick = async () => {
    const code = await fetchSnapshot();
    connectStream(code);
  };

  $("#resetBtn").onclick = async () => {
    if (!confirm("Clear all student data for this session?")) return;
    const session_code = ($("#codeInput").value || "202607").trim().toUpperCase();
    if (window.TrainingStore?.reset) {
      await window.TrainingStore.reset(session_code, "ittc-host");
    } else {
      await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_code, token: "ittc-host" }),
      });
    }
    await fetchSnapshot();
  };

  fetchSnapshot().then((code) => connectStream(code));
})();
