# ♞ MOHAN KUMAR | AI & Machine Learning Engineering Portfolio

[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Vanilla)-brightgreen?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web)
[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-100%2F100-success?style=flat-square&logo=google-chrome)](https://pagespeed.web.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-MohanKumarBH23-181717?style=flat-square&logo=github)](https://github.com/MohanKumarBH23)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mohan--kumar--bh--mk23-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/mohan-kumar-bh-mk23)

An editorial, high-performance, and secure personal portfolio website engineered specifically for **Mohan Kumar B.H** — an AI & Machine Learning engineer graduating from **Sai Vidya Institute of Technology** (CGPA: 8.82) and AI Intern at **Digitaltransols AI**.

Built with **Zero Runtime Dependencies** using vanilla web standards (HTML5, Vanilla CSS, modern ES6+ JavaScript), delivering instantaneous load times, 100/100 Lighthouse performance, strict enterprise security headers, interactive developer tools, and turnkey deployment for **Vercel**, **Netlify**, or **GitHub Pages**.

---

## 📑 Table of Contents

- [🌟 Key Highlights & Features](#-key-highlights--features)
- [📚 Peer-Reviewed Research Publication (IEEE ICNPCV 2026)](#-peer-reviewed-research-publication-ieee-icnpcv-2026)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [📁 Project Structure](#-project-structure)
- [🔬 Featured Engineering Projects](#-featured-engineering-projects)
- [💻 Interactive Developer Terminal (CLI)](#-interactive-developer-terminal-cli)
- [🔒 Security & Hardening Architecture](#-security--hardening-architecture)
- [📬 Google Sheets & Email Contact Pipeline](#-google-sheets--email-contact-pipeline)
- [🚀 Quickstart & Local Development](#-quickstart--local-development)
- [🌐 Production Deployment Guide](#-production-deployment-guide)
  - [Deploy to Vercel (Recommended)](#option-1-deploy-to-vercel-recommended)
  - [Deploy to Netlify](#option-2-deploy-to-netlify)
  - [Deploy to GitHub Pages](#option-3-deploy-to-github-pages)
- [⚙️ Personalization & Customization](#️-personalization--customization)
- [👤 About the Author](#-about-the-author)
- [📄 License](#-license)

---

## 🌟 Key Highlights & Features

1. **Editorial Modern Design**:
   - Sleek typography pairing Google Fonts **Inter** (clean sans-serif) and **JetBrains Mono** (technical precision).
   - Dual-theme engine featuring **Obsidian Dark Mode** and **Pearl Light Mode** with automatic OS preference detection (`prefers-color-scheme`) and persistent `localStorage` synchronization.
   - Smooth micro-interactions, responsive navigation, glassmorphic cards, and accent gradients.

2. **60 FPS Neural Particle Canvas**:
   - Ambient, lightweight HTML5 `<canvas>` background graph simulating neural networks and synaptic connections.
   - Interactive mouse repulsion physics and distance-based dynamic alpha bridging.
   - Built-in `IntersectionObserver` that automatically freezes the animation loop when off-screen to preserve CPU cycles and battery life.

3. **Dynamic Typewriter Hero**:
   - Smooth rotating typewriter header cycling through Mohan's key professional identities with custom speed curves and blinking cursor.

4. **Multi-Category Project Filtering & Technical Modals**:
   - Dynamic category filtering across **Computer Vision & Audio**, **LLMs & Multimodal**, and **Machine Learning & Stats**.
   - Deep-dive technical modals featuring system architecture breakdowns, benchmark metrics, and formatted PyTorch/FastAPI/Scikit-learn source snippets.

5. **Interactive Developer CLI Terminal (Easter Egg)**:
   - Floating interactive terminal drawer (`>_ Terminal`) that lets recruiters and engineers query Mohan's skills, experience, education, projects, contact details, and switch themes directly via command-line syntax.

6. **Serverless Contact Pipeline with Anti-Spam Protection**:
   - Interactive contact form with client-side sanitization, RFC 5322 regex validation, client-side token-bucket cooldown, and an invisible honeypot trap to catch automated bots.
   - Seamless integration with Google Apps Script (`google-apps-script.js`) logging submissions to **Google Sheets** and dispatching instant email alerts with a 1-click reply button, with automatic fallback to native mail client.

---

## 📚 Peer-Reviewed Research Publication (IEEE ICNPCV 2026)

Mohan Kumar B.H co-authored and published peer-reviewed research accepted and presented at the **2026 International Conference on Natural Language Processing and Computer Vision (ICNPCV)** organized by the **IEEE Bangalore Section** in Bengaluru, India.

- **Paper Title**: *Intelli-Eye: An Holistic Deep-Learning Architecture for Predictive Threat Analysis and Intelligent Alert Automation*
- **Authors**: Jayshri, Dr. Kumaresh Sheelavant, K V Vardhan, Sumantha S, **Mohan Kumar B H**, Ramesh Karthikeya Reddy K
- **Affiliation**: Department of Computer Science & Engineering (AI & ML), Sai Vidya Institute of Technology, Bengaluru, India
- **Conference / Venue**: 2026 IEEE ICNPCV, Bangalore, India (July 17–18, 2026)
- **IEEE Index / Catalog**: `CFP26CV9-ART` &bull; **ISBN**: `979-8-3315-9284-4` &bull; `©2026 IEEE`
- **Full PDF Document**: Available in [`assets/intelli-eye-paper.pdf`](assets/intelli-eye-paper.pdf)

### 📊 Empirical Performance & Benchmarks (Roboflow & Kaggle Test Sets)

| Detection Module | Target Classes | mAP@0.5 | Precision | Recall | F1-Score | ROC AUC |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Weapon Detection** | Firearms, Knives | **96.3%** | 95.5% | 96.4% | 95.9% | **0.984** |
| **Fire Detection** | Active Flames, Smoke | **92.7%** | 92.1% | 93.3% | 92.7% | **0.967** |
| **Accident Detection** | Vehicle Collisions, Human Falls | **89.4%** | 88.9% | 90.0% | 89.4% | **0.923** |
| **Shoplifting Detection** | Skeletal Concealment & Loitering | **86.8%** | 87.2% | 86.5% | 86.8% | **0.891** |
| **Overall System Avg** | **Multi-Threat Unified Core** | **91.3%** | **92.9%** | **89.7%** | **91.3%** | **0.941** |

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies / Implementation |
| :--- | :--- |
| **Frontend Core** | Semantic HTML5, Vanilla Modern CSS (CSS Custom Properties, Flexbox, Grid), Vanilla ES6+ JavaScript |
| **Runtime Dependencies** | **0 (Zero)** &bull; No npm bloat, no framework overhead, instant browser execution |
| **Animation & Graphics** | HTML5 Canvas 2D API (`requestAnimationFrame`), CSS Keyframe Animations |
| **Backend / Serverless** | Google Apps Script (Webhook Endpoint), Google Sheets API, Gmail MailApp Service |
| **Typography** | Google Fonts (`Inter`, `JetBrains Mono`) |
| **Security Architecture** | Content Security Policy (CSP), Honeypot Field, Token-Bucket Rate Limiter, Anti-XSS Sanitizer, HSTS |
| **Hosting & CI/CD** | Vercel (`vercel.json`), Netlify (`netlify.toml`, `_headers`), GitHub Pages |

---

## 📁 Project Structure

```text
Mohan PF/
├── assets/
│   ├── intelli-eye-paper.pdf       # Full IEEE ICNPCV 2026 conference research paper (PDF)
│   ├── ICNPCV2026_Paper1172.pdf    # Direct IEEE camera-ready submission copy
│   └── mohan-avatar.jpg            # Professional avatar / headshot
├── css/
│   └── style.css                   # Comprehensive design system, themes, and layouts
├── js/
│   ├── main.js                     # Core interactivity, modal manager, CLI, and contact logic
│   ├── particles.js                # Ambient neural network particle canvas simulation
│   └── security.js                 # SecurityGuard module (Anti-XSS, rate limiting, honeypot)
├── _headers                        # Static HTTP security headers for Netlify / Cloudflare
├── google-apps-script.js           # Serverless backend script for Google Sheets & Gmail alerts
├── GOOGLE_SHEETS_SETUP.md          # Step-by-step setup documentation for the contact webhook
├── index.html                      # Semantic single-page portfolio document with JSON-LD schema
├── netlify.toml                    # Netlify production deployment & caching rules
├── README.md                       # Comprehensive project documentation
├── robots.txt                      # Search engine crawler instructions
├── site.webmanifest                # Progressive Web App (PWA) manifest
├── sitemap.xml                     # Search engine XML sitemap
└── vercel.json                     # Vercel production edge headers & route configuration
```

---

## 🔬 Featured Engineering Projects

### 1. Intelli-Eye: ML-Based Surveillance System
- **Focus**: Computer Vision & Audio AI (Edge Deployment)
- **Description**: GPU-accelerated multi-modal surveillance framework combining Ultralytics YOLOv8 real-time object detection and tracking with spectrogram audio anomaly CNN classification (distress screams, glass breaking) to trigger automated municipal alerts.
- **Key Technologies**: `Python`, `OpenCV`, `YOLOv8`, `CNNs`, `Edge AI`, `Smart Cities`
- **Metrics**: 60+ FPS Realtime throughput, `< 25ms` audio anomaly classification latency.

### 2. AI Interview Engine (Gemini 2.0 Flash)
- **Focus**: Multimodal AI & Large Language Models
- **Organization**: Engineered during internship at **Digitaltransols AI Private Limited**
- **Description**: Real-time bilingual (Kannada/English) platform leveraging Gemini 2.0 Flash for low-latency multimodal speech transcription, adaptive rubric evaluation, and contextual dynamic follow-up questioning.
- **Key Technologies**: `FastAPI`, `Next.js`, `Gemini 2.0 Flash`, `Speech Audio`, `Adaptive LLMs`
- **Metrics**: Dual-language support (Kannada + English), automated PDF evaluation report generation.

### 3. Personalized Music Recommendation System
- **Focus**: Machine Learning & Statistical Modeling
- **Repository**: [github.com/MohanKumarBH23/Music-Recommendation-Agent](https://github.com/MohanKumarBH23/Music-Recommendation-Agent)
- **Description**: Multi-tiered recommendation engine combining Collaborative and Content-Based Filtering with K-Means clustering. Analyzes acoustic features from the Spotify Web API with PCA (retaining 95% variance) and t-SNE for dimensional projection and Cosine Similarity ranking.
- **Key Technologies**: `Scikit-learn`, `Pandas`, `Spotify API`, `PCA`, `t-SNE`, `Seaborn / Plotly`
- **Metrics**: Sub-second Cosine Similarity candidate generation across multi-thousand track datasets.

### 4. Maze-Runner-Py: Procedural 2D Maze & Pathfinding Framework
- **Focus**: Graph Search Algorithms, Procedural Generation & Simulation
- **Repository**: [github.com/MohanKumarBH23/Maze-Runner-Py](https://github.com/MohanKumarBH23/Maze-Runner-Py)
- **Description**: Modular Python framework for procedural 2D maze generation (Depth-First Search Backtracking, Binary Tree) and intelligent graph search pathfinding (guaranteed shortest-path BFS, DFS, and simultaneous Bi-Directional search) with dynamic frame-by-frame Matplotlib animated visualizations.
- **Key Technologies**: `Python 3.8+`, `Graph Algorithms`, `Breadth-First Search (BFS)`, `Depth-First Search (DFS)`, `Bi-Directional Search`, `Matplotlib`, `CLI Engine`
- **Metrics**: BFS guaranteed shortest-path optimality, multi-algorithm procedural labyrinth generation, high-res static PNG and animation export.

---

## 💻 Interactive Developer Terminal (CLI)

The portfolio features a built-in terminal emulator accessible via the floating **`>_ Terminal`** launcher button. Recruiters and engineers can explore credentials using terminal commands:

| Command | Output / Action |
| :--- | :--- |
| `help` | Lists all available terminal commands |
| `about` | Mohan's engineering background, core focus areas, and AI specialization |
| `education` | College, degree, coursework, graduation year, and CGPA |
| `experience` | AI Internship details at Digitaltransols AI Private Limited |
| `skills` | Programming languages, ML frameworks, core CS concepts, and cloud tools |
| `publications` | Peer-reviewed research papers (IEEE ICNPCV 2026) |
| `paper` / `pdf` | Opens the full IEEE research publication PDF directly |
| `projects` | Summary of featured engineering systems |
| `contact` | Phone, email, LinkedIn, and GitHub links |
| `theme` | Toggles live between Obsidian Dark and Pearl Light themes |
| `clear` | Clears the terminal output buffer |

---

## 🔒 Security & Hardening Architecture

Security is treated as a first-class citizen with defense-in-depth across the client and edge layers:

```
[ Visitor Request ]
        │
        ▼
[ Edge Security Headers ] ──▶ CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options
        │
        ▼
[ Client-Side SecurityGuard ]
        ├─▶ 1. Anti-XSS Sanitizer (Encodes <, >, &, ", ', / entities)
        ├─▶ 2. Honeypot Trap (_gotcha_hp silent bot drop)
        ├─▶ 3. Token-Bucket Rate Limiter (45s cooldown in localStorage)
        └─▶ 4. Secure Async Clipboard (Guarded against injection)
        │
        ▼
[ Google Apps Script Webhook / FormSubmit Direct Web Pipeline ]
```

- **Strict Content Security Policy (CSP)**: Disallows unauthorized external scripts and inline script execution while permitting trusted Google Fonts and self-hosted assets.
- **Anti-Clickjacking**: Enforced via `X-Frame-Options: DENY` and `frame-ancestors 'none'`.
- **Anti-Bot Honeypot**: Invisible trap input field (`_gotcha_hp`) that flags and silently drops automated spam submissions.
- **Client-Side Rate Limiter**: 30-second token-bucket cooldown prevents form flooding.
- **MIME Sniffing & XSS Protection**: `X-Content-Type-Options: nosniff` and `X-XSS-Protection: 1; mode=block`.
- **Permissions Policy**: Completely restricts camera, microphone, geolocation, and payment APIs unless explicitly authorized.

---

## 📬 Website-Direct Contact Pipeline

Inquiries are **accepted directly through the website** without ever forcing or launching an external desktop mail client (`mailto:`):

1. **Full Serverless Webhook (Recommended)**:
   - When `GOOGLE_APPS_SCRIPT_URL` is set, submissions are logged directly to a private Google Sheet and trigger an instant notification email to `mohankumarbh007@gmail.com`.
   - See [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) for the 4-step setup guide using [`google-apps-script.js`](google-apps-script.js).
2. **Direct Background Dispatch & Local Persistence**:
   - Zero-config background dispatch forwards the message to Mohan without taking the user away from the website.
   - All submissions are safely logged in browser `localStorage` with unique Reference IDs (`#INQ-XXXXXX`).
   - Mohan can inspect all website inquiries directly in the interactive developer terminal by typing `inquiries`!

---

## 🚀 Quickstart & Local Development

Because this project uses zero build steps or bundlers, you can run and test it immediately with any static server.

### Option A: Using Python (Pre-installed on most systems)

```bash
# Navigate to the project root
cd "Mohan PF"

# Start a local HTTP server
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### Option B: Using Node.js `serve`

```bash
# Run instantaneously without global install
npx -y serve .
```

### Option C: Using VS Code Live Server
Right-click on [`index.html`](index.html) and select **"Open with Live Server"**.

---

## 🌐 Production Deployment Guide

### Option 1: Deploy to Vercel (Recommended)

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Update portfolio assets and documentation"
   git push origin main
   ```
2. Navigate to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository (`MohanKumarBH23/Mohan_PortFolio_site`).
4. Keep the default build settings (Vercel automatically detects static HTML and applies [`vercel.json`](vercel.json) for edge caching and security headers).
5. Click **"Deploy"**.

### Option 2: Deploy to Netlify

- **Via Git**: Connect your repository on [netlify.com](https://netlify.com). Netlify will automatically detect [`netlify.toml`](netlify.toml) and [`_headers`](_headers).
- **Via Manual Deploy**: Go to Netlify **Sites** and drag-and-drop the project folder directly into the web console.

### Option 3: Deploy to GitHub Pages

1. Open your repository on GitHub.
2. Go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Branch**, select `main` and `/ (root)`.
4. Click **Save**. Your site will be live at:
   ```text
   https://<your-username>.github.io/<repo-name>/
   ```

---

## ⚙️ Personalization & Customization

| Item to Update | File Location | Search Keywords |
| :--- | :--- | :--- |
| **Personal Info & Bio** | [`index.html`](index.html) | `Mohan Kumar`, `CSE(AI & ML)` |
| **Contact Details** | [`index.html`](index.html), [`js/main.js`](js/main.js) | `mohankumarbh007@gmail.com`, `9980507072` |
| **Profile Photo** | [`assets/mohan-avatar.jpg`](assets/mohan-avatar.jpg) | Replace with 1:1 ratio image |
| **CV / Resume Link** | [`index.html`](index.html) | `Download CV` |
| **Projects & Modals** | [`index.html`](index.html), [`js/main.js`](js/main.js) | `projectData`, `Intelli-Eye`, `ai-interview` |
| **Terminal Commands** | [`js/main.js`](js/main.js) | `cliCommands` |
| **Contact Webhook** | [`js/main.js`](js/main.js) | `GOOGLE_APPS_SCRIPT_URL` |
| **Domain / Canonical** | [`index.html`](index.html), [`sitemap.xml`](sitemap.xml) | `canonical`, `og:url` |

---

## 👤 About the Author

**Mohan Kumar B.H**  
*AI & Machine Learning Engineer*  
- **Degree**: B.Tech in Computer Science and Engineering (AIML) &bull; CGPA: 8.82 / 10.0  
- **Alma Mater**: Sai Vidya Institute of Technology, Bangalore  
- **Experience**: AI Intern at Digitaltransols AI Private Limited, Bangalore  
- **Phone**: [+91 9980507072](tel:+919980507072)  
- **Email**: [mohankumarbh007@gmail.com](mailto:mohankumarbh007@gmail.com)  
- **LinkedIn**: [linkedin.com/in/mohan-kumar-bh-mk23](https://www.linkedin.com/in/mohan-kumar-bh-mk23)  
- **GitHub**: [github.com/MohanKumarBH23](https://github.com/MohanKumarBH23)  

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE). You are free to use it as a foundation for your own portfolio.
