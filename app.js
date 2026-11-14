(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const CHARS = window.CHARS, MOODS = window.MOODS, EX = window.EX;
  const ORDER = ["mood", "chars", "msg", "story"];
  const YOU = { id: "you", name: "Tum", g: "m", tag: "" };
  const ROT = ["Mild", "Medium", "Cooked"];
  const state = { aiLines: null, mood: null, chars: [], text: "", convo: [], baseLen: 0, voice: true, sfx: true, rot: 1, mode: "story", score: 0 };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((p) => p[1]);
  const rp = (a) => a[Math.floor(Math.random() * a.length)];
  const memory = new WeakMap();
  function pick(arr, n) {
    const prev = memory.get(arr) || [];
    const idx = shuffle(arr.map((_, i) => i));
    const out = [...idx.filter((i) => !prev.includes(i)), ...idx.filter((i) => prev.includes(i))].slice(0, n);
    memory.set(arr, out);
    return out.map((i) => arr[i]);
  }
  function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 1900); }
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  const Ach = { event: (n, d) => { try { window.Ach && window.Ach.event(n, d); } catch (e) {} } };
  let aiServer = false;
  fetch("/api/roast", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((j) => { if (j && j.ok) { aiServer = true; const b = $("#aiModeBtn"); if (b) b.hidden = false; } }).catch(() => {});
  /* custom characters (persisted) */
  const NATURES = {
    dramatic: ["Dramebaaz", ["Mera toh dil hi toot gaya!", "Ye toh poori duniya ki saazish hai!", "Main abhi ro dunga, camera lagao."]],
    lazy: ["Aalsi", ["Kal karenge, aaj mood nahi hai.", "Bhai 5 minute aur, phir pakka.", "Itna kaun sochta hai, so jaate hain."]],
    topper: ["Topper", ["Maine toh syllabus 3 baar khatam kiya.", "Technically ye galat approach hai.", "Notes chahiye toh bol, 50 rupaye per page."]],
    savage: ["Savage", ["Itna aura leke aaya hai ya EMI pe?", "Roast karun? Tension mat le, free hai.", "Tu kya bol raha hai, mujhe toh buffering lagi."]],
    foodie: ["Foodie", ["Pehle khana, phir drama.", "Samosa ho toh main sab maaf kar dun.", "Ye baat chai pe karte hain, bhookh lagi hai."]],
    gossip: ["Gossip Queen/King", ["Suna tune? Poori colony ko pata hai!", "Main kisi ko nahi bataunga, bas 10 logo ko.", "Mere paas breaking news hai, baith."]]
  };
  const CUSTOM_IDS = [];
  (function restoreCustom() { (JSON.parse(localStorage.getItem("br_custom") || "[]")).forEach((c) => { if (c && c.id && c.sig) { CHARS[c.id] = c; CUSTOM_IDS.push(c.id); } }); })();

  /* ================= SFX (WebAudio, no assets needed) ================= */
  let ac;
  function tone(f1, f2, dur, type = "sine", vol = 0.25, delay = 0) {
    if (!state.sfx) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === "suspended") ac.resume();
      const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay;
      o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(Math.max(f2, 1), t + dur);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur + 0.03);
    } catch {}
  }
  const SFX = {
    pop: () => tone(500, 900, 0.1, "triangle", 0.18),
    whoosh: () => tone(200, 1200, 0.28, "sawtooth", 0.05),
    boom: () => { tone(120, 30, 0.7, "sine", 0.7); tone(60, 25, 0.8, "square", 0.12); },
    bruh: () => tone(220, 80, 0.45, "sawtooth", 0.2),
    dundun: () => [0, 0.22, 0.44].forEach((d, i) => tone(i < 2 ? 150 : 100, i < 2 ? 140 : 60, 0.35, "square", 0.22, d)),
    ding: () => { tone(880, 1320, 0.25, "sine", 0.28); tone(1320, 1760, 0.3, "sine", 0.18, 0.12); },
    laugh: () => [0, 0.12, 0.24, 0.36].forEach((d, i) => tone(300 + i * 40, 260 + i * 20, 0.1, "sawtooth", 0.12, d))
  };
  $("#sfx").onclick = () => { state.sfx = !state.sfx; $("#sfx").textContent = state.sfx ? "🎵 SFX on" : "🔇 SFX off"; SFX.pop(); };

  /* ================= cartoon avatars (original procedural SVG) ================= */
  function rng(seed) {
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  }
  const INK = "#1a1a24";
  function avatar(c) {
    const r = rng(c.id), pk = (a) => a[Math.floor(r() * a.length)], f = c.g === "f";
    const skin = pk(["#f6d3b3", "#eab98f", "#d39c70", "#b87b4f", "#9a6340"]);
    const hair = c.old ? "#dcdcdc" : pk(["#1b1b1b", "#2c1a12", "#4a2c1a", "#1d2540", "#6a3b1c"]);
    const shirt = pk(["#e5484d", "#3e63dd", "#30a46c", "#f5a524", "#8e4ec6", "#12a594", "#ef5da8", "#ff8b3e"]);
    const fs = pk(["long", "bob", "bun", "pony"]), ms = pk(["short", "cap", "curly", "bald", "spike", "short"]);
    const gl = r() < 0.22, st = r() < 0.4, bi = r() < 0.4, bd = r() < 0.2;
    const style = c.id === "you" ? "short" : f ? fs : ms;
    const S = `stroke="${INK}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
    let back = "", front = "", extra = "";
    if (style === "long") back = `<path d="M26 56 Q20 130 44 130 L76 130 Q100 130 94 56Z" fill="${hair}" ${S}/>`;
    if (style === "bob") back = `<path d="M26 54 Q22 102 40 100 L80 100 Q98 102 94 54Z" fill="${hair}" ${S}/>`;
    if (style === "pony") back = `<ellipse cx="98" cy="74" rx="9" ry="22" fill="${hair}" ${S}/>`;
    if (style === "bun") back = `<circle cx="60" cy="14" r="13" fill="${hair}" ${S}/>`;
    const top = `<path d="M29 54 Q26 18 60 18 Q94 18 91 54 Q84 35 60 35 Q36 35 29 54Z" fill="${hair}" ${S}/>`;
    if (["long", "bob", "pony", "bun", "short"].includes(style)) front = top;
    if (style === "cap") front = top + `<path d="M27 46 Q30 12 62 14 Q93 16 93 46Z" fill="${shirt}" ${S}/><path d="M78 40 H110 Q112 49 102 49 H78Z" fill="${shirt}" ${S}/>`;
    if (style === "curly") front = [[36, 34], [48, 26], [60, 23], [72, 26], [84, 34], [30, 48], [90, 48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="${hair}" ${S}/>`).join("");
    if (style === "bald") front = `<ellipse cx="30" cy="54" rx="4" ry="9" fill="${hair}" ${S}/><ellipse cx="90" cy="54" rx="4" ry="9" fill="${hair}" ${S}/>`;
    if (style === "spike") front = `<path d="M30 52 L33 22 L46 36 L52 12 L62 34 L74 14 L78 36 L90 22 L90 52 Q84 38 60 38 Q36 38 30 52Z" fill="${hair}" ${S}/>`;
    if (bd && !f) extra += `<path d="M30 62 Q32 98 60 98 Q88 98 90 62 Q84 84 60 86 Q36 84 30 62Z" fill="${hair}" ${S}/>`;
    const eye = (x) => `<ellipse cx="${x}" cy="58" rx="7" ry="8" fill="#fff" ${S}/><circle cx="${x + 1}" cy="59" r="3.6" fill="${INK}"/><circle cx="${x + 2.2}" cy="57.5" r="1.2" fill="#fff"/>`;
    const face =
      `<g class="eyes">${eye(48)}${eye(72)}</g>` +
      `<path d="M40 46 Q48 41 56 45 M64 45 Q72 41 80 46" fill="none" ${S}/>` +
      `<path d="M59 62 Q55 70 61 70" fill="none" ${S}/>` +
      `<circle cx="39" cy="70" r="5" fill="#ff7b9c" opacity=".35"/><circle cx="81" cy="70" r="5" fill="#ff7b9c" opacity=".35"/>` +
      (st && !f ? `<path d="M46 73 Q53 66 60 71 Q67 66 74 73 Q66 78 60 75 Q54 78 46 73Z" fill="${hair}" ${S}/>` : "") +
      `<path class="m-shut" d="M49 78 Q60 88 71 78" fill="none" ${S}/>` +
      `<path class="m-open" d="M49 76 Q60 96 71 76Z" fill="#7a1f2b" ${S}/>` +
      (gl ? `<circle cx="48" cy="58" r="10.5" fill="#ffffff30" ${S}/><circle cx="72" cy="58" r="10.5" fill="#ffffff30" ${S}/><path d="M58.5 57 H61.5" ${S}/>` : "") +
      (bi && f ? `<circle cx="60" cy="43" r="2.6" fill="#d6203a"/>` : "");
    return `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(c.name)}">${back}` +
      `<rect x="49" y="80" width="22" height="22" fill="${skin}" ${S}/>` +
      `<path d="M8 140 Q10 98 60 94 Q110 98 112 140Z" fill="${shirt}" ${S}/><path d="M48 96 L60 112 L72 96" fill="#fff" ${S}/>` +
      `<circle cx="29" cy="60" r="6" fill="${skin}" ${S}/><circle cx="91" cy="60" r="6" fill="${skin}" ${S}/>` +
      `<ellipse cx="60" cy="56" rx="31" ry="35" fill="${skin}" ${S}/>${extra}${front}${face}</svg>`;
  }

  /* ================= router ================= */
  let current = null, busy = false;
  function parseHash() { const [n, d] = location.hash.slice(1).split("/"); return [n || "mood", d]; }
  function route() {
    let [name, data] = parseHash();
    if (name === "roast") { show("roast"); return; }
    if (!ORDER.includes(name)) name = "mood";
    if (name === "story" && data && !state.convo.length) { if (!loadShared(data)) name = "mood"; }
    if (name !== "mood" && !state.mood) name = "mood";
    if ((name === "msg" || name === "story") && state.chars.length < 2) name = state.mood ? "chars" : "mood";
    if (name === "story" && !state.convo.length) name = "msg";
    if (parseHash()[0] !== name) { location.replace("#" + name); return; }
    show(name);
  }
  const go = (n) => { location.hash = "#" + n; };
  function show(name) {
    if (name === current) return;
    const back = current && current !== "roast" && name !== "roast" && ORDER.indexOf(name) < ORDER.indexOf(current);
    const old = current && $("#page-" + current);
    const reveal = () => {
      $$(".page").forEach((p) => (p.hidden = true));
      const p = $("#page-" + name);
      p.classList.toggle("back", !!back); p.classList.remove("leave"); p.hidden = false;
      current = name;
      if (name !== "story") stopSpeak();
      document.body.classList.toggle("on-roast", name === "roast");
      ({ mood: renderMoods, chars: renderChars, msg: renderMsg, story: renderStory, roast: () => window.RoastBot.open() })[name]();
      $$("#stepper li").forEach((li) => {
        const i = ORDER.indexOf(li.dataset.s), c = ORDER.indexOf(name);
        li.classList.toggle("on", i === c); li.classList.toggle("done", i < c);
      });
      window.scrollTo({ top: 0 });
    };
    if (old) { old.classList.toggle("back", !!back); old.classList.add("leave"); setTimeout(reveal, 240); } else reveal();
  }

  /* ================= landing 3D hero ================= */
  (function hero3d() {
    const scene = $("#scene"), cube = $("#cube"), hero = $("#hero");
    if (!scene) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ry = 25, rx = -20, vy = reduce ? 0 : 0.35, vx = 0, drag = false, lx = 0, ly = 0;
    const paint = () => { cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; };
    (function loop() {
      if (!drag) { ry += vy; rx += vx; vx *= 0.95; vy += (0.35 * (reduce ? 0 : 1) - vy) * 0.02; }
      if (current === "mood") paint();
      requestAnimationFrame(loop);
    })();
    cube.addEventListener("pointerdown", (e) => { drag = true; lx = e.clientX; ly = e.clientY; cube.classList.add("drag"); cube.setPointerCapture(e.pointerId); SFX.pop(); e.stopPropagation(); });
    cube.addEventListener("pointermove", (e) => { if (!drag) return; const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; ry += dx * 0.6; rx -= dy * 0.6; vy = dx * 0.6; vx = -dy * 0.6; });
    const end = () => { drag = false; cube.classList.remove("drag"); };
    cube.addEventListener("pointerup", end); cube.addEventListener("pointercancel", end);
    hero.addEventListener("pointermove", (e) => {
      if (reduce || e.pointerType === "touch") return;
      const r = hero.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      scene.style.transform = `rotateY(${px * 16}deg) rotateX(${-py * 12}deg)`;
    });
    hero.addEventListener("pointerleave", () => (scene.style.transform = ""));
    const EM = ["💀", "🗿", "🧠", "🔥", "🌀", "😎", "🚽", "👽", "✨", "🤡"];
    hero.addEventListener("click", (e) => {
      if (e.target.closest("button,a")) return;
      SFX.pop();
      for (let i = 0; i < 14; i++) {
        const s = document.createElement("span"); s.className = "burst"; s.textContent = rp(EM);
        const a = (i / 14) * Math.PI * 2 + Math.random() * 0.4, d = 110 + Math.random() * 170, fs = 3 + Math.random() * 2.5;
        s.style.setProperty("--fs", fs + "rem");
        s.style.left = e.clientX - fs * 8 + "px"; s.style.top = e.clientY - fs * 8 + "px";
        s.style.setProperty("--dx", Math.cos(a) * d + "px"); s.style.setProperty("--dy", Math.sin(a) * d - 50 + "px"); s.style.setProperty("--r", (Math.random() * 540 - 270) + "deg");
        document.body.appendChild(s); setTimeout(() => s.remove(), 1000);
      }
    });
    $("#heroStart").onclick = () => { SFX.whoosh && SFX.whoosh(); $("#moodlist").scrollIntoView({ behavior: "smooth", block: "start" }); };
  })();

  /* 3D tilt for mood cards (event delegation, mouse/pen only) */
  (function tilt() {
    const box = $("#moods");
    box.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const c = e.target.closest(".mood"); if (!c) return;
      const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      c.classList.add("tilt");
      c.style.transform = `perspective(700px) rotateY(${px * 18}deg) rotateX(${-py * 18}deg) translateY(-6px)`;
    });
    box.addEventListener("pointerout", (e) => { const c = e.target.closest(".mood"); if (c && !c.contains(e.relatedTarget)) { c.classList.remove("tilt"); c.style.transform = ""; } });
  })();

  window.addEventListener("hashchange", route);
  $$("[data-go]").forEach((b) => (b.onclick = () => go(b.dataset.go)));
  $$("#stepper li").forEach((li) => (li.onclick = () => li.classList.contains("done") && go(li.dataset.s)));

  /* ================= step 1: mood + daily ================= */
  const setAccent = (c) => document.documentElement.style.setProperty("--accent", c);
  function dailyPick() {
    const day = Math.floor(Date.now() / 864e5), m = MOODS[day % MOODS.length];
    return { mood: m, text: m.chips[day % m.chips.length] };
  }
  function bumpStreak() {
    const today = new Date().toDateString(), s = store.get("br_streak", { last: "", n: 0, total: 0 });
    if (s.last !== today) {
      s.n = s.last === new Date(Date.now() - 864e5).toDateString() ? s.n + 1 : 1; s.last = today;
    }
    s.total++; store.set("br_streak", s); return s;
  }
  function renderMoods() {
    const d = dailyPick(), s = store.get("br_streak", { n: 0, total: 0 });
    $("#daily").innerHTML = `<div><b>🔥 Brainrot of the Day</b><p>${d.mood.emoji} ${esc(d.mood.name)} — “${esc(d.text)}”</p>` +
      `<span class="streak">Streak: ${s.n || 0} din • Stories padhi: ${s.total || 0}</span></div><button class="btn small primary" id="tryDaily">Try this →</button>`;
    $("#tryDaily").onclick = () => {
      state.mood = d.mood; state.chars = shuffle(d.mood.chars).slice(0, 3); state.text = d.text; setAccent(d.mood.color); go("msg");
    };
    const box = $("#moods"); box.innerHTML = "";
    MOODS.forEach((m, i) => {
      const b = document.createElement("button");
      b.className = "mood"; b.style.setProperty("--c", m.color); b.style.setProperty("--i", i);
      b.innerHTML = `<span class="e">${m.emoji}</span><h3>${esc(m.name)}</h3><p>${esc(m.desc)}</p><span class="n">${m.chars.length} characters</span>`;
      b.onclick = () => {
        if (busy) return; busy = true; SFX.pop();
        state.mood = m; state.chars = []; setAccent(m.color);
        b.classList.add("picked");
        setTimeout(() => { busy = false; go("chars"); }, 520);
      };
      box.appendChild(b);
    });
  }

  /* ================= step 2: characters ================= */
  function renderChars() {
    const m = state.mood;
    $("#charsSub").textContent = `${m.emoji} ${m.name} — 2 se 4 characters chuno`;
    const box = $("#chars"); box.innerHTML = "";
    m.chars.concat(CUSTOM_IDS).forEach((id, i) => {
      const c = CHARS[id], d = document.createElement("button");
      d.className = "char" + (state.chars.includes(id) ? " on" : ""); d.style.setProperty("--i", i);
      d.innerHTML = `<span class="tick">✓</span>${avatar(c)}<h4>${esc(c.name)}</h4><small>${esc(c.tag)}</small>`;
      d.onclick = () => {
        const k = state.chars.indexOf(id);
        if (k >= 0) state.chars.splice(k, 1);
        else if (state.chars.length >= 4) { d.classList.remove("shake"); void d.offsetWidth; d.classList.add("shake"); return toast("Max 4 characters"); }
        else state.chars.push(id);
        SFX.pop(); d.classList.toggle("on", state.chars.includes(id)); updateCount();
      };
      box.appendChild(d);
    });
    updateCount();
  }
  function updateCount() { $("#count").textContent = `${state.chars.length}/4`; $("#toMsg").disabled = state.chars.length < 2; }
  $("#toMsg").onclick = () => go("msg");
  $("#addCustom").onclick = () => { const b = $("#customBox"); b.hidden = !b.hidden; if (!b.hidden) $("#cName").focus(); };
  $("#cSave").onclick = () => {
    const name = $("#cName").value.trim().slice(0, 18);
    if (!name) return toast("Naam to likho 😅");
    const [label, sig] = NATURES[$("#cNature").value];
    const c = { id: "custom_" + Date.now().toString(36), name, tag: label, g: $("#cGender").value, sig };
    CHARS[c.id] = c; CUSTOM_IDS.push(c.id);
    try { localStorage.setItem("br_custom", JSON.stringify(CUSTOM_IDS.map((id) => CHARS[id]))); } catch (e) {}
    if (state.chars.length < 4) state.chars.push(c.id);
    $("#cName").value = ""; $("#customBox").hidden = true; renderChars(); toast(name + " aa gaya! 🎉"); Ach.event("custom");
  };
  $("#surprise").onclick = () => { state.chars = shuffle(state.mood.chars).slice(0, 3); renderChars(); };

  /* ================= step 3: message, mode, rot ================= */
  function renderMsg() {
    $("#selchars").innerHTML = state.chars.map((id) => avatar(CHARS[id])).join("");
    const m = state.mood;
    $("#chips").innerHTML = "";
    (state.mode === "roast" ? EX.ROAST_SEEDS : m.chips).forEach((t) => {
      const b = document.createElement("button"); b.textContent = t;
      b.onclick = () => { $("#input").value = t; $("#input").focus(); };
      $("#chips").appendChild(b);
    });
    $("#input").value = state.text;
    $("#input").placeholder = state.mode === "roast" ? "Apni line likho — characters roast karenge 🔥" : "Apni situation type karo… e.g. Mera friend har baar late aata hai";
    $("#rot").value = state.rot; $("#rotName").textContent = ROT[state.rot];
    $$("#modes button").forEach((b) => b.classList.toggle("on", b.dataset.mode === state.mode));
    $("#start").textContent = state.mode === "roast" ? "🔥 Roast battle shuru karo" : state.mode === "ai" ? "✨ AI comic likho" : "📖 Comic shuru karo";
  }
  $("#rot").oninput = (e) => { state.rot = +e.target.value; $("#rotName").textContent = ROT[state.rot]; SFX.pop(); };
  $$("#modes button").forEach((b) => (b.onclick = () => { state.mode = b.dataset.mode; SFX.pop(); renderMsg(); }));

  const topicOf = (t) => { for (const [n, re] of window.TOPIC_RULES) if (re.test(t)) return n; return "default"; };
  function slangify(s) {
    if (state.rot === 0) return s;
    const suf = rp(EX.SLANG.suf);
    if (state.rot === 1) return Math.random() < 0.55 ? `${s} ${suf}` : s;
    return rp(EX.SLANG.pre) + s.charAt(0).toLowerCase() + s.slice(1) + " " + suf;
  }
  const aura = () => rp(EX.AURA);
  function buildConvo() {
    const m = state.mood, chars = state.chars.map((id) => CHARS[id]), text = state.text.trim();
    if (state.mode === "ai" && state.aiLines) { const l = state.aiLines; state.aiLines = null; return l; }
    const order = shuffle(chars), lines = [];
    const short = (t) => (t.length > 38 ? t.slice(0, 38) + "…" : t);
    if (state.mode === "roast") {
      const seed = text || rp(EX.ROAST_SEEDS), x = short(seed);
      lines.push({ char: YOU, text: seed, user: true, aura: -(250 + Math.floor(Math.random() * 15) * 50) });
      pick(EX.ROASTS, 2).forEach((s, i) => lines.push({ char: order[i % order.length], text: slangify(s.replace("{x}", x)), aura: 250 + Math.floor(Math.random() * 8) * 100 }));
      lines.push({ char: order[2 % order.length], text: rp(EX.VERDICTS), aura: 500 });
    } else {
      let t;
      if (text) {
        lines.push({ char: YOU, text, user: true });
        t = pick(m.topics[topicOf(text)], 3).map((s) => s.replace("{x}", short(text)));
      } else t = pick(m.random, 1)[0].slice();
      t.forEach((s, i) => lines.push({ char: order[i % order.length], text: slangify(s), aura: aura() }));
      const last = lines[lines.length - 1].char, cand = chars.filter((c) => c.id !== last.id), pool = cand.length ? cand : chars;
      const sc = rp(pool);
      lines.push({ char: sc, text: slangify(rp(sc.sig)), aura: aura() });
    }
    return lines;
  }
  function computeScore(text, convo) {
    const hits = (text.match(EX.KEYWORDS) || []).length;
    const base = [22, 45, 68][state.rot];
    const s = base + hits * 7 + Math.min(10, text.length / 12) + Math.random() * 12 + (state.mode === "roast" ? 5 : 0);
    return Math.max(3, Math.min(100, Math.round(s)));
  }
  const rankOf = (s) => EX.RANKS.find(([lim]) => s < lim)[1];

  function newStory() {
    state.convo = buildConvo(); state.baseLen = state.convo.length; state.score = computeScore(state.text, state.convo);
    Ach.event("story", { score: state.score, mood: state.mood.id, mode: state.mode, rot: state.rot });
  }
  async function fetchAIComic() {
    const r = await fetch("/api/roast", { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode: "comic", mood: state.mood.name, rot: state.rot, text: state.text.trim(), chars: state.chars.map((id) => ({ name: CHARS[id].name, tag: CHARS[id].tag })) }) });
    if (!r.ok) throw new Error("http-" + r.status);
    const j = await r.json(), cs = state.chars.map((id) => CHARS[id]), out = [];
    if (state.text.trim()) out.push({ char: YOU, text: state.text.trim(), user: true });
    (j.lines || []).forEach((l) => out.push({ char: cs[l.c] || cs[0], text: l.t, aura: aura() }));
    if (out.length < 3) throw new Error("short");
    return out;
  }
  function runCurtain() {
    $("#curEmoji").textContent = state.mood.emoji;
    $("#curLine").textContent = state.mode === "roast" ? "Roast battle! Aura daav pe lag chuka hai 🔥" : state.mood.tagline;
    const cu = $("#curtain"); cu.classList.remove("open"); cu.classList.add("show"); SFX.dundun();
    setTimeout(() => go("story"), 2000);
    setTimeout(() => cu.classList.add("open"), 2150);
    setTimeout(() => { cu.classList.remove("show", "open"); busy = false; }, 3100);
  }
  $("#start").onclick = async () => {
    if (busy) return; busy = true;
    state.text = $("#input").value; state.aiLines = null;
    if (state.mode === "ai") {
      const btn = $("#start"), old = btn.textContent; btn.disabled = true; btn.textContent = "✍️ AI likh raha hai…";
      try { state.aiLines = await fetchAIComic(); Ach.event("ai"); }
      catch (e) { state.aiLines = null; toast("AI nahi mila — normal comic chala raha hoon"); }
      btn.disabled = false; btn.textContent = old;
    }
    newStory(); bumpStreak(); runCurtain();
  };

  /* ================= comic book ================= */
  let leaves = [], cur = 0, timers = [], bonusIdx = -1, resultIdx = -1, bonusDone = false;
  const CAPS = ["Ek din…", "Tabhi…", "Aur phir…", "Lekin…", "Aakhir mein…", "Phir…", "Bonus!", "Aur ant mein…"];
  const SFXW = ["HAHA!", "OYE!", "BOOM!", "ARRE!", "WOW!", "HAI RAM!", "SHHH!"];
  function panelHTML(l, i, d) {
    const side = i % 2 ? "right" : "left", a = l.aura;
    return `<div class="panel ${side}${l.user ? " you" : ""}" data-i="${i}" style="--d:${d}s">` +
      `<div class="cap">${CAPS[i % CAPS.length]}</div><div class="sfx">${SFXW[(i * 3 + 1) % SFXW.length]}</div>` +
      `<div class="bubble">${esc(l.text)}</div><div class="av">${avatar(l.char)}</div>` +
      (a ? `<div class="aura ${a > 0 ? "pos" : "neg"}">${a > 0 ? "+" : ""}${a} aura</div>` : "") +
      `<div class="who">${esc(l.char.name)}</div></div>`;
  }
  function bindPanels(root) {
    $$(".panel[data-i]", root).forEach((p) => {
      p.style.setProperty("--m", state.mood.color);
      p.onclick = () => {
        stopSpeak(); SFX.pop();
        $$(".react", p).forEach((e) => e.remove());
        const e = document.createElement("div"); e.className = "react"; e.textContent = rp(EX.REACTS); p.appendChild(e);
        p.classList.remove("wiggle"); void p.offsetWidth; p.classList.add("wiggle"); setTimeout(() => e.remove(), 1900);
        setTimeout(() => speakPanel(p), 350);
      };
    });
  }
  function renderStory() {
    const m = state.mood, L = state.convo.slice(0, state.baseLen), book = $("#book");
    bonusDone = false;
    const faces = [];
    faces.push(`<div class="face front cover"><span class="eyebrow">${state.mode === "roast" ? "Roast Battle" : "Aaj ka episode"}</span><h2>${esc(m.name)}</h2>` +
      `<div class="ep">${state.text.trim() ? "“" + esc(state.text.trim()) + "”" : "Surprise story 🎁"}</div><p class="tag">Rot level: ${ROT[state.rot]} 🧠</p>` +
      `<div class="cast">${state.chars.map((id) => avatar(CHARS[id])).join("")}</div><div class="tap">Page palto ➜</div></div>`);
    for (let i = 0; i < L.length; i += 2) {
      let h = panelHTML(L[i], i, 0.3);
      h += L[i + 1] ? panelHTML(L[i + 1], i + 1, 1.0) : `<div class="panel tbc">BONUS ROUND<br>NEXT…</div>`;
      faces.push(`<div class="face front">${h}</div>`);
    }
    bonusIdx = faces.length;
    faces.push(`<div class="face front bonus"><h3>BONUS ROUND</h3><p>Tum kya bologe? 👀</p><div class="choices">` +
      Object.entries(EX.CHOICES).map(([k, v]) => `<button class="btn" data-ch="${k}">${v.label}</button>`).join("") + `</div></div>`);
    resultIdx = faces.length;
    faces.push(`<div class="face front result"></div>`);
    faces.push(`<div class="face front end"><h2>THE END!</h2><p style="font-weight:600;margin:0">…ya phir ek aur episode? 😏</p><div class="btns">` +
      `<button class="btn small" data-act="copy">📋 Copy text</button><button class="btn small" data-act="link">🔗 Copy link</button>` +
      `<button class="btn small" data-act="card">🖼 Save card</button><button class="btn small" data-act="again">🔁 Next episode</button>` +
      `<button class="btn small" data-act="mood">🏠 Naya mood</button></div></div>`);
    book.innerHTML = faces.map((f) => `<div class="leaf" style="--m:${m.color}">${f}<div class="face back"></div></div>`).join("");
    leaves = $$(".leaf", book);
    bindPanels(book);
    $("#dots").innerHTML = leaves.map(() => "<i></i>").join("");
    cur = -1; layout(0); lastLive = -1;
    cur = 0; layout(0);
  }
  let lastLive = -1;
  function layout(dir) {
    const N = leaves.length;
    leaves.forEach((lf, i) => {
      const turned = i < cur;
      lf.classList.toggle("turned", turned); lf.style.zIndex = turned ? i : N - i;
      lf.classList.toggle("live", i === cur);
      clearTimeout(timers[i]);
      if (turned) timers[i] = setTimeout(() => lf.classList.add("gone"), 1000); else lf.classList.remove("gone");
    });
    $$("#dots i").forEach((d, i) => d.classList.toggle("on", i === cur));
    $("#prev").style.visibility = cur <= 0 ? "hidden" : "visible";
    $("#next").style.visibility = cur === N - 1 ? "hidden" : "visible";
    if (cur >= 0 && cur !== lastLive) { lastLive = cur; onLive(leaves[cur]); }
    if (cur === resultIdx && dir > 0) confetti();
  }
  function onLive(leaf) {
    if (cur === resultIdx) { fillResult(leaf); return; }
    const panels = $$(".panel[data-i]", leaf);
    panels.forEach((p) => {
      const l = state.convo[+p.dataset.i]; if (!l || !l.aura) return;
      const t = (parseFloat(p.style.getPropertyValue("--d")) + 1.3) * 1000 + 100;
      setTimeout(() => leaf.classList.contains("live") && (l.aura > 0 ? SFX.ding() : SFX.bruh()), t);
    });
    if (panels.length && cur > 0) maybeChaos(leaf);
  }
  function turn(n) {
    if (n < 0 || n >= leaves.length || n === cur) return;
    stopSpeak(); SFX.whoosh(); const dir = n - cur; cur = n; layout(dir);
    const L = leaves[cur];
    if (state.voice && $$(".panel[data-i]", L).length) setTimeout(() => cur === n && speakPage(), 1300);
  }
  $("#next").onclick = () => turn(cur + 1);
  $("#prev").onclick = () => turn(cur - 1);
  let sx = 0;
  $("#book").addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  $("#book").addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (dx < -60) turn(cur + 1); else if (dx > 60) turn(cur - 1); });
  function confetti() {
    const em = ["🎉", "😂", "✨", "🎊", "🤣", "⭐", "💀"];
    for (let i = 0; i < 26; i++) {
      const s = document.createElement("span"); s.className = "confetti"; s.textContent = em[i % em.length];
      s.style.left = Math.random() * 100 + "vw"; s.style.animationDelay = Math.random() * 0.8 + "s"; s.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
      document.body.appendChild(s); setTimeout(() => s.remove(), 4200);
    }
  }

  /* ----- bonus round (branching) ----- */
  function chooseBonus(type) {
    Ach.event("bonus");
    if (bonusDone) return; bonusDone = true;
    const chars = state.chars.map((id) => CHARS[id]), last = state.convo[state.convo.length - 1].char;
    const pool = chars.filter((c) => c.id !== last.id), rc = pool.length ? rp(pool) : chars[0];
    const you = { char: YOU, user: true, text: rp(EX.CHOICES[type].lines), aura: type === "chaos" ? 1000 : type === "roast" ? 500 : 100 };
    const rep = { char: rc, text: rp(EX.REPLIES[type]), aura: type === "chill" ? 250 : -250 };
    state.convo.push(you, rep);
    const i = state.convo.length - 2, leaf = leaves[bonusIdx], front = $(".front", leaf);
    front.classList.remove("bonus");
    front.innerHTML = panelHTML(you, i, 0.2) + panelHTML(rep, i + 1, 0.9);
    bindPanels(front);
    leaf.classList.remove("live"); void leaf.offsetWidth; leaf.classList.add("live"); lastLive = -1; onLive(leaf); lastLive = cur;
    type === "chaos" ? SFX.boom() : type === "roast" ? SFX.dundun() : SFX.laugh();
    if (state.voice) setTimeout(() => cur === bonusIdx && speakPage(), 900);
    toast("Next dabao — result aane wala hai 👉");
  }

  /* ----- result: meter + aura board ----- */
  function auraTotals() {
    const m = new Map();
    state.convo.forEach((l) => { if (!l.aura) return; const e = m.get(l.char.id) || { char: l.char, total: 0 }; e.total += l.aura; m.set(l.char.id, e); });
    return [...m.values()].sort((a, b) => b.total - a.total);
  }
  function fillResult(leaf) {
    const s = state.score, board = auraTotals(), max = Math.max(1, ...board.map((b) => Math.abs(b.total)));
    $(".front", leaf).innerHTML =
      `<div class="rt">BRAINROT METER</div>` +
      `<svg class="gauge" viewBox="0 0 200 110"><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#5be28f"/><stop offset=".55" stop-color="#ffd23f"/><stop offset="1" stop-color="#ff3d5a"/></linearGradient></defs>` +
      `<path class="bg" pathLength="100" d="M20 100 A80 80 0 0 1 180 100"/><path class="arc" pathLength="100" d="M20 100 A80 80 0 0 1 180 100"/>` +
      `<g class="needle"><line x1="100" y1="100" x2="100" y2="34" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="100" r="8" fill="${INK}"/></g></svg>` +
      `<div class="pct">0%</div><div class="rank">${esc(rankOf(s))}</div>` +
      `<div class="board"><h5>Aura leaderboard</h5>` +
      board.map((b) => `<div class="row ${b.total >= 0 ? "pos" : "neg"}"><span>${esc(b.char.name)}</span><div class="bar2"><i data-w="${Math.round((Math.abs(b.total) / max) * 100)}"></i></div><span>${b.total > 0 ? "+" : ""}${b.total}</span></div>`).join("") +
      `</div><div class="win">👑 Aaj ka Aura Winner: ${esc(board[0].char.name)}</div>`;
    SFX.dundun();
    setTimeout(() => {
      if (!leaf.classList.contains("live")) return;
      $(".arc", leaf).style.strokeDasharray = `${s} 100`;
      $(".needle", leaf).style.transform = `rotate(${(s / 100) * 180 - 90}deg)`;
      $$(".bar2 i", leaf).forEach((i) => (i.style.width = i.dataset.w + "%"));
      let n = 0; const t = setInterval(() => { n = Math.min(s, n + Math.max(1, Math.round(s / 40))); const p = $(".pct", leaf); if (p) p.textContent = n + "%"; if (n >= s) clearInterval(t); }, 40);
    }, 250);
    setTimeout(() => leaf.classList.contains("live") && SFX.ding(), 2000);
  }

  /* ----- chaos events ----- */
  function maybeChaos(leaf) {
    if (Math.random() > [0.18, 0.4, 0.7][state.rot]) return;
    const ev = rp(["chappal", "blackout", "news", "lag"]), face = $(".front", leaf);
    const add = (cls, html) => { const e = document.createElement("div"); e.className = "fx " + cls; e.innerHTML = html; face.appendChild(e); return e; };
    setTimeout(() => {
      if (!leaf.classList.contains("live")) return;
      if (ev === "chappal") { SFX.boom(); const e = add("chappal", "🩴"); toast("Mummy ki chappal! 🩴"); setTimeout(() => e.remove(), 1500); }
      if (ev === "blackout") { SFX.dundun(); const e = add("blackout", "<span>⚡ Bijli gayi!</span>"); setTimeout(() => e.remove(), 1800); }
      if (ev === "news") { const t = state.text.trim() ? `Breaking: "${state.text.trim().slice(0, 60)}" ne internet tod diya` : rp(EX.NEWS); const e = add("ticker", `<span>🚨 BREAKING: ${esc(t)} 🚨</span>`); SFX.dundun(); setTimeout(() => e.remove(), 6200); }
      if (ev === "lag") { face.classList.add("glitch"); const e = add("lagmsg", "📶 Buffering… 99%"); SFX.bruh(); setTimeout(() => { e.remove(); face.classList.remove("glitch"); }, 1900); }
    }, 2200);
  }

  /* ----- book click delegation ----- */
  $("#book").addEventListener("click", (e) => {
    const ch = e.target.closest("[data-ch]"); if (ch) return chooseBonus(ch.dataset.ch);
    const a = e.target.closest("[data-act]"); if (!a) return;
    ({ copy: copyText, link: copyLink, card: exportCard, again: nextEpisode, mood: () => go("mood") })[a.dataset.act]();
  });
  function nextEpisode() { stopSpeak(); newStory(); bumpStreak(); renderStory(); setTimeout(() => turn(1), 350); }
  $("#again").onclick = nextEpisode;

  /* ================= voice ================= */
  const synth = window.speechSynthesis;
  const FEM = /female|lekha|heera|heena|kalpana|veena|zira|samantha|priya|neerja|swara|google.*(hindi|हिन्दी)/i;
  function voiceFor(g) {
    const vs = synth ? synth.getVoices() : [];
    const rank = (v) => (/en-IN/i.test(v.lang) ? 0 : /hi-IN/i.test(v.lang) ? 1 : 2);
    const s = vs.slice().sort((a, b) => rank(a) - rank(b));
    const top = s.filter((v) => rank(v) === rank(s[0]));
    return top.find((v) => FEM.test(v.name) === (g === "f")) || top[0] || null;
  }
  function profile(c) {
    const r = rng(c.id + "v");
    const p = c.g === "f" ? 1.05 + r() * 0.45 : 0.7 + r() * 0.6;
    return { p: c.old ? p * 0.85 : p, r: c.old ? 0.82 : 0.9 + r() * 0.4 };
  }
  let speakId = 0;
  function speakPanel(el) {
    return new Promise((res) => {
      if (!synth) { toast("Is browser mein voice support nahi hai"); return res(); }
      const l = state.convo[+el.dataset.i]; if (!l) return res();
      const pr = profile(l.char), u = new SpeechSynthesisUtterance(l.text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")), v = voiceFor(l.char.g);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-IN";
      u.pitch = pr.p; u.rate = pr.r;
      el.classList.add("speaking");
      const end = () => { el.classList.remove("speaking"); res(); };
      u.onend = end; u.onerror = end; synth.speak(u);
    });
  }
  async function speakPage() {
    if (!synth) return toast("Is browser mein voice support nahi hai");
    synth.cancel(); const id = ++speakId;
    for (const p of $$(".panel[data-i]", leaves[cur])) { if (id !== speakId) return; await speakPanel(p); }
  }
  function stopSpeak() { speakId++; synth && synth.cancel(); $$(".panel.speaking").forEach((p) => p.classList.remove("speaking")); }
  $("#replay").onclick = speakPage;
  $("#voice").onclick = () => { state.voice = !state.voice; $("#voice").textContent = state.voice ? "🔊 Voice on" : "🔇 Voice off"; if (!state.voice) stopSpeak(); };
  if (synth) synth.getVoices();

  /* ================= share: text, link, PNG card ================= */
  const asText = () => `${state.mood.emoji} ${state.mood.name}\n\n` + state.convo.map((l) => `${l.char.name}: ${l.text}`).join("\n") +
    `\n\nBrainrot: ${state.score}% — ${rankOf(state.score)}\n— The Brainrot`;
  function b64e(o) { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function b64d(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return JSON.parse(decodeURIComponent(escape(atob(s)))); }
  function shareURL() {
    const o = { m: state.mood.id, c: state.chars, t: state.text, r: state.rot, k: state.mode, s: state.score, l: state.convo.slice(0, state.baseLen).map((l) => [l.char.id, l.text, l.aura || 0]) };
    return location.href.split("#")[0] + "#story/" + b64e(o);
  }
  function loadShared(data) {
    try {
      const o = b64d(data), m = MOODS.find((x) => x.id === o.m); if (!m) return false;
      state.mood = m; state.chars = o.c.filter((id) => CHARS[id]); state.text = o.t || ""; state.rot = o.r | 0; state.mode = o.k === "roast" ? "roast" : "story"; state.score = o.s | 0;
      state.convo = o.l.map(([id, text, a]) => ({ char: id === "you" ? YOU : CHARS[id], text: String(text), user: id === "you", aura: a || 0 })).filter((l) => l.char);
      state.baseLen = state.convo.length; setAccent(m.color);
      return state.chars.length >= 2 && state.convo.length > 0;
    } catch { return false; }
  }
  async function copyText() { try { await navigator.clipboard.writeText(asText()); toast("Copied! 📋"); } catch { toast("Copy nahi hua"); } }
  async function copyLink() { Ach.event("share"); try { await navigator.clipboard.writeText(shareURL()); toast("Link copied! Dost ko bhejo 🔗"); } catch { toast("Copy nahi hua"); } }
  async function share() {
    if (navigator.share) { try { await navigator.share({ title: "The Brainrot", text: `${state.mood.name} — Brainrot ${state.score}%`, url: shareURL() }); } catch {} } else copyLink();
  }
  $("#share").onclick = share;
  function loadH2C() {
    if (window.html2canvas) return Promise.resolve();
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }
  async function exportCard() {
    Ach.event("share");
    toast("Card ban raha hai… 🖼");
    try { await loadH2C(); } catch { return toast("Card library load nahi hui (internet check karo)"); }
    const board = auraTotals(), lines = state.convo.slice(0, 5);
    const card = document.createElement("div"); card.id = "sharecard"; card.style.setProperty("--sc", state.mood.color);
    card.innerHTML = `<div class="b">THE BRAINROT</div><div class="t">${state.mood.emoji} ${esc(state.mood.name)}${state.mode === "roast" ? " — Roast Battle" : ""}</div>` +
      lines.map((l) => `<div class="bub">${avatar(l.char)}<div><b>${esc(l.char.name)}</b>${esc(l.text)}</div></div>`).join("") +
      `<div class="meter"><div><em>${esc(rankOf(state.score))}</em><em style="font-size:26px;font-weight:500">👑 Aura winner: ${esc(board[0].char.name)}</em></div><big>${state.score}%</big></div>` +
      `<div class="foot">Apna brainrot level check karo 🧠</div>`;
    document.body.appendChild(card);
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const canvas = await window.html2canvas(card, { backgroundColor: null, scale: 1 });
      canvas.toBlob(async (blob) => {
        const file = new File([blob], "brainrot.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: "The Brainrot" }); return; } catch {} }
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "brainrot-card.png"; a.click(); toast("Card saved! 🖼");
      }, "image/png");
    } catch { toast("Card nahi ban paya"); } finally { card.remove(); }
  }
  $("#card").onclick = exportCard;

  /* ================= keyboard + easter eggs ================= */
  function cooked(on) {
    document.body.classList.toggle("cooked", on);
    toast(on ? "COOKED MODE ON 💀 aura = -∞" : "Cooked mode off 🧊"); if (on) Ach.event("cooked"); if (on) { SFX.boom(); confetti(); }
  }
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let kpos = 0;
  document.addEventListener("keydown", (e) => {
    kpos = e.key === KONAMI[kpos] ? kpos + 1 : e.key === KONAMI[0] ? 1 : 0;
    if (kpos === KONAMI.length) { kpos = 0; cooked(!document.body.classList.contains("cooked")); }
    if (current !== "story" || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (e.key === "ArrowRight") turn(cur + 1); if (e.key === "ArrowLeft") turn(cur - 1);
  });
  let taps = 0, tapT;
  $(".logo").addEventListener("click", () => { taps++; clearTimeout(tapT); tapT = setTimeout(() => (taps = 0), 1200); if (taps >= 5) { taps = 0; cooked(!document.body.classList.contains("cooked")); } });
  document.addEventListener("pointerdown", () => { try { ac && ac.state === "suspended" && ac.resume(); } catch {} }, { once: true });

  route();
})();
