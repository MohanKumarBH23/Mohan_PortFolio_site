/**
 * MAIN INTERACTIVITY CONTROLLER
 * Mohan Kumar B.H | AI & Machine Learning Engineering Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. THEME SWITCHER (Dark / Light with localStorage)
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  function initTheme() {
    const savedTheme = localStorage.getItem('mohan_theme');
    if (savedTheme) {
      root.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', nextTheme);
      localStorage.setItem('mohan_theme', nextTheme);
      showToast(`Switched to ${nextTheme} mode`);
    });
  }

  initTheme();

  /* ==========================================================================
     2. NAVBAR SCROLL EFFECT & MOBILE NAVIGATION
     ========================================================================== */
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active section scroll spy
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => navObserver.observe(sec));

  /* ==========================================================================
     2.2 HERO DYNAMIC TYPEWRITER EFFECT (Musadiq Pasha Inspired)
     ========================================================================== */
  const typewriterElement = document.getElementById('hero-typewriter');
  if (typewriterElement) {
    const typewriterPhrases = [
      'Mohan',
      'AI&ML Graduate',
      'Aspirant',
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let currentSpeed = 100;

    function runTypewriter() {
      const currentPhrase = typewriterPhrases[phraseIdx];

      if (isDeleting) {
        charIdx--;
        typewriterElement.textContent = currentPhrase.substring(0, charIdx);
        currentSpeed = 50;
      } else {
        charIdx++;
        typewriterElement.textContent = currentPhrase.substring(0, charIdx);
        currentSpeed = 110;
      }

      if (!isDeleting && charIdx === currentPhrase.length) {
        currentSpeed = 1800;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % typewriterPhrases.length;
        currentSpeed = 350;
      }

      setTimeout(runTypewriter, currentSpeed);
    }

    setTimeout(runTypewriter, 350);
  }

  /* ==========================================================================
     3. PROJECT FILTERING SYSTEM
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterVal === 'all' || card.getAttribute('data-category') === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'slideIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     4. PROJECT DETAIL MODAL SYSTEM (MOHAN'S REAL PROJECTS)
     ========================================================================== */
  const projectData = {
    'intelli-eye': {
      title: 'Intelli-Eye: ML-Based Surveillance System',
      badge: 'Computer Vision & Audio AI',
      category: 'GPU-Accelerated Surveillance & Edge Deployment',
      overview: 'Engineered a real-time smart surveillance architecture combining YOLOv8 computer vision detection with spectrogram audio anomaly classification to autonomously detect physical threats, glass breakage, and distress screams.',
      architecture: [
        'Vision Backbone: Ultralytics YOLOv8 real-time object detection & tracking pipeline',
        'Audio Anomaly: CNN spectrogram classifier analyzing microphone streams for scream and glass breaking signatures',
        'Frame Processing: GPU-accelerated OpenCV frame grabber with circular ring buffer',
        'Alert Infrastructure: Real-time incident dispatching with automated smart city notification triggers'
      ],
      metrics: [
        { label: 'Vision Model', value: 'YOLOv8 Edge' },
        { label: 'Multimodal', value: 'Vision + Audio' },
        { label: 'Anomaly Latency', value: '< 25 ms' },
        { label: 'Pipeline Speed', value: '60+ FPS Realtime' }
      ],
      codeSnippet: `# Intelli-Eye Multi-Modal Threat Detection Pipeline Excerpt
import cv2
from ultralytics import YOLO
import numpy as np

class IntelliEyePipeline:
    def __init__(self, yolo_weights="yolov8n.pt", audio_anomaly_model=None):
        self.vision_model = YOLO(yolo_weights)
        self.audio_classifier = audio_anomaly_model

    def process_multimodal_frame(self, video_frame, audio_spectrogram):
        # 1. Vision Detection (YOLOv8)
        vision_results = self.vision_model(video_frame, stream=True)
        detected_objects = [box.cls for r in vision_results for box in r.boxes]

        # 2. Audio Anomaly Inference
        audio_score = self.audio_classifier.predict(audio_spectrogram)
        is_audio_threat = audio_score > 0.85 # screams or glass breaks

        if is_audio_threat and len(detected_objects) > 0:
            self.dispatch_smart_alert("HIGH_PRIORITY_THREAT", detected_objects)
        return vision_results`,
      githubUrl: 'https://github.com/mohankumarbh',
      demoUrl: 'https://github.com/mohankumarbh'
    },
    'ai-interview': {
      title: 'AI Interview Engine (Gemini 2.0 Flash)',
      badge: 'Multimodal AI & LLMs',
      category: 'Digitaltransols AI Private Limited',
      overview: 'Engineered an end-to-end bilingual (Kannada & English) conversational interview platform at Digitaltransols AI. Leverages Gemini 2.0 Flash for low-latency multimodal audio transcription, rubric evaluation, and contextual dynamic follow-ups.',
      architecture: [
        'LLM Core: Gemini 2.0 Flash multimodal real-time speech and context engine',
        'Backend: FastAPI asynchronous microservice with streaming WebSockets',
        'Frontend: Next.js responsive full-stack candidate interview console',
        'Adaptive Rubric: Evaluates answers against criteria rubrics and dynamically synthesizes follow-up probes'
      ],
      metrics: [
        { label: 'Languages', value: 'Kannada + English' },
        { label: 'Inference', value: 'Gemini 2.0 Flash' },
        { label: 'Evaluation', value: 'Rubric Scoring' },
        { label: 'Report Delivery', value: 'Automated PDF' }
      ],
      codeSnippet: `# FastAPI Bilingual Interview Evaluator with Gemini 2.0
from fastapi import FastAPI, UploadFile
from google import genai

app = FastAPI(title="AI Interview Engine")
client = genai.Client()

@app.post("/api/evaluate-response")
async def evaluate_candidate(audio: UploadFile, language: str = "kannada", rubric_criteria: dict = None):
    audio_bytes = await audio.read()
    
    prompt = f"""
    You are an expert bilingual technical interviewer conducting an interview in {language}.
    Transcribe the candidate's audio, grade their technical depth according to the rubric: {rubric_criteria},
    and return an adaptive contextual follow-up question.
    """
    
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=[prompt, genai.types.Part.from_bytes(data=audio_bytes, mime_type="audio/mp3")]
    )
    return {"evaluation": response.text}`,
      githubUrl: 'https://github.com/mohankumarbh',
      demoUrl: 'https://github.com/mohankumarbh'
    },
    'music-recommender': {
      title: 'Personalized Music Recommendation System',
      badge: 'Machine Learning & Clustering',
      category: 'Data Science & Statistical Modeling',
      overview: 'Comprehensive music recommendation system applying Collaborative Filtering, Content-Based Filtering, and K-Means clustering. Analyzes acoustic features from Spotify API with PCA and t-SNE for dimensional projection and Cosine Similarity.',
      architecture: [
        'Feature Pipeline: Extracted danceability, acousticness, tempo, and valence via Spotify Web API',
        'Dimensionality Reduction: PCA retains 95% variance; t-SNE projects 2D latent clusters',
        'Clustering: Optimal K-Means clustering with Silhouette score and Elbow validation',
        'Recommendation Engine: Cosine Similarity matrix for sub-second ranking and candidate generation'
      ],
      metrics: [
        { label: 'Clustering', value: 'K-Means + PCA' },
        { label: 'Distance Metric', value: 'Cosine Similarity' },
        { label: 'Data Source', value: 'Spotify API' },
        { label: 'Libraries', value: 'Scikit-learn, Pandas' }
      ],
      codeSnippet: `# Cosine Similarity & K-Means Pipeline
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans

def compute_music_recommendations(user_song_vector, music_db_df, top_k=5):
    # Standardized audio features
    features = ['danceability', 'energy', 'valence', 'tempo', 'acousticness']
    X = music_db_df[features].values
    
    # Cosine Similarity between user target and corpus
    sim_scores = cosine_similarity(user_song_vector.reshape(1, -1), X).flatten()
    top_indices = np.argsort(sim_scores)[::-1][:top_k]
    
    return music_db_df.iloc[top_indices][['song_name', 'artist', 'genre']]`,
      githubUrl: 'https://github.com/mohankumarbh',
      demoUrl: 'https://github.com/mohankumarbh'
    }
  };

  const modalBackdrop = document.getElementById('project-modal-backdrop');
  const modalContainer = document.getElementById('project-modal-content');
  const modalClose = document.getElementById('modal-close-btn');

  function openProjectModal(key) {
    const data = projectData[key];
    if (!data || !modalContainer) return;

    modalContainer.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span class="project-badge" style="margin-bottom: 12px; display: inline-block;">${data.badge}</span>
        <h2 style="font-size: 1.625rem; font-weight: 800; margin-bottom: 8px;">${data.title}</h2>
        <p style="font-size: 0.8125rem; color: var(--accent-sky); font-family: var(--font-mono);">${data.category}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 0.9375rem; margin-bottom: 8px;">System Overview</h4>
        <p style="font-size: 0.9375rem; line-height: 1.6;">${data.overview}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 0.9375rem; margin-bottom: 12px;">Architecture & Technical Design</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.875rem;">
          ${data.architecture.map(item => `
            <li style="display: flex; align-items: flex-start; gap: 10px;">
              <span style="color: var(--accent-sky);">▸</span>
              <span>${item}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 0.9375rem; margin-bottom: 12px;">Key Engineering Highlights</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;">
          ${data.metrics.map(m => `
            <div style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px;">
              <div style="font-family: var(--font-mono); font-size: 1.125rem; font-weight: 700; color: var(--accent-emerald);">${m.value}</div>
              <div style="font-size: 0.6875rem; color: var(--text-muted); text-transform: uppercase;">${m.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 0.9375rem; margin-bottom: 8px;">Source Implementation Excerpt</h4>
        <pre style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 16px; overflow-x: auto; font-size: 0.75rem; font-family: var(--font-mono); color: #38bdf8;"><code>${data.codeSnippet}</code></pre>
      </div>

      <div style="display: flex; gap: 12px; margin-top: 28px;">
        <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          Mohan's GitHub Profile
        </a>
      </div>
    `;

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      openProjectModal(projId);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ==========================================================================
     5. ANIMATED NUMERIC COUNTERS FOR METRICS
     ========================================================================== */
  const metricValues = document.querySelectorAll('.metric-number[data-target]');
  let counted = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        metricValues.forEach(el => {
          const target = parseFloat(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const isDecimal = target % 1 !== 0;
          let current = 0;
          const step = target / 35;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = (isDecimal ? current.toFixed(2) : Math.floor(current)) + suffix;
          }, 25);
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsStrip = document.querySelector('.metrics-strip');
  if (metricsStrip) countObserver.observe(metricsStrip);

  /* ==========================================================================
     6. SECURE CONTACT FORM HANDLER (GOOGLE SHEETS & EMAIL NOTIFICATIONS)
     ========================================================================== */
  // Paste your deployed Google Apps Script Web App URL below (see GOOGLE_SHEETS_SETUP.md)
  const GOOGLE_APPS_SCRIPT_URL = '';

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('btn-submit-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check honeypot anti-spam trap
      if (window.SecurityGuard && window.SecurityGuard.isHoneypotTriggered(contactForm)) {
        console.warn('Bot detected by honeypot.');
        showToast('Message processed.');
        contactForm.reset();
        return;
      }

      // Check client-side rate limit
      if (window.SecurityGuard) {
        const rateCheck = window.SecurityGuard.checkRateLimit('contact_submit', 45);
        if (!rateCheck.allowed) {
          formStatus.className = 'form-status error';
          formStatus.textContent = rateCheck.message;
          return;
        }
      }

      // Collect and sanitize inputs
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      const name = window.SecurityGuard ? window.SecurityGuard.sanitizeInput(nameInput.value) : nameInput.value;
      const email = emailInput.value.trim();
      const subject = window.SecurityGuard ? window.SecurityGuard.sanitizeInput(subjectInput.value) : subjectInput.value;
      const message = window.SecurityGuard ? window.SecurityGuard.sanitizeInput(messageInput.value) : messageInput.value;

      // Validation
      if (!name || !email || !message) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please fill out all required fields.';
        return;
      }

      if (window.SecurityGuard && !window.SecurityGuard.isValidEmail(email)) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please provide a valid email address.';
        return;
      }

      const mailtoLink = `mailto:mohankumarbh007@gmail.com?subject=${encodeURIComponent('[Portfolio Inquiry] ' + subject)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

      // Set button to loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span>Sending Inquiry...</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
          </svg>
        `;
      }

      // If Google Apps Script Web App URL is configured, send directly to Google Sheets & Gmail
      if (GOOGLE_APPS_SCRIPT_URL && GOOGLE_APPS_SCRIPT_URL.startsWith('https://script.google.com')) {
        formStatus.className = 'form-status';
        formStatus.style.display = 'block';
        formStatus.textContent = 'Saving to Google Sheet and notifying Mohan Kumar B.H...';

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('subject', subject);
        formData.append('message', message);
        formData.append('timestamp', new Date().toISOString());

        fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          body: formData,
          mode: 'no-cors' // Google Apps Script handles 302 redirects seamlessly
        })
        .then(() => {
          formStatus.className = 'form-status success';
          formStatus.innerHTML = `
            <strong>Thank you, ${name}!</strong><br>
            Your inquiry has been successfully saved to Google Sheets and an alert was sent to <strong>mohankumarbh007@gmail.com</strong>.
          `;
          showToast('Inquiry delivered & stored in Google Sheet!');
          contactForm.reset();
        })
        .catch((err) => {
          console.error('Submission error:', err);
          formStatus.className = 'form-status error';
          formStatus.innerHTML = `Could not reach Google Apps Script. Opening default mail client as fallback...`;
          setTimeout(() => {
            window.location.href = mailtoLink;
          }, 800);
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
          }
        });

      } else {
        // Fallback when Web App URL is not yet pasted in main.js
        formStatus.className = 'form-status success';
        formStatus.innerHTML = `
          <strong>Message ready!</strong><br>
          Opening default mail client to reach Mohan Kumar B.H (<a href="${mailtoLink}" style="text-decoration: underline; color: inherit;">click here if not launched</a>).<br>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Tip: To store messages directly in Google Sheets, follow <code>GOOGLE_SHEETS_SETUP.md</code>.</span>
        `;
        showToast('Dispatching inquiry to Mohan Kumar B.H...');
        setTimeout(() => {
          window.location.href = mailtoLink;
          contactForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
          }
        }, 1200);
      }
    });
  }

  /* ==========================================================================
     7. INTERACTIVE CLI TERMINAL (MOHAN'S REAL RESUME DETAILS)
     ========================================================================== */
  const cliModal = document.getElementById('cli-modal');
  const cliToggle = document.getElementById('cli-toggle-btn');
  const cliClose = document.getElementById('cli-close');
  const cliInput = document.getElementById('cli-input');
  const cliBody = document.getElementById('cli-body');

  const cliCommands = {
    help: `Available commands:
  - about       : Engineering background & AI focus
  - education   : College, degree, coursework, and CGPA
  - experience  : Digitaltransols AI internship details
  - skills      : Programming languages, ML libraries & tools
  - projects    : Engineered systems (Intelli-Eye, Gemini Engine, Music Rec)
  - contact     : Phone, email, LinkedIn, and GitHub
  - theme       : Toggle dark/light theme
  - clear       : Clear terminal screen`,
    about: `Mohan Kumar B.H | AI & Machine Learning Engineer
Graduate in Computer Science & Engineering (AIML) from Sai Vidya Institute of Technology (CGPA: 8.82).
Currently AI Intern at Digitaltransols AI Private Limited, Bangalore.
Passionate about LLMs, RAG, Multimodal Gemini 2.0, YOLOv8 vision, and scalable ML systems.`,
    education: `[EDUCATION]
Bachelor of Technology in Computer Science and Engineering (AIML)
Institution : Sai Vidya Institute of Technology, Rajanukunte (2022 - 2026)
CGPA        : 8.82 / 10.0 (First Class with Distinction)
Coursework  : Machine Learning, Deep Learning, Big Data, Cryptography & Network Security, NLP, DSA, DBMS, OS`,
    experience: `[EXPERIENCE]
Role    : AI Intern (Feb 2026 – May 2026)
Company : DIGITALTRANSOLS AI PRIVATE LIMITED, Bangalore
- Developed a real-time, bilingual (Kannada/English) AI Interview Engine with FastAPI, Next.js, and Gemini 2.0 Flash.
- Engineered a concurrent automated bulk-recruitment pipeline using Telegram to parse CSVs and orchestrate interviews.`,
    skills: `[TECHNICAL SKILLS]
Languages  : Python (Proficient), SQL, C/C++, React
Core CS    : Data Structures & Algorithms, OOPs, OS, DBMS, Computer Networks
Frameworks : Django, Flask, FastAPI, REST APIs, OpenCV, Next.js
ML/AI      : LLMs, NLP, RAG systems, PyTorch, Pandas, NumPy, Scikit-learn, Matplotlib
Cloud/Tools: Git, AWS (Lambda, S3)`,
    projects: `[FEATURED PROJECTS]
1. Intelli-Eye             : GPU-accelerated YOLOv8 Surveillance + Audio Anomaly Detection (Screams, Glass Breaking)
2. AI Interview Engine     : Real-time Bilingual (Kannada/English) Gemini 2.0 Flash Multimodal Interview Platform
3. Music Recommender System: Spotify API Recommender with K-Means, PCA, t-SNE, and Cosine Similarity`,
    contact: `[DIRECT CONTACT]
Name     : Mohan Kumar B.H
Phone    : +91 9980507072
Email    : mohankumarbh007@gmail.com
LinkedIn : linkedin.com/in/mohankumarbh
GitHub   : github.com/mohankumarbh
Location : Bangalore, Karnataka, India`,
    theme: () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('mohan_theme', next);
      return `Theme switched to ${next} mode.`;
    },
    clear: () => {
      if (cliBody) {
        cliBody.innerHTML = '';
        return null;
      }
    }
  };

  if (cliToggle && cliModal) {
    cliToggle.addEventListener('click', () => {
      cliModal.classList.toggle('open');
      if (cliModal.classList.contains('open') && cliInput) {
        cliInput.focus();
      }
    });

    if (cliClose) {
      cliClose.addEventListener('click', () => cliModal.classList.remove('open'));
    }

    if (cliInput) {
      cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = cliInput.value.trim().toLowerCase();
          cliInput.value = '';

          // Add user input line
          const userLine = document.createElement('div');
          userLine.style.color = '#38bdf8';
          userLine.textContent = `mohan@portfolio:~$ ${val}`;
          cliBody.appendChild(userLine);

          let outputText = '';
          if (val === '') {
            outputText = '';
          } else if (cliCommands[val]) {
            if (typeof cliCommands[val] === 'function') {
              outputText = cliCommands[val]();
            } else {
              outputText = cliCommands[val];
            }
          } else {
            outputText = `Command not recognized: '${val}'. Type 'help' for available commands.`;
          }

          if (outputText !== null && outputText !== '') {
            const outLine = document.createElement('div');
            outLine.className = 'cli-output';
            outLine.textContent = outputText;
            cliBody.appendChild(outLine);
          }

          cliBody.scrollTop = cliBody.scrollHeight;
        }
      });
    }
  }

  /* ==========================================================================
     8. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span style="color: var(--accent-sky);">✦</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  window.showToast = showToast;
});
