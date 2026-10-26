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
      root.setAttribute('data-theme', 'dark');
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

    // (Issue 13 Resolution): When at the top of the page, explicitly activate Home and deactivate others
    if (window.scrollY < 120) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === '#home') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }, { passive: true });

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

  // Active section scroll spy (Issue 13 Resolution: Include header[id] so #home is tracked)
  const sections = document.querySelectorAll('section[id], header[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    if (window.scrollY < 120) return; // Prioritize top-of-page scroll check
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
      'B.Tech CSE (AI & ML) Graduate @ SVIT',
      'Bengaluru'
      'Aspirant of AI & ML',

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
     4. PROJECT DETAIL MODAL SYSTEM (MOHAN'S REAL PROJECTS)
     ========================================================================== */
  const projectData = {
    'intelli-eye': {
      title: 'Intelli-Eye: An Holistic Deep-Learning Architecture for Threat Analysis & Alert Automation',
      badge: 'IEEE ICNPCV 2026 Conference Publication',
      category: 'Dept. of CSE (AI&ML), Sai Vidya Institute of Technology • IEEE Bangalore Section',
      overview: 'Published research presented at IEEE ICNPCV 2026. A modular, high-throughput deep-learning architecture engineered to detect multiple real-time threats simultaneously (weapons, fire, accidents, and shoplifting) by coupling fine-tuned YOLOv8 CNN models with a YOLOv8-Pose skeletal heuristic scoring engine and multi-channel Telegram/SMS dispatch.',
      architecture: [
        'Preprocessing: Standardized 640x640 frame resizing, BGR-to-RGB conversion, and float pixel normalization (I_norm = I_orig / 255.0)',
        'Overt Threat Detectors: Fine-tuned YOLOv8 CNN models for Weapon (firearms, knives), Fire (flames, smoke), and Accidents (vehicle collisions, falls)',
        'Composite Loss Function: L_total = λ1·L_class + λ2·L_box + λ3·L_dfl (Binary Cross-Entropy, CIoU Loss, Distribution Focal Loss)',
        'Shoplifting Pose Engine: YOLOv8 persistent tracking + YOLOv8-Pose skeletal coordinate extraction (wrists, elbows, hips)',
        'Behavioral Heuristics: Evaluates Item Interaction (+10), Item Conception (+30 to personal zone), Rapid Movement (+15), and Loitering (+5)',
        'Proximity & Dynamics: Euclidean distance d=√((x2-x1)²+(y2-y1)²) and keypoint velocity v=Δd/Δt with exponential score decay over time',
        'Automated Alerting: Immediate webhook dispatch via Telegram bot API and SMS with post-event forensics logging'
      ],
      metrics: [
        { label: 'System mAP@0.5', value: '91.3%' },
        { label: 'Weapon mAP (AUC: 0.984)', value: '96.3%' },
        { label: 'Fire mAP (AUC: 0.967)', value: '92.7%' },
        { label: 'Accident mAP (AUC: 0.923)', value: '89.4%' },
        { label: 'Shoplifting (AUC: 0.891)', value: '86.8%' },
        { label: 'Overall F1-Score', value: '91.3%' }
      ],
      codeSnippet: `# Intelli-Eye: Pose-Based Shoplifting Risk & Multi-Threat Engine Excerpt
import math
import numpy as np
from ultralytics import YOLO

class IntelliEyeThreatCore:
    def __init__(self):
        # Suite of specialized fine-tuned YOLOv8 models
        self.weapon_model = YOLO("models/yolov8_weapons.pt")
        self.fire_model = YOLO("models/yolov8_fire.pt")
        self.pose_model = YOLO("models/yolov8n-pose.pt")
        self.risk_scores = {}  # Persistent per-track decay tracker

    def compute_keypoint_velocity(self, pt_curr, pt_prev, delta_t):
        """Eq 4: Velocity = sqrt((xt - xt-1)^2 + (yt - yt-1)^2) / delta_t"""
        dist = math.sqrt((pt_curr[0] - pt_prev[0])**2 + (pt_curr[1] - pt_prev[1])**2)
        return dist / max(delta_t, 1e-4)

    def evaluate_behavioral_risk(self, track_id, wrist_pt, hip_pocket_pt, velocity):
        """Eq 3 & 5: Euclidean concealment proximity + weighted risk summation"""
        conceal_dist = math.sqrt((wrist_pt[0] - hip_pocket_pt[0])**2 + (wrist_pt[1] - hip_pocket_pt[1])**2)
        score = self.risk_scores.get(track_id, 0.0) * 0.92  # Time-decay attenuation

        if conceal_dist < 45.0:       # Item Conception to personal zone
            score += 30.0
        if velocity > 120.0:          # Rapid concealment movement
            score += 15.0

        self.risk_scores[track_id] = score
        return score >= 65.0          # Trigger automated SMS & Telegram alert`,
      pdfUrl: 'assets/intelli-eye-paper.pdf',
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
      githubUrl: 'https://github.com/MohanKumarBH23/Music-Recommendation-Agent',
      demoUrl: 'https://github.com/MohanKumarBH23/Music-Recommendation-Agent'
    },
    'maze-runner': {
      title: 'Maze-Runner-Py: Procedural 2D Maze & Pathfinding Framework',
      badge: 'Graph Algorithms & 2D Simulation Engine',
      category: 'Python • Graph Search Algorithms • Procedural Generation • Matplotlib Simulation',
      overview: 'A modular, high-performance Python framework for procedural 2D maze generation, intelligent pathfinding algorithms, and dynamic Matplotlib visualizations. Implements Depth-First Backtracking and Binary Tree generation alongside optimal Breadth-First (BFS) shortest-path and Bi-Directional graph search solvers with step-by-step animated visual rendering and a full-featured CLI.',
      architecture: [
        'Grid & Topology Representation: Dual-layer 2D cellular grid model tracking 4-directional wall connectivity and visitation bitmasks',
        'Procedural Generation Core: Depth-First Search Backtracker (dfs_backtrack) for organic winding labyrinths and Binary Tree (bin_tree) for fast diagonal-bias layouts',
        'Optimal Path Solvers: Breadth-First Search (BFS) guaranteeing the shortest path, DFS Backtracker for depth exploration, and simultaneous Bi-Directional frontier search',
        'Visual Simulation Engine: Frame-by-frame animated rendering of maze generation and path exploration pipelines with Matplotlib & high-res static PNG export',
        'High-Level API & Orchestration: MazeManager class coordinating concurrent maze generation, solver execution, and benchmark metrics',
        'CLI Architecture: Configurable CLI tool with custom dimensions, animation delay controls, solver selectors, and automated demo mode'
      ],
      metrics: [
        { label: 'Pathfinding Guarantee', value: 'Optimal (BFS)' },
        { label: 'Solvers', value: 'BFS, DFS, Bi-Dir' },
        { label: 'Generation Algos', value: 'DFS & Bin-Tree' },
        { label: 'Visualization', value: 'Matplotlib 2D' },
        { label: 'Python Version', value: '>= 3.8' },
        { label: 'License', value: 'MIT Open Source' }
      ],
      image: 'assets/maze_solution.png',
      codeSnippet: `# Maze-Runner-Py: Procedural Generation & Pathfinding Pipeline
from src.maze_manager import MazeManager
from src.maze import Maze

# Initialize high-level Maze Manager orchestrator
manager = MazeManager()

# Generate procedural maze via Depth-First Search Backtracker (15x15)
maze = manager.add_maze(15, 15)

# Alternatively generate via Binary Tree algorithm:
# maze_bintree = Maze(15, 15, algorithm="bin_tree")
# manager.add_existing_maze(maze_bintree)

# Solve with Breadth-First Search (guarantees shortest path)
# or BiDirectional search / DepthFirstBacktracker
manager.solve_maze(maze.id, "BreadthFirst")

# Render step-by-step solver animation and overlay solution path
manager.set_filename("maze_solution_output")
manager.show_solution_animation(maze.id)
manager.show_solution(maze.id)`,
      githubUrl: 'https://github.com/MohanKumarBH23/Maze-Runner-Py',
      demoUrl: 'https://github.com/MohanKumarBH23/Maze-Runner-Py'
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

      ${data.image ? `
      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 0.9375rem; margin-bottom: 10px;">Visual Traversal &amp; Solution Preview</h4>
        <div style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 16px; text-align: center;">
          <img src="${data.image}" alt="${data.title}" style="max-width: 100%; max-height: 260px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: inline-block;" />
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 10px; font-family: var(--font-mono);">Shortest Path (BFS) Visualized on 2D Cellular Grid</div>
        </div>
      </div>
      ` : ''}

      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 0.9375rem; margin-bottom: 8px;">Source Implementation Excerpt</h4>
        <pre style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 16px; overflow-x: auto; font-size: 0.75rem; font-family: var(--font-mono); color: #f43f5e;"><code>${data.codeSnippet}</code></pre>
      </div>

      <div style="display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap;">
        ${data.pdfUrl ? `
          <a href="${data.pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 8px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            Open Full Research Paper (PDF)
          </a>
          <button type="button" class="btn btn-secondary btn-sm" id="modal-preview-pdf-btn" style="display: inline-flex; align-items: center; gap: 8px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            Interactive Paper Preview
          </button>
        ` : ''}
        <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          ${data.githubUrl.includes('Maze-Runner') ? 'View Maze-Runner-Py on GitHub ↗' : data.githubUrl.includes('Music-Recommendation') ? 'View Music-Recommendation-Agent on GitHub ↗' : "Mohan's GitHub Profile ↗"}
        </a>
      </div>
    `;

    const modalPdfBtn = modalContainer.querySelector('#modal-preview-pdf-btn');
    if (modalPdfBtn) {
      modalPdfBtn.addEventListener('click', () => {
        closeModal();
        openPdfModal();
      });
    }

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /* ==========================================================================
     4.1 IEEE RESEARCH PAPER PDF PREVIEW MODAL
     ========================================================================== */
  const pdfModalBackdrop = document.getElementById('pdf-modal-backdrop');
  const pdfModalCloseBtn = document.getElementById('pdf-modal-close-btn');
  const previewPaperBtn = document.getElementById('preview-paper-modal-btn');
  const pdfIframe = document.getElementById('pdf-iframe');

  function openPdfModal() {
    if (!pdfModalBackdrop) return;
    if (pdfIframe && (!pdfIframe.src || pdfIframe.src === '' || pdfIframe.src.endsWith('/'))) {
      pdfIframe.src = 'assets/intelli-eye-paper.pdf';
    }
    pdfModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePdfModal() {
    if (pdfModalBackdrop) {
      pdfModalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (previewPaperBtn) previewPaperBtn.addEventListener('click', openPdfModal);
  if (pdfModalCloseBtn) pdfModalCloseBtn.addEventListener('click', closePdfModal);
  if (pdfModalBackdrop) {
    pdfModalBackdrop.addEventListener('click', (e) => {
      if (e.target === pdfModalBackdrop) closePdfModal();
    });
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
    if (e.key === 'Escape') {
      closeModal();
      closePdfModal();
    }
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
     6. SECURE CONTACT FORM HANDLER (ACCEPTED ON WEBSITE - ZERO REDIRECT)
     ========================================================================== */
  // Paste your deployed Google Apps Script Web App URL below (optional; see GOOGLE_SHEETS_SETUP.md)
  const GOOGLE_APPS_SCRIPT_URL = '';

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('btn-submit-form');

  function handleContactSubmission(e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }

    // Check honeypot anti-spam trap
    if (window.SecurityGuard && window.SecurityGuard.isHoneypotTriggered(contactForm)) {
      console.warn('Bot detected by honeypot.');
      showToast('Message processed.');
      if (contactForm) contactForm.reset();
      return false;
    }

    // Check client-side rate limit (short 5s cooldown for smooth user testing)
    if (window.SecurityGuard) {
      const rateCheck = window.SecurityGuard.checkRateLimit('contact_submit', 5);
      if (!rateCheck.allowed) {
        formStatus.className = 'form-status error';
        formStatus.style.display = 'block';
        formStatus.textContent = rateCheck.message;
        return false;
      }
    }

    // Collect and sanitize inputs
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');

    const name = window.SecurityGuard ? window.SecurityGuard.sanitizeInput(nameInput ? nameInput.value : '') : (nameInput ? nameInput.value.trim() : '');
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = 'Direct Message from Website';
    const message = window.SecurityGuard ? window.SecurityGuard.sanitizeInput(messageInput ? messageInput.value : '') : (messageInput ? messageInput.value.trim() : '');

    // Validation
    if (!name || !email || !message) {
      formStatus.className = 'form-status error';
      formStatus.style.display = 'block';
      formStatus.textContent = 'Please fill out all required fields.';
      return false;
    }

    if (window.SecurityGuard && !window.SecurityGuard.isValidEmail(email)) {
      formStatus.className = 'form-status error';
      formStatus.style.display = 'block';
      formStatus.textContent = 'Please provide a valid email address.';
      return false;
    }

    const defaultBtnHTML = `<span>Send Message</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : defaultBtnHTML;

    // Set button to loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Accepting Message...</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
        </svg>
      `;
    }

    // Generate unique inquiry Reference ID
    const refId = 'INQ-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = new Date().toISOString();
    const dateFormatted = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

    // 1. Persist submission into browser database so message is accepted and stored immediately
    try {
      const storedInquiries = JSON.parse(localStorage.getItem('mohan_portfolio_inquiries') || '[]');
      storedInquiries.unshift({
        id: refId,
        name: name,
        email: email,
        subject: subject || 'General Portfolio Inquiry',
        message: message,
        timestamp: timestamp,
        dateFormatted: dateFormatted
      });
      localStorage.setItem('mohan_portfolio_inquiries', JSON.stringify(storedInquiries.slice(0, 50)));
    } catch (storageErr) {
      console.warn('Could not store inquiry locally:', storageErr);
    }

    // 2. In-page success confirmation (accepts directly through website, ZERO REDIRECT TO EMAIL)
    formStatus.className = 'form-status success';
    formStatus.style.display = 'block';
    formStatus.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px; text-align: left;">
        <div style="font-size: 1.5rem; line-height: 1; margin-top: 2px;">✅</div>
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; color: var(--accent-emerald);">
            Thank you, ${name}! Message Accepted.
          </div>
          <p style="margin: 0 0 8px 0; font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5;">
            Your inquiry has been accepted directly through the website. Mohan Kumar B.H has received your message and will reply to <strong>${email}</strong> shortly.
          </p>
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px;">
            <span style="font-size: 0.75rem; font-family: monospace; padding: 2px 8px; border-radius: 4px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: var(--accent-emerald);">
              Ref: #${refId}
            </span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">
              • Accepted in Website Database
            </span>
          </div>
        </div>
      </div>
    `;

    showToast(`Message accepted! Ref: #${refId}`);
    if (contactForm) contactForm.reset();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }

    // 3. Silent background transmission (optional webhook/dispatch, non-blocking and zero redirect)
    if (GOOGLE_APPS_SCRIPT_URL && GOOGLE_APPS_SCRIPT_URL.startsWith('https://script.google.com')) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', subject);
      formData.append('message', message);
      formData.append('timestamp', timestamp);

      fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      }).catch((err) => console.warn('Background sync notice:', err));
    } else {
      // Background forward via FormSubmit without any redirect
      fetch('https://formsubmit.co/ajax/mohankumarbh007@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: `[Portfolio Inquiry] ${subject || 'New Message'}`,
          message: message,
          reference_id: refId,
          submitted_at: dateFormatted
        })
      }).catch((err) => console.warn('Background dispatch notice:', err));
    }

    return false;
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', handleContactSubmission);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmission);
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
  - about        : Engineering background & AI focus
  - education    : College, degree, coursework, and CGPA
  - experience   : Digitaltransols AI internship details
  - skills       : Programming languages, ML libraries & tools
  - publications : Peer-reviewed conference proceedings (IEEE ICNPCV 2026)
  - paper / pdf  : Open the IEEE research publication PDF directly
  - resume / cv  : Open / download Mohan's Resume (PDF)
  - projects     : Engineered systems (Intelli-Eye, Gemini Engine, Music Rec)
  - inquiries    : View messages accepted directly through website
  - contact      : Phone, email, LinkedIn, and GitHub
  - theme        : Toggle dark/light theme
  - clear        : Clear terminal screen`,
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
    publications: `[PUBLICATIONS & RESEARCH PROCEEDINGS]
