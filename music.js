/* Original "Italian brainrot" tarantella loop, synthesized live with WebAudio. No audio files. */
(function () {
  "use strict";
  const KEY = "br_music";
  let ac, master, timer, step = 0, nextT = 0, on = false;
  const BPM = 172, EIGHTH = 60 / BPM / 2 * 1.5; // 6/8 feel, fast tarantella
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  // A harmonic minor tarantella: [chord root midi, fifth midi, minor/major third]
  const PROG = [[45, 52, "m"], [45, 52, "m"], [40, 47, "M"], [45, 52, "m"], [38, 45, "m"], [45, 52, "m"], [40, 47, "M"], [45, 52, "m"]];
  const TRI = { m: [0, 3, 7], M: [0, 4, 7] };
  // melody per bar: 6 eighth-note slots, midi or 0 (rest)
  const MEL = [
    [81, 80, 81, 76, 0, 77], [81, 80, 81, 83, 81, 0], [80, 83, 80, 76, 0, 80], [81, 76, 72, 76, 81, 0],
    [77, 76, 77, 74, 0, 77], [76, 77, 76, 72, 0, 76], [80, 83, 85, 83, 80, 76], [81, 0, 76, 0, 81, 0]
  ];
  function init() {
    if (ac) return;
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination);
  }
  function env(g, t, a, d, v) { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function pluck(f, t, v, dur) { // mandolin-ish: two detuned triangles + quick decay
    [0, 4].forEach((c) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = "triangle"; o.frequency.value = f; o.detune.value = c; o.connect(g); g.connect(master); env(g, t, 0.005, dur, v); o.start(t); o.stop(t + dur + 0.05); });
  }
  function bass(f, t, v) { const o = ac.createOscillator(), g = ac.createGain(); o.type = "sine"; o.frequency.value = f; o.connect(g); g.connect(master); env(g, t, 0.01, EIGHTH * 2.4, v); o.start(t); o.stop(t + EIGHTH * 2.6); }
  function pad(freqs, t, len) { // accordion-ish saw pad through lowpass
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900; lp.connect(master);
    freqs.forEach((f) => { [-6, 6].forEach((c) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = "sawtooth"; o.frequency.value = f; o.detune.value = c; o.connect(g); g.connect(lp); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.018, t + 0.05); g.gain.setValueAtTime(0.018, t + len - 0.08); g.gain.linearRampToValueAtTime(0.0001, t + len); o.start(t); o.stop(t + len + 0.02); }); });
  }
  function tamb(t) { const n = ac.createBufferSource(), b = ac.createBuffer(1, ac.sampleRate * 0.06, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); n.buffer = b; const hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 6000; const g = ac.createGain(); g.gain.value = 0.05; n.connect(hp); hp.connect(g); g.connect(master); n.start(t); }
  function schedule() {
    const lookahead = ac.currentTime + 0.25;
    while (nextT < lookahead) {
      const bar = Math.floor(step / 6) % 8, pos = step % 6, ch = PROG[bar];
      if (pos === 0) { bass(hz(ch[0] - 12), nextT, 0.22); pad(TRI[ch[2]].map((i) => hz(ch[0] + 12 + i)), nextT, EIGHTH * 6); }
      if (pos === 3) bass(hz(ch[1] - 12), nextT, 0.16);
      if (pos === 1 || pos === 4) tamb(nextT);
      const m = MEL[bar][pos]; if (m) pluck(hz(m), nextT, 0.13, EIGHTH * 1.6);
      else if (pos % 2 === 1) pluck(hz(ch[0] + 24 + TRI[ch[2]][pos % 3]), nextT, 0.04, EIGHTH); // fill
      nextT += EIGHTH; step++;
    }
  }
  function duck() { if (!on) return; const sp = window.speechSynthesis && window.speechSynthesis.speaking; master.gain.setTargetAtTime(sp ? 0.25 : 1, ac.currentTime, 0.15); }
  function start() {
    init(); if (ac.state === "suspended") ac.resume();
    if (on) return; on = true; step = 0; nextT = ac.currentTime + 0.05;
    master.gain.cancelScheduledValues(ac.currentTime); master.gain.setTargetAtTime(1, ac.currentTime, 0.3);
    timer = setInterval(() => { schedule(); duck(); }, 80);
    try { localStorage.setItem(KEY, "1"); } catch (e) {}
    ui();
  }
  function stop() {
    if (!on) return; on = false; clearInterval(timer);
    master.gain.setTargetAtTime(0, ac.currentTime, 0.12);
    try { localStorage.setItem(KEY, "0"); } catch (e) {}
    ui();
  }
  const btn = document.createElement("button");
  btn.id = "musicBtn"; btn.type = "button"; btn.setAttribute("aria-label", "Toggle music");
  function ui() { btn.textContent = on ? "🎶 Musica on" : "🔇 Musica"; btn.classList.toggle("on", on); btn.classList.toggle("pulse", !on); }
  btn.onclick = () => { if (on) stop(); else { start(); shout("Mamma mia!"); } };
  document.body.appendChild(btn); ui();

  // Italian-accent shout (browser it-IT voice if available)
  let lastShout = 0;
  function shout(t) {
    const ss = window.speechSynthesis; if (!ss || Date.now() - lastShout < 4000 || ss.speaking) return; lastShout = Date.now();
    if (window.ItVoice) { window.ItVoice.say(t, { rate: 0.95, pitch: 1.2 }); return; }
    const u = new SpeechSynthesisUtterance(t); u.lang = "it-IT"; ss.speak(u);
  }
  const SH = ["Mamma mia!", "Madonna mia!", "Che bello!", "Bravissimo!", "Spaghetti!"];
  document.addEventListener("click", (e) => { if (on && e.target.closest("#hero") && !e.target.closest("button,a")) shout(SH[Math.floor(Math.random() * SH.length)]); });
  // resume after first tap if the user had music on last time
  let want = false; try { want = localStorage.getItem(KEY) === "1"; } catch (e) {}
  if (want) { const go = () => { start(); document.removeEventListener("pointerdown", go); }; document.addEventListener("pointerdown", go); }
  document.addEventListener("visibilitychange", () => { if (!ac) return; if (document.hidden) ac.suspend(); else if (on) ac.resume(); });
  window.BrainrotMusic = { start, stop, shout };
})();
