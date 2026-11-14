/* Achievements + "Brainrot Wrapped" (all local, no backend). */
(function () {
  "use strict";
  const KEY = "br_ach";
  const $ = (s, r = document) => r.querySelector(s);
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
  const toast = (m) => { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2600); };

  // k = counter key, t = threshold
  const DEFS = [
    { id: "first", e: "📖", n: "First Rot", d: "Apni pehli comic padho", k: "story", t: 1 },
    { id: "story10", e: "📚", n: "Comic Addict", d: "10 stories padho", k: "story", t: 10 },
    { id: "hot", e: "💀", n: "Terminally Cooked", d: "Brainrot score 90+ lao", k: "hot", t: 1 },
    { id: "roastbattle", e: "⚔️", n: "Battle Ready", d: "Roast Battle mode try karo", k: "battle", t: 1 },
    { id: "bonus", e: "🌀", n: "Plot Twister", d: "Bonus round khelo", k: "bonus", t: 1 },
    { id: "roast1", e: "🔥", n: "Roasted", d: "Roast Bot se pehla roast lo", k: "roast", t: 1 },
    { id: "roast10", e: "🥵", n: "Burn Victim", d: "10 roasts lo", k: "roast", t: 10 },
    { id: "cookedroast", e: "🌋", n: "Cooked Roast", d: "Cooked level par roast lo", k: "cookedRoast", t: 1 },
    { id: "friend", e: "🎯", n: "Friendly Fire", d: "Kisi dost ko roast karo", k: "friend", t: 1 },
    { id: "reverse", e: "🏆", n: "Roast the Bot", d: "Bot ko roast karo", k: "reverse", t: 1 },
    { id: "r80", e: "👑", n: "Roast King/Queen", d: "Reverse roast mein 80+ score lao", k: "r80", t: 1 },
    { id: "ai", e: "✨", n: "AI Author", d: "AI se comic likhwao", k: "ai", t: 1 },
    { id: "custom", e: "🧑‍🎤", n: "Character Creator", d: "Apna character banao", k: "custom", t: 1 },
    { id: "share", e: "📤", n: "Spread the Rot", d: "Kuch share karo", k: "share", t: 1 },
    { id: "cooked", e: "🥚", n: "Easter Egg", d: "Cooked mode dhundo", k: "cooked", t: 1 }
  ];

  function event(name, data) {
    const d = load(); d.c = d.c || {}; d.got = d.got || {}; d.moods = d.moods || {}; d.max = d.max || 0;
    const inc = (k) => (d.c[k] = (d.c[k] || 0) + 1);
    inc(name);
    data = data || {};
    if (name === "story") {
      if (data.score > d.max) d.max = data.score;
      if (data.score >= 90) inc("hot");
      if (data.mode === "roast") inc("battle");
      if (data.mood) d.moods[data.mood] = (d.moods[data.mood] || 0) + 1;
    }
    if (name === "roast" && data.level === 2) inc("cookedRoast");
    if (name === "reverse" && data.score >= 80) inc("r80");
    DEFS.forEach((b) => {
      if (!d.got[b.id] && (d.c[b.k] || 0) >= b.t) { d.got[b.id] = Date.now(); setTimeout(() => toast("🏅 Badge unlocked: " + b.e + " " + b.n), 400); }
    });
    save(d);
  }

  function modal(html) {
    const m = document.createElement("div"); m.className = "modal"; m.innerHTML = '<div class="box">' + html + "</div>";
    m.addEventListener("click", (e) => { if (e.target === m || e.target.closest("[data-x]")) m.remove(); });
    document.addEventListener("keydown", function k(e) { if (e.key === "Escape") { m.remove(); document.removeEventListener("keydown", k); } });
    document.body.appendChild(m); return m;
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function openBadges() {
    const d = load(), got = d.got || {}, n = DEFS.filter((b) => got[b.id]).length;
    modal('<button class="btn small x" data-x type="button">✕</button><h2>🏅 Badges</h2><div>' + n + " / " + DEFS.length + " unlocked</div><div class=\"badges\">" +
      DEFS.map((b) => '<div class="badge' + (got[b.id] ? "" : " lock") + '"><i>' + b.e + "</i><b>" + esc(b.n) + "</b>" + esc(b.d) + "</div>").join("") + "</div>");
  }

  function loadH2C() {
    if (window.html2canvas) return Promise.resolve();
    return new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  }
  function stats() {
    const d = load(), c = d.c || {}, mo = d.moods || {};
    let streak = 0, best = 0;
    try { streak = (JSON.parse(localStorage.getItem("br_streak")) || {}).n || 0; best = +localStorage.getItem("br_rbbest") || 0; } catch (e) {}
    const top = Object.entries(mo).sort((a, b) => b[1] - a[1])[0];
    const moodName = top && window.MOODS ? (window.MOODS.find((m) => m.id === top[0]) || {}).name : "";
    const stories = c.story || 0, roasts = (c.roast || 0) + (c.friend || 0);
    const title = d.max >= 90 ? "Terminally Cooked 💀" : roasts > stories ? "Professional Roastee 🔥" : stories >= 5 ? "Comic Addict 📚" : stories + roasts === 0 ? "Fresh NPC 🤖" : "Rising Rot 🌱";
    return { stories, roasts, max: d.max || 0, best, streak, moodName: moodName || "—", badges: DEFS.filter((b) => (d.got || {})[b.id]).length, title };
  }
  function openWrapped() {
    const s = stats();
    const m = modal('<button class="btn small x" data-x type="button">✕</button><h2>🎁 Brainrot Wrapped</h2><div id="wrapCard" class="wrap"><div class="ttl">' + esc(s.title) + "</div><div>Tumhara brainrot report</div>" +
      '<div class="grid"><div><b>' + s.stories + "</b>Stories padhi</div><div><b>" + s.roasts + "</b>Roasts liye</div><div><b>" + s.max + '%</b>Best brainrot score</div><div><b>' + s.best + "/100</b>Best reverse roast</div><div><b>" + s.streak + " din</b>Streak</div><div><b>" + s.badges + "/" + DEFS.length + "</b>Badges</div></div>" +
      "<div style=\"margin-top:10px;font-weight:600\">Favourite mood: " + esc(s.moodName) + '</div><div style="margin-top:8px;font-size:.75rem;font-weight:700;opacity:.8">THE BRAINROT 🧠</div></div>' +
      '<div class="bar" style="margin-top:14px"><button class="btn small primary" id="wrapSave" type="button">🖼 Save card</button></div>');
    $("#wrapSave", m).onclick = async () => {
      toast("Card ban raha hai… 🖼");
      try { await loadH2C(); } catch (e) { return toast("Card library load nahi hui (internet check karo)"); }
      try {
        const canvas = await window.html2canvas($("#wrapCard", m), { backgroundColor: null, scale: 2 });
        canvas.toBlob(async (blob) => {
          const file = new File([blob], "wrapped.png", { type: "image/png" });
          if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: "My Brainrot Wrapped" }); return; } catch (e) {} }
          const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "brainrot-wrapped.png"; a.click(); toast("Saved! 🎁");
        }, "image/png");
        event("share");
      } catch (e) { toast("Card nahi ban paya"); }
    };
  }

  window.Ach = { event, DEFS, stats };
  document.addEventListener("click", (e) => {
    if (e.target.closest("#openBadges")) openBadges();
    else if (e.target.closest("#openWrapped")) openWrapped();
  });
})();