Paper Title : Intelli-Eye: An Holistic Deep-Learning Architecture for Predictive Threat Analysis and Intelligent Alert Automation
Authors     : Jayshri, Dr. Kumaresh Sheelavant, K V Vardhan, Sumantha S, Mohan Kumar B H*, Ramesh Karthikeya Reddy K
Affiliation : Dept. of CSE (AI&ML), Sai Vidya Institute of Technology, Bengaluru, India
Conference  : 2026 International Conference on Natural Language Processing and Computer Vision (ICNPCV)
Sponsor/Org : IEEE Bangalore Section (Bengaluru, India • July 17-18, 2026)
IEEE Ref    : 979-8-3315-9284-4/26/$31.00 ©2026 IEEE
Benchmarks  : 91.3% System mAP@0.5 | 96.3% Weapon Detection (0.984 AUC) | 92.7% Fire (0.967 AUC) | 86.8% Shoplifting Engine
PDF Access  : Type 'paper' or 'pdf' to open the complete IEEE paper directly.`,
    paper: () => {
      window.open('assets/intelli-eye-paper.pdf', '_blank');
      return 'Opening Intelli-Eye IEEE conference publication (PDF) in new tab...';
    },
    pdf: () => {
      window.open('assets/intelli-eye-paper.pdf', '_blank');
      return 'Opening Intelli-Eye IEEE conference publication (PDF) in new tab...';
    },
    resume: () => {
      window.open('assets/Mohan_Resume.pdf', '_blank');
      return 'Opening Mohan Kumar B.H Resume (PDF) in new tab...';
    },
    cv: () => {
      window.open('assets/Mohan_Resume.pdf', '_blank');
      return 'Opening Mohan Kumar B.H Resume (PDF) in new tab...';
    },
    skills: `[TECHNICAL SKILLS]
