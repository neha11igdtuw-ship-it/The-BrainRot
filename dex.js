/* Brainrot Dex: original emoji-mash character cards with synthesized jingles (no copied art or audio). */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // notes are semitones from root (null = rest); each jingle is original
  const D = [
    { n: "Tralalero Tralala", e: ["🦈", "👟"], c: "#7cc4ff", say: "Tra la le ro, tra la la!", lore: "A shark in oversized sneakers who believes every problem is solved by running. Never loses a race, always loses the plot.", move: "Sneaker Splash", s: [88, 72, 70], j: { w: "square", r: 62, m: [0,2,4,2,4,7] } },
    { n: "Bombardino Crocodillo", e: ["🐊", "✈️"], c: "#9be37f", say: "Bombardino crocodillo!", lore: "Half crocodile, half bomber jet. Flies low, snaps loud, and apologises to nobody.", move: "Snap Strike", s: [75, 40, 92], j: { w: "sawtooth", r: 55, m: [0,0,2,0,4,2] } },
    { n: "Tung Tung Tung Sahur", e: ["🪵", "🥁"], c: "#e0b070", say: "Tung, tung, tung, sahur!", lore: "A wooden drummer who wakes the neighbourhood at 3 AM and calls it community service.", move: "3 AM Drumroll", s: [80, 20, 85], j: { w: "triangle", r: 70, m: [0,null,0,2,4,null] } },
    { n: "Bobritto Bandito", e: ["🦫", "🕶️", "🎩"], c: "#c9a27a", say: "Bobritto bandito!", lore: "A beaver with a hat, shades and a very dramatic exit plan. Steals the show, never the snacks.", move: "Dam Heist", s: [70, 85, 60], j: { w: "triangle", r: 58, m: [4,2,0,2,4,5] } },
    { n: "Brr Brr Patapim", e: ["🌳", "🦶"], c: "#6bbf6b", say: "Brr brr, patapim!", lore: "A tree with big feet and bigger opinions. Moves slowly, grows on you.", move: "Root Stomp", s: [65, 55, 45], j: { w: "sine", r: 50, m: [0,2,4,3,2,0] } },
    { n: "Trippi Troppi", e: ["🐱", "🦐"], c: "#ffb27a", say: "Trippi troppi!", lore: "A cat-shrimp mix-up nobody asked for. Smells like lunch, acts like royalty.", move: "Prawn Pounce", s: [60, 68, 80], j: { w: "square", r: 66, m: [7,5,4,5,7,9] } },
    { n: "Lirilì Larilà", e: ["🐘", "🌵", "⏳"], c: "#f3d36b", say: "Lirili larila!", lore: "A cactus-elephant who controls time in the desert. Always late, technically on time.", move: "Sand Clock", s: [90, 50, 55], j: { w: "sine", r: 52, m: [0,4,2,4,7,4] } },
    { n: "Chimpanzini Bananini", e: ["🐒", "🍌"], c: "#ffe36e", say: "Chimpanzini bananini!", lore: "A chimp wrapped in a banana who only communicates through chaos and potassium.", move: "Peel Slip", s: [55, 70, 95], j: { w: "square", r: 74, m: [4,4,5,4,2,4] } },
    { n: "Capuchino Assassino", e: ["☕", "🥷"], c: "#d8a47f", say: "Capuchino assassino!", lore: "A ninja made of espresso. Strikes at 8 AM, leaves you wide awake and slightly shaking.", move: "Foam Fury", s: [78, 62, 75], j: { w: "sawtooth", r: 64, m: [0,2,3,4,3,2] } },
    { n: "Frigo Camelo", e: ["🐫", "🧊"], c: "#a8e1ff", say: "Frigo camelo!", lore: "A camel with a fridge on its back. Stays cool in every crisis and keeps the midnight snacks.", move: "Cold Open", s: [72, 48, 40], j: { w: "triangle", r: 54, m: [7,6,4,2,4,6] } },
    { n: "Boneca Ambalabu", e: ["🐸", "🛞"], c: "#8fd68f", say: "Boneca ambalabu!", lore: "A frog on two big tyres. Hops where she wants, rolls where she must.", move: "Tyre Bounce", s: [58, 80, 70], j: { w: "square", r: 68, m: [0,2,0,4,2,4] } },
    { n: "Bombombini Gusini", e: ["🪿", "✈️"], c: "#f0f0f0", say: "Bombombini gusini!", lore: "A goose in a flight suit. Honks first, lands later, never takes feedback.", move: "Honk Raid", s: [66, 35, 90], j: { w: "sawtooth", r: 60, m: [4,7,6,4,2,0] } },
    { n: "Burbaloni Luliloli", e: ["🥥", "🏝️"], c: "#ffd29a", say: "Burbaloni luliloli!", lore: "A coconut that thinks it is an island. Calm, creamy and extremely hard to crack.", move: "Island Mode", s: [82, 75, 30], j: { w: "sine", r: 56, m: [2,4,5,7,5,4] } }
  ];
  let cur = 0, ac, seen = new Set();
  try { seen = new Set(JSON.parse(localStorage.getItem("br_dex") || "[]")); } catch (e) {}
  const saveSeen = () => { try { localStorage.setItem("br_dex", JSON.stringify([...seen])); } catch (e) {} };
  /* ---------- Italian voice picker (shared with music.js) ---------- */
  const PREF = ["alice", "luca", "federica", "paola", "google italiano", "elsa", "isabella", "diego", "cosimo", "premium", "enhanced", "natural", "eddy", "flo", "reed", "sandy", "shelley", "rocko", "grandma", "grandpa"];
  const itVoices = () => (window.speechSynthesis ? speechSynthesis.getVoices() : []).filter((v) => /^it([-_]|$)/i.test(v.lang));
  function bestVoice() {
    const all = itVoices(); if (!all.length) return null;
    let saved = ""; try { saved = localStorage.getItem("br_itvoice") || ""; } catch (e) {}
    const hit = all.find((v) => v.name === saved); if (hit) return hit;
    for (const p of PREF) { const v = all.find((x) => x.name.toLowerCase().includes(p)); if (v) return v; }
    return all[0];
  }
  function say(text, o) {
    const ss = window.speechSynthesis; if (!ss) return false;
    o = o || {}; ss.cancel();
    const u = new SpeechSynthesisUtterance(text), v = bestVoice();
    u.lang = "it-IT"; if (v) u.voice = v; u.pitch = o.pitch || 1.12; u.rate = o.rate || 0.92; u.volume = 1;
    ss.speak(u); return !!v;
  }
  window.ItVoice = { say, best: bestVoice, list: itVoices };

  /* ---------- smoother synth: reverb + mandolin / accordion / flute / bell ---------- */
  const SC = [0, 2, 3, 5, 7, 8, 11]; // A harmonic minor
  const deg = (d) => 12 * Math.floor(d / 7) + SC[((d % 7) + 7) % 7];
  const hz = (st) => 220 * Math.pow(2, st / 12);
  let wet, dry;
  function rig() {
    if (ac) { if (ac.state === "suspended") ac.resume(); return; }
    ac = new (window.AudioContext || window.webkitAudioContext)();
    const len = ac.sampleRate * 1.6, ir = ac.createBuffer(2, len, ac.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    const conv = ac.createConvolver(); conv.buffer = ir;
    wet = ac.createGain(); wet.gain.value = 0.38; dry = ac.createGain(); dry.gain.value = 0.9;
    const comp = ac.createDynamicsCompressor(); comp.connect(ac.destination);
    conv.connect(wet); wet.connect(comp); dry.connect(comp);
    ac._in = ac.createGain(); ac._in.connect(dry); ac._in.connect(conv);
  }
  function ad(g, t, a, hold, r, v) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + a); g.gain.setValueAtTime(v, t + a + hold); g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + r); }
  function voice(kind, f, t, dur, v) {
    const out = ac.createGain(), end = t + dur + 0.5; out.connect(ac._in);
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.connect(out);
    if (kind === "mandolin") { // doubled plucks (tremolo) + bright decay
      lp.frequency.setValueAtTime(5200, t); lp.frequency.exponentialRampToValueAtTime(1400, t + 0.25);
      const hits = Math.max(1, Math.round(dur / 0.07));
      for (let h = 0; h < hits; h++) [0, 6].forEach((c) => { const o = ac.createOscillator(), g = ac.createGain(), tt = t + h * 0.07; o.type = "triangle"; o.frequency.value = f; o.detune.value = c; o.connect(g); g.connect(lp); ad(g, tt, 0.004, 0, 0.16 + (h === 0 ? 0.12 : 0), v * (h === 0 ? 1 : 0.55)); o.start(tt); o.stop(tt + 0.35); });
    } else if (kind === "accordion") {
      lp.frequency.value = 1700; const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 5.4; lg.gain.value = 7; lfo.connect(lg);
      [-9, 0, 9].forEach((c) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = "sawtooth"; o.frequency.value = f; o.detune.value = c; lg.connect(o.detune); o.connect(g); g.connect(lp); ad(g, t, 0.05, Math.max(0, dur - 0.08), 0.12, v * 0.5); o.start(t); o.stop(end); });
      lfo.start(t); lfo.stop(end);
    } else if (kind === "flute") {
      lp.frequency.value = 3200; const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 5; lg.gain.value = 9; lfo.connect(lg);
      const o = ac.createOscillator(), g = ac.createGain(); o.type = "sine"; o.frequency.value = f * 2; lg.connect(o.detune); o.connect(g); g.connect(lp); ad(g, t, 0.06, Math.max(0, dur - 0.1), 0.14, v * 0.9); o.start(t); o.stop(end);
      const o2 = ac.createOscillator(), g2 = ac.createGain(); o2.type = "triangle"; o2.frequency.value = f * 4; o2.connect(g2); g2.connect(lp); ad(g2, t, 0.06, Math.max(0, dur - 0.1), 0.1, v * 0.15); o2.start(t); o2.stop(end);
      lfo.start(t); lfo.stop(end);
    } else { // bell
      lp.frequency.value = 6000;
      [[1, 1], [2.76, 0.4], [5.4, 0.18]].forEach(([m, a]) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = "sine"; o.frequency.value = f * 2 * m; o.connect(g); g.connect(lp); ad(g, t, 0.003, 0, 0.9, v * a * 0.8); o.start(t); o.stop(t + 1); });
    }
  }
  function bassNote(f, t, v) { const o = ac.createOscillator(), g = ac.createGain(); o.type = "sine"; o.frequency.value = f; o.connect(g); g.connect(ac._in); ad(g, t, 0.01, 0.04, 0.2, v); o.start(t); o.stop(t + 0.4); }
  function chordHit(root, minor, t, v) { [0, minor ? 3 : 4, 7].forEach((i) => voice("accordion", hz(root + 12 + i), t, 0.16, v * 0.35)); }

  const KINDS = ["mandolin", "accordion", "flute", "bell"];
  function jingle(d, idx) {
    rig();
    const E = 60 / (d.j.r * 3) * 1.25, t0 = ac.currentTime + 0.06, kind = KINDS[idx % KINDS.length];
    const m = d.j.m; // motif: 6 scale degrees (null = rest)
    const bars = [m, m.map((x) => (x === null ? null : x - 1)), m.slice().reverse().map((x) => (x === null ? null : x + 1)), [7, 6, 5, 4, 2, 0]];
    const roots = [0, 0, 7 - 12 + 12, 0], mino = [true, true, false, true]; // Am, Am, E, Am
    bars.forEach((bar, bi) => {
      const bt = t0 + bi * 6 * E, last = bi === 3;
      bassNote(hz(roots[bi] - 12), bt, 0.55); bassNote(hz(roots[bi] - 5), bt + 3 * E, 0.38);
      chordHit(roots[bi], mino[bi], bt + E, 0.5); chordHit(roots[bi], mino[bi], bt + 4 * E, 0.5);
      bar.forEach((dg, i) => { if (dg === null) return; const len = last && i === 5 ? E * 3 : E * 0.95; voice(kind, hz(deg(dg) + 12), bt + i * E, len, last && i === 5 ? 0.3 : 0.22); });
    });
    // final flourish: tonic + fifth
    const ft = t0 + 4 * 6 * E - E * 0.4; voice(kind, hz(0 + 24), ft + E * 0.4, E * 3, 0.26); voice("bell", hz(12), ft + E * 0.4, 1, 0.3);
    return (4 * 6 * E) * 1000;
  }
  function speak(t) { return say(t, { rate: 0.9, pitch: 1.18 }); }

  function show(i, dir) {
    cur = (i + D.length) % D.length;
    const d = D[cur]; seen.add(d.n); saveSeen();
    $("#dexTabs").querySelectorAll("button").forEach((b, k) => { b.classList.toggle("on", k === cur); if (k === cur) b.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); });
    const card = $("#dexCard");
    card.style.setProperty("--dc", d.c);
    card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
    $("#dexArt").innerHTML = d.e.map((x, k) => '<span class="l' + k + '">' + x + "</span>").join("");
    $("#dexName").textContent = d.n;
    $("#dexLore").textContent = d.lore;
    $("#dexMove").textContent = "⚡ " + d.move;
    $("#dexSay").textContent = "“" + d.say + "”";
    $("#dexStats").innerHTML = [["Aura", d.s[0]], ["Rizz", d.s[1]], ["Chaos", d.s[2]]].map(([k, v]) => '<div><span>' + k + '</span><i><b style="width:0" data-w="' + v + '"></b></i><em>' + v + "</em></div>").join("");
    requestAnimationFrame(() => requestAnimationFrame(() => $("#dexStats").querySelectorAll("b").forEach((b) => (b.style.width = b.dataset.w + "%"))));
    $("#dexSeen").textContent = "Collected " + seen.size + "/" + D.length;
    $("#dexPlay").classList.remove("on");
  }

  let built = false;
  function build() {
    built = true;
    const tabs = $("#dexTabs");
    D.forEach((d, i) => { const b = document.createElement("button"); b.type = "button"; b.textContent = d.n; b.onclick = () => show(i); tabs.appendChild(b); });
    $("#dexPlay").onclick = () => {
      const d = D[cur], b = $("#dexPlay"); b.classList.add("on");
      const ms = jingle(d, cur); setTimeout(() => speak(d.say), Math.max(300, ms * 0.82)); setTimeout(() => b.classList.remove("on"), ms + 1200);
      const art = $("#dexArt"); art.classList.remove("hop"); void art.offsetWidth; art.classList.add("hop");
    };
    const sel = $("#dexVoice");
    const fill = () => { const L = itVoices(); sel.innerHTML = ""; if (!L.length) { sel.innerHTML = "<option>No Italian voice found</option>"; return; } const b = bestVoice(); L.forEach((v) => { const o = document.createElement("option"); o.value = v.name; o.textContent = v.name.replace(/\s*\(.*\)/, ""); if (b && v.name === b.name) o.selected = true; sel.appendChild(o); }); };
    fill(); if (window.speechSynthesis) speechSynthesis.onvoiceschanged = fill;
    sel.onchange = () => { try { localStorage.setItem("br_itvoice", sel.value); } catch (e) {} speak(D[cur].say); };
    $("#dexPrev").onclick = () => show(cur - 1);
    $("#dexNext").onclick = () => show(cur + 1);
    $("#dexRand").onclick = () => show(Math.floor(Math.random() * D.length));
    const art = $("#dexArt");
    $("#dexCard").addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const r = art.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      art.style.transform = "perspective(600px) rotateY(" + px * 24 + "deg) rotateX(" + -py * 24 + "deg)";
    });
    $("#dexCard").addEventListener("pointerleave", () => (art.style.transform = ""));
    let sx = null;
    $("#dexCard").addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    $("#dexCard").addEventListener("touchend", (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); });
    document.addEventListener("keydown", (e) => {
      if (!/dex/.test(location.hash) || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
      if (e.key === "ArrowRight") show(cur + 1); else if (e.key === "ArrowLeft") show(cur - 1);
    });
  }
  window.Dex = { open() { if (!built) build(); show(cur); } };
})();
