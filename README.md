<div align="center">

# 🧠 The Brainrot

### Turn any situation into a Hinglish comic book — and get roasted by an AI chatbot.

![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![No build](https://img.shields.io/badge/build-none-2ea66b)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

**[Live demo](https://the-brainrot.onrender.com)** · **[Run locally](#-run-locally)** · **[Roast Bot](#-roast-bot)**

</div>

---

## ✨ What is it?

**The Brainrot** is a mobile-friendly, hackathon-ready web app. Pick a mood, choose your characters, optionally type your own situation, and watch a funny Hinglish conversation play out as a **comic book** with page-turn animation, speech bubbles, sound effects and voice.

There is also a **Roast Bot**: type any query and it roasts you for it.

> Fan-made, fictional comedy for fun. Not affiliated with or endorsed by any show, network or institution mentioned.

## 🎮 How it works

| Step | Page | What you do |
|------|------|-------------|
| 1 | **Mood** | Pick one of six moods (Chumbak Colony, IGDTU Wars, Chaotic Friends, Sibling Fight, Exam Panic, Group Project) |
| 2 | **Characters** | Choose 2–4 characters, each with their own personality and drawn avatar |
| 3 | **Message** | Type a situation (optional), pick Story or Roast Battle, set the Rot level |
| 4 | **Comic** | A curtain rises and the comic opens, page by page |

## 🚀 Features

**Comic reader**
- 3D page-turn book with halftone panels, speech bubbles and sound-effect bursts
- Procedurally drawn SVG avatars (no image files)
- Text-to-speech with a per-character voice profile (Web Speech API, `en-IN` / `hi-IN`)
- Synthesized sound effects (WebAudio): pop, boom, bruh, dun-dun-dun, ding, laugh

**Brainrot mechanics**
- 📊 **Brainrot Meter:** animated gauge and rank, from "NPC Energy" to "Terminally Cooked"
- ✨ **Aura points:** floating `+500` / `-250` per panel and an end-of-story leaderboard
- 🌡️ **Rot level:** Mild, Medium or Cooked (more slang and more chaos)
- 💥 **Chaos events:** Mummy's chappal, blackout, breaking-news ticker, WiFi lag glitch
- 🔀 **Bonus round:** choose Roast, Chill or Chaos and the ending changes
- 🔥 **Roast Battle mode:** characters roast your line and a judge gives a verdict
- 📅 **Brainrot of the Day:** daily prompt with a streak counter
- 🥚 **Easter egg:** Konami code, or tap the logo five times, for *Cooked mode*

**Landing page**
- Draggable 3D cube, mouse parallax, orbiting emojis, glitch title
- Tap anywhere for an emoji burst
- 3D tilt on mood cards

**AI and personalization**
- ✨ **AI Comic:** the AI writes a fresh comic for your situation and characters (needs the server proxy)
- ➕ **Custom characters:** create your own with a nature (dramebaaz, aalsi, topper, savage, foodie, gossip)
- 🏅 **15 badges** and 🎁 **Brainrot Wrapped** stats card
- 📲 **PWA:** installable, offline shell

**Sharing**
- Shareable story links (the story is encoded in the URL, no server needed)
- Downloadable PNG card (1080×1350) via `html2canvas`

## 🔥 Roast Bot

Open it from the header (`#roast`) and type any query, excuse or plan.

- **4 personas:** Desi Mummy · Savage Dost · Gen-Z Bro · Topper Bhaiya
- **3 levels:** Mild · Medium · Cooked
- **3 modes:** Roast me · Roast a friend (name + habits) · Roast the bot (it scores your roast 0-100)
- **Extras:** typewriter replies, 🔊 voice per persona, 🖼 shareable roast card
- **Works offline:** a topic-aware engine (study, love, money, gym, job, gaming, sleep and more) quotes your own words back at you
- **Optional real AI:** open **⚙ AI**, pick a provider and paste your own API key

| Provider | Model used |
|----------|-----------|
| Anthropic | `claude-haiku-5-5` |
| OpenAI | `gpt-4o-mini` |
| Google Gemini | `gemini-2.0-flash` |
| Groq | `openai/gpt-oss-20b` |

Models can be changed in `aiRoast()` inside [`roast.js`](roast.js). If an AI call fails, the bot falls back to the offline engine.

> ⚠️ **About API keys:** on a deployment, set the key as a server environment variable (see [Deploy](#-deploy)). A key pasted in **⚙ AI** stays in that visitor's own `localStorage` and is sent directly to the provider.

## 🛡️ Safety

- All characters are fictional. Jokes never target real students, teachers or other people.
- Roasts never target religion, caste, gender, sexuality, body, disability or region.
- If a message suggests self-harm, the bot drops the roast and shows a helpline (Tele-MANAS 14416 in India).

## 🧱 Tech stack

Vanilla **HTML, CSS and JavaScript**. No framework, no build step, no backend.

- Hash router with page transitions (`#mood`, `#chars`, `#msg`, `#story`, `#roast`)
- Procedural SVG avatars seeded by character id
- Web Speech API for voice, WebAudio for sound effects
- `html2canvas` (CDN, lazy-loaded) for the PNG card
- `localStorage` for streaks, stats and the optional API key

## 📁 Project structure

```
.
├── index.html   # pages and layout
├── style.css    # comic / neo-brutalist theme, 3D hero, chat UI
├── app.js       # router, story engine, comic book, voice, share
├── data.js      # moods, characters, punchlines, slang, roasts
├── roast.js     # Roast Bot (offline engine + AI providers)
├── server.js    # Node server for Render (static files + /api)
├── api/roast.js # AI proxy that keeps the API key secret
├── extras.js    # badges and Wrapped
├── sw.js, manifest.webmanifest, icon.svg  # PWA
├── DEMO.md      # 60-second demo script
├── .env.example # environment variables template
└── README.md
```

## 💻 Run locally

```bash
git clone https://github.com/neha11igdtuw-ship-it/The-BrainRot.git
cd The-BrainRot
python3 -m http.server 8000
```

Open <http://localhost:8000>. Use a local server rather than opening `index.html` directly, so everything loads correctly.

## 🌍 Deploy on Render

The repo includes a small dependency-free Node server ([`server.js`](server.js)) that serves the site and the `/api/roast` proxy, so your API key stays on the server.

1. Push the repo to GitHub.
2. On [Render](https://dashboard.render.com): **New + → Web Service** → connect this repo.
3. Settings: Runtime **Node**, Build Command `echo "no build"`, Start Command `node server.js`, Instance **Free**.
4. Add environment variables:

| Variable | Example |
|----------|---------|
| `AI_PROVIDER` | `groq` (or `anthropic`, `openai`, `gemini`) |
| `GROQ_API_KEY` | your key (use the variable matching the provider) |
| `AI_MODEL` | optional model override |
| `RATE_LIMIT_PER_MIN` | optional, default `15` |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | optional, strict shared rate limit |

5. Deploy. Roast Bot switches to **🤖 Real AI** and **✨ AI Comic** appears.

The repo also has a [`render.yaml`](render.yaml) blueprint. The free plan sleeps after about 15 minutes of inactivity, so the first visit can take up to a minute.

**Local dev:** copy `.env.example` to `.env`, fill in a key, then run `npm start` (loads env from your shell: `set -a; . ./.env; set +a; npm start`).

The key never reaches the browser. The server validates input, only accepts same-origin requests and rate-limits per IP.

## 🛠️ Customize

Everything funny lives in [`data.js`](data.js):

| Want to change | Edit |
|----------------|------|
| Add or edit characters | `window.CHARS` |
| Add a mood or change its chips and random lines | `window.MOODS` |
| Keyword → topic reactions | `window.TOPIC_RULES` |
| Slang, roasts, ranks, verdicts, aura values | `window.EX` |
| Roast Bot personas and roast lines | `PERSONAS` and `BANK` in `roast.js` |

## 🗺️ Roadmap

- [ ] Global daily leaderboard (needs a database such as Vercel KV)
- [ ] More moods and a community character pack
- [ ] Streaming replies in Roast Bot

## 🤝 Contributing

Ideas, new punchlines and bug reports are welcome. Open an issue or a pull request. Please keep jokes friendly and fictional.

## 📄 License

Released under the [MIT License](LICENSE). Copyright (c) 2026 Neha.