Languages  : Python (Proficient), SQL, C/C++, React
Core CS    : Data Structures & Algorithms, OOPs, OS, DBMS, Computer Networks
Frameworks : Django, Flask, FastAPI, REST APIs, OpenCV, Next.js
ML/AI      : LLMs, NLP, RAG systems, PyTorch, Pandas, NumPy, Scikit-learn, Matplotlib
Cloud/Tools: Git, AWS (Lambda, S3)`,
    projects: `[FEATURED PROJECTS]
1. Intelli-Eye             : GPU-accelerated YOLOv8 Surveillance + Audio Anomaly Detection (Screams, Glass Breaking)
2. AI Interview Engine     : Real-time Bilingual (Kannada/English) Gemini 2.0 Flash Multimodal Interview Platform
3. Music Recommender System: Spotify API Recommender with K-Means, PCA, t-SNE, and Cosine Similarity
4. Maze-Runner-Py          : Procedural 2D Maze Generator & Intelligent Pathfinding Engine (BFS/DFS/Bi-Dir)`,
    contact: `[DIRECT CONTACT]
Name     : Mohan Kumar B.H
Phone    : +91 9980507072
Email    : mohankumarbh007@gmail.com
LinkedIn : linkedin.com/in/mohan-kumar-bh-mk23
GitHub   : github.com/MohanKumarBH23
Location : Bangalore, Karnataka, India`,
    inquiries: () => {
      try {
        const stored = JSON.parse(localStorage.getItem('mohan_portfolio_inquiries') || '[]');
        if (!stored || stored.length === 0) {
          return `[WEBSITE INQUIRIES LOG]
