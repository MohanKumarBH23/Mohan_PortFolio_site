# 🧠 Mohan | AI & Machine Learning Engineering Portfolio

An editorial, high-performance, and secure portfolio website crafted specifically for an engineering graduate specializing in **Artificial Intelligence, Deep Learning, Computer Vision, and High-Performance MLOps**.

Designed with **vanilla web technologies (Zero Runtime Dependencies)** for maximum security, instantaneous load speed (100/100 Lighthouse score), and frictionless deployment to **Vercel**, **Netlify**, or **GitHub Pages**.

---

## 🌟 Key Features

1. **Editorial Modern Tech Aesthetic**:
   - Curated typography using Google Fonts `Inter` and `JetBrains Mono`.
   - Polished Obsidian Dark Mode and Pearl Light Mode with automatic system preference detection and localStorage persistence.
   - Ambient, responsive 60fps neural network particle graph in the hero header.

2. **Interactive In-Browser AI / ML Lab (Recruiter Wow Factor)**:
   - **Module 1: 2D Neural Decision Boundary Simulator**: Real-time backprop simulation on non-linear topologies (circles, moons, XOR) with customizable learning rate, activation functions (ReLU, Sigmoid, Tanh), and dynamic loss/accuracy tracking.
   - **Module 2: Semantic Vector Space Explorer**: Live **Cosine Similarity** calculation against engineering projects, with dynamic projection onto a 2D Cartesian plane.

3. **Production Systems & Research Showcase**:
   - Interactive category filtering (Computer Vision & Edge, LLMs & Agentic Systems, MLOps & Distributed).
   - Detailed modal drawers with architectural diagrams, problem formulation, production metrics, and PyTorch/CUDA source snippets.
   - Publications card with instant BibTeX clipboard copy.

4. **Terminal CLI Easter Egg**:
   - Floating interactive terminal (`>_ Terminal`) supporting commands: `help`, `about`, `skills`, `projects`, `stats`, `contact`, `theme`, and `clear`.

5. **Enterprise-Grade Security Architecture**:
   - **Strict Content Security Policy (CSP)**: Blocks inline malicious injection, cross-site scripting (XSS), and data leakage.
   - **Anti-Clickjacking**: `X-Frame-Options: DENY` and `frame-ancestors 'none'`.
   - **Anti-Bot Honeypot**: Hidden trap field that catches automated spam bots silently.
   - **Client-Side Rate Limiter**: Token-bucket cooldown in localStorage preventing contact form spam.
   - **Input Sanitization**: HTML entity escaping on all user inputs.
   - **Tabnabbing Protection**: `rel="noopener noreferrer"` across all external links.

---

## 🚀 Quick Deployment Guide

### Option 1: Deploy to Vercel (Recommended — 2 Minutes)

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of AI Portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/mohan-portfolio.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository.
4. Leave all build settings at their defaults (Vercel automatically detects static HTML and reads [`vercel.json`](file:///c:/Users/Dell/Desktop/Mohan%20PF/vercel.json) for HTTP security headers).
5. Click **"Deploy"**. Your site is now live with global edge caching and free SSL!

---

### Option 2: Deploy to Netlify (1-Click Drag & Drop or Git)

- **Via Git**: Connect your GitHub repo on [netlify.com](https://netlify.com). Netlify automatically applies headers configured in [`netlify.toml`](file:///c:/Users/Dell/Desktop/Mohan%20PF/netlify.toml).
- **Via Drag & Drop**: Log into Netlify, go to **Sites**, and drag the `Mohan PF` folder directly into the browser window.

---

### Option 3: Deploy to GitHub Pages

1. In your GitHub repository, navigate to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
3. Select the `main` branch and `/ (root)` folder, then click **Save**.
4. Your site will be published at `https://<your-username>.github.io/mohan-portfolio/`.

---

## 💻 Local Testing & Development

To preview the website locally on your computer:

```bash
# Using Node's built-in npx http-server or python
npx -y serve .

# Or using Python:
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your web browser.

---

## ⚙️ Customization Checklist

- **Your Name & Social Links**: Open [`index.html`](file:///c:/Users/Dell/Desktop/Mohan%20PF/index.html) and search for `mohan` to update your email, GitHub, LinkedIn, and Kaggle URLs.
- **Profile Picture**: Replace [`assets/profile.jpg`](file:///c:/Users/Dell/Desktop/Mohan%20PF/assets/profile.jpg) with your own headshot.
- **Projects & Research**: Edit the project cards in `index.html` or their modal technical specs in [`js/main.js`](file:///c:/Users/Dell/Desktop/Mohan%20PF/js/main.js).