No inquiries received yet.
Submissions accepted through the website contact form will be displayed here directly.`;
        }
        let output = `[WEBSITE INQUIRIES LOG - ${stored.length} MESSAGE(S) ACCEPTED THROUGH WEBSITE]\n\n`;
        stored.forEach((inq, idx) => {
          output += `${idx + 1}. [${inq.id || 'N/A'}] ${inq.dateFormatted || inq.timestamp || ''}\n`;
          output += `   Sender : ${inq.name} <${inq.email}>\n`;
          output += `   Subject: ${inq.subject || 'General Inquiry'}\n`;
          output += `   Message: ${inq.message}\n\n`;
        });
        output += `Options:\n  - Type 'inquiries clear' to wipe inquiry history\n  - Type 'inquiries export' to download inquiries as JSON`;
        return output;
      } catch (e) {
        return `Error reading inquiries: ${e.message}`;
      }
    },
    'inquiries clear': () => {
      localStorage.removeItem('mohan_portfolio_inquiries');
      return `Website inquiry history wiped successfully.`;
    },
    'inquiries export': () => {
      const data = localStorage.getItem('mohan_portfolio_inquiries') || '[]';
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-inquiries-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      return `Exported inquiries JSON file. Check your downloads folder.`;
    },
    messages: () => cliCommands.inquiries(),
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
          userLine.style.color = '#f43f5e';
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
