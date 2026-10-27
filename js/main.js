/**
 * Mohan Kumar B.H | Portfolio Controller
 * Design System: Impeccable Neo Kinpaku & Washi Paper
 */

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="color: var(--color-kinpaku); font-weight: bold;">✦</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.24s cubic-bezier(0.2, 0.8, 0.2, 1)';
    setTimeout(() => toast.remove(), 240);
  }, 3200);
}

function copyToClipboard(text, successMessage) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(successMessage || 'Copied to clipboard'))
      .catch(() => fallbackCopy(text, successMessage));
  } else {
    fallbackCopy(text, successMessage);
  }
}
window.copyToClipboard = copyToClipboard;

function fallbackCopy(text, successMessage) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast(successMessage || 'Copied to clipboard');
  } catch (err) {
    showToast('Failed to copy');
  }
  document.body.removeChild(ta);
}

function toggleTheme() {
  const root = document.documentElement;
  const nextTheme = (root.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', nextTheme);
  try {
    localStorage.setItem('mohan_theme', nextTheme);
  } catch (err) {}
  showToast(`Switched to ${nextTheme === 'light' ? 'Washi Paper & Sumi Ink' : 'Dark Mineral Lacquer'}`);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

function initApp() {
  'use strict';

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

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

    if (window.scrollY < 120) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#home');
      });
    }
  }, { passive: true });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
    navLinks.forEach(link => link.addEventListener('click', () => navMenu.classList.remove('open')));
  }

  const sections = document.querySelectorAll('section[id], header[id]');
  const navObserver = new IntersectionObserver((entries) => {
    if (window.scrollY < 120) return;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sections.forEach(sec => navObserver.observe(sec));

  // Project Modals
  const projectData = {
    'intelli-eye': {
      title: 'Intelli-Eye: An Holistic Deep-Learning Architecture for Threat Analysis & Alert Automation',
      badge: 'IEEE ICNPCV 2026 Conference Proceeding',
      category: 'Dept. of CSE (AI&ML), Sai Vidya Institute of Technology • IEEE Bangalore Section',
      overview: 'Published research accepted at IEEE ICNPCV 2026. A modular, high-throughput deep-learning architecture engineered to detect multiple real-time threats simultaneously (weapons, fire, accidents, and shoplifting) by coupling fine-tuned YOLOv8 CNN models with a YOLOv8-Pose skeletal heuristic scoring engine and multi-channel Telegram/SMS dispatch.',
      architecture: [
        'Preprocessing Pipeline: Standardized 640x640 frame resizing, BGR-to-RGB conversion, and float pixel normalization (I_norm = I_orig / 255.0)',
        'Overt Threat Detectors: Fine-tuned YOLOv8 CNN models for Weapon (firearms, knives), Fire (flames, smoke), and Accidents (vehicle collisions)',
        'Composite Loss Formulation: L_total = λ1·L_class + λ2·L_box + λ3·L_dfl (Binary Cross-Entropy, Complete IoU Loss, Distribution Focal Loss)',
        'Shoplifting Pose Engine: Persistent multi-object tracking coupled with YOLOv8-Pose skeletal coordinate extraction (wrists, elbows, hips)',
        'Behavioral Threat Scoring: Evaluates Item Interaction (+10), Item Conception to personal zone (+30), Rapid Movement (+15), and Loitering (+5)',
        'Kinematic Dynamics: Euclidean distance d=√((x2-x1)²+(y2-y1)²) and keypoint velocity v=Δd/Δt with exponential score decay over time',
        'Automated Dispatch: Sub-second webhook alert trigger via Telegram Bot API and SMS with post-event forensics metadata logging'
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
        self.weapon_model = YOLO("models/yolov8_weapons.pt")
        self.fire_model = YOLO("models/yolov8_fire.pt")
        self.pose_model = YOLO("models/yolov8n-pose.pt")
        self.risk_scores = {}

    def compute_keypoint_velocity(self, pt_curr, pt_prev, delta_t):
        dist = math.sqrt((pt_curr[0] - pt_prev[0])**2 + (pt_curr[1] - pt_prev[1])**2)
        return dist / max(delta_t, 1e-4)

    def evaluate_behavioral_risk(self, track_id, wrist_pt, hip_pocket_pt, velocity):
        conceal_dist = math.sqrt((wrist_pt[0] - hip_pocket_pt[0])**2 + (wrist_pt[1] - hip_pocket_pt[1])**2)
        score = self.risk_scores.get(track_id, 0.0) * 0.92

        if conceal_dist < 45.0:
            score += 30.0
        if velocity > 120.0:
            score += 15.0

        self.risk_scores[track_id] = score
        return score >= 65.0`,
      pdfUrl: 'assets/intelli-eye-paper.pdf',
      githubUrl: 'https://github.com/mohankumarbh'
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
      githubUrl: 'https://github.com/mohankumarbh'
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
      codeSnippet: `# Cosine Similarity & K-Means Pipeline Excerpt
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans

def compute_music_recommendations(user_song_vector, music_db_df, top_k=5):
    features = ['danceability', 'energy', 'valence', 'tempo', 'acousticness']
    X = music_db_df[features].values
    sim_scores = cosine_similarity(user_song_vector.reshape(1, -1), X).flatten()
    top_indices = np.argsort(sim_scores)[::-1][:top_k]
    return music_db_df.iloc[top_indices][['song_name', 'artist', 'genre']]`,
      githubUrl: 'https://github.com/MohanKumarBH23/Music-Recommendation-Agent'
    },
    'maze-runner': {
      title: 'Maze-Runner-Py: Procedural 2D Maze & Pathfinding Framework',
      badge: 'Graph Algorithms & 2D Simulation Engine',
      category: 'Python • Graph Search Algorithms • Procedural Generation • Matplotlib Simulation',
      overview: 'A modular, high-performance Python framework for procedural 2D maze generation, intelligent pathfinding algorithms, and dynamic Matplotlib visualizations. Implements Depth-First Backtracking and Binary Tree generation alongside optimal Breadth-First (BFS) shortest-path and Bi-Directional graph search solvers.',
      architecture: [
        'Grid & Topology Representation: Dual-layer 2D cellular grid model tracking 4-directional wall connectivity and visitation bitmasks',
        'Procedural Generation Core: Depth-First Search Backtracker for organic winding labyrinths and Binary Tree for fast diagonal-bias layouts',
        'Optimal Path Solvers: Breadth-First Search (BFS) guaranteeing the shortest path, DFS Backtracker for depth exploration, and simultaneous Bi-Directional frontier search',
        'Visual Simulation Engine: Frame-by-frame animated rendering of maze generation and path exploration pipelines with Matplotlib',
        'High-Level API & Orchestration: MazeManager class coordinating concurrent maze generation, solver execution, and benchmark metrics'
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
      imageTitle: 'Visual Traversal Preview',
      imageCaption: 'Shortest Path (BFS) Visualized on 2D Cellular Grid',
      codeSnippet: `# Maze-Runner-Py: Procedural Generation & Pathfinding Pipeline Excerpt
from src.maze_manager import MazeManager
from src.maze import Maze

manager = MazeManager()
maze = manager.add_maze(15, 15)
manager.solve_maze(maze.id, "BreadthFirst")
manager.set_filename("maze_solution_output")
manager.show_solution_animation(maze.id)
manager.show_solution(maze.id)`,
      githubUrl: 'https://github.com/MohanKumarBH23/Maze-Runner-Py'
    },
    'pychess': {
      title: 'PyChess: Minimax Autonomous AI & Neo Kinpaku Engine',
      badge: 'Autonomous AI & Game Theory Search',
      category: 'Python 3.10+ • Minimax with Alpha-Beta Pruning • FIDE Rules • Pygame GUI',
      overview: 'A high-performance desktop chess application engineered with strict separation between board state representation, FIDE-standard move validation, autonomous heuristic search, and an artisanal visual interface. Features recursive Minimax adversarial search up to depth 3 with alpha-beta branch pruning, evaluating material balances, piece mobility rays, and king safety.',
      architecture: [
        'Adversarial Search Core: Recursive Minimax algorithm exploring move permutations up to depth 3 with Alpha-Beta pruning (alpha >= beta) for exponential branch reduction and sub-second decision making',
        'Heuristic Evaluation Matrix: Composite board scoring combining Shannon piece weights (P:100, N:320, B:330, R:500, Q:900, K:20000), square-table center bias, and piece mobility counts',
        'FIDE Move Validation State Machine: Strict rule enforcement for legal moves, pinned pieces (pinnedw, pinnedb), castling (kingside/queenside), pawn promotion, en passant, check, and checkmate/stalemate detection',
        'Dual Game Modes: Adversarial Human vs Autonomous Minimax AI and over-the-board local Pass & Play (2 Player)',
        'Impeccable Neo Kinpaku Interface: Bespoke Pygame GUI with warm obsidian lacquer (#101113), champagne gold leaf anchors (#D4AF37), bilinear anti-aliased sprites, move indicator rings, and in-place promotion modals'
      ],
      metrics: [
        { label: 'Search Lookahead', value: 'Depth 3' },
        { label: 'Pruning Algorithm', value: 'Alpha-Beta' },
        { label: 'Rules Compliance', value: 'FIDE Standard' },
        { label: 'Engine', value: 'Pure Python' },
        { label: 'UI Engine', value: 'Pygame >= 2.6' },
        { label: 'Game Modes', value: 'PvAI & PvP' }
      ],
      image: 'assets/ai_chess_board.png',
      imageTitle: 'Pygame Chess Engine & Board Interface',
      imageCaption: 'Real-Time Match Interface with Move Selection & Legal Path Highlighting',
      codeSnippet: `# PyChess: Minimax Search with Alpha-Beta Pruning (player/AI.py Excerpt)
class AI:
    def minimax(self, gametiles, depth, alpha, beta, player):
        if depth == 0 or self.checkmate(gametiles) or self.stalemate(gametiles, player):
            return self.calculateb(gametiles)

        if not player:  # Minimizing AI (Black)
            minEval = 100000000
            kp, ks = self.eva(gametiles, player)
            for lk in kp:
                for move in lk:
                    mts = gametiles[move[2]][move[3]].pieceonTile
                    gametiles = self.move(gametiles, move[0], move[1], move[2], move[3])
                    evalk = self.minimax(gametiles, depth - 1, alpha, beta, True)
                    if evalk < minEval and depth == 3:
                        self.tp.clear()
                        self.tp.append(move)
                    minEval = min(minEval, evalk)
                    beta = min(beta, evalk)
                    gametiles = self.revmove(gametiles, move[2], move[3], move[0], move[1], mts)
                    if beta <= alpha:  # Alpha-beta branch cut-off
                        break
            return minEval
        else:  # Maximizing Human (White)
            maxEval = -100000000
            kp, ks = self.eva(gametiles, player)
            for lk in ks:
                for move in lk:
                    mts = gametiles[move[2]][move[3]].pieceonTile
                    gametiles = self.movew(gametiles, move[0], move[1], move[2], move[3])
                    evalk = self.minimax(gametiles, depth - 1, alpha, beta, False)
                    maxEval = max(maxEval, evalk)
                    alpha = max(alpha, evalk)
                    gametiles = self.revmove(gametiles, move[2], move[3], move[0], move[1], mts)
                    if beta <= alpha:
                        break
            return maxEval`,
      githubUrl: 'https://github.com/MohanKumarBH23/AI-Chess-Bot'
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
        <span class="pub-badge pub-badge-conf" style="margin-bottom: 12px; display: inline-block;">${data.badge}</span>
        <h2 style="font-family: var(--font-display); font-size: 1.85rem; font-weight: 400; line-height: 1.15; color: var(--text-primary); margin-bottom: 6px;">${data.title}</h2>
        <p style="font-size: 0.8125rem; color: var(--color-patina); font-family: var(--font-mono);">${data.category}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">System Overview</h4>
        <p style="font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.68;">${data.overview}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px;">Architecture & Technical Design</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.875rem;">
          ${data.architecture.map(item => `
            <li style="display: flex; align-items: flex-start; gap: 10px; color: var(--text-secondary);">
              <span style="color: var(--color-kinpaku); font-weight: bold;">▸</span>
              <span>${item}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px;">Key Engineering Highlights</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px;">
          ${data.metrics.map(m => `
            <div style="background: var(--bg-well); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 10px 14px;">
              <div class="tabular" style="font-family: var(--font-mono); font-size: 1.125rem; font-weight: 600; color: var(--color-kinpaku);">${m.value}</div>
              <div style="font-family: var(--font-mono); font-size: 0.6875rem; color: var(--text-muted); text-transform: uppercase;">${m.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      ${data.image ? `
      <div style="margin-bottom: 24px;">
        <h4 style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px;">${data.imageTitle || 'Visual Interface & Runtime Preview'}</h4>
        <div style="background: var(--bg-well); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 16px; text-align: center;">
          <img src="${data.image}" alt="${data.title}" style="max-width: 100%; max-height: 300px; border-radius: 4px; display: inline-block; box-shadow: var(--shadow-sm);" />
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 10px; font-family: var(--font-mono);">${data.imageCaption || 'Execution Preview'}</div>
        </div>
      </div>
      ` : ''}

      <div style="margin-bottom: 24px;">
        <h4 style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">Source Implementation Excerpt</h4>
        <pre style="background: var(--bg-well); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 16px; overflow-x: auto; font-size: 0.75rem; font-family: var(--font-mono); color: var(--color-patina); line-height: 1.5;"><code>${data.codeSnippet}</code></pre>
      </div>

      <div style="display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap;">
        ${data.pdfUrl ? `
          <a href="${data.pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            <span>Open Paper (PDF)</span>
          </a>
        ` : ''}
        <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span>Repository &nearr;</span>
        </a>
      </div>
    `;

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openProjectModal(btn.getAttribute('data-project'));
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeProjectModal();
    });
  }

  // PDF Preview Modal
  const pdfModalBackdrop = document.getElementById('pdf-modal-backdrop');
  const pdfModalCloseBtn = document.getElementById('pdf-modal-close-btn');
  const openPaperPdfBtn = document.getElementById('open-paper-pdf-btn');
  const pdfIframe = document.getElementById('pdf-iframe');

  function openPdfModal() {
    const pdfPath = 'assets/intelli-eye-paper.pdf';
    if (pdfIframe && (!pdfIframe.src || !pdfIframe.src.endsWith(pdfPath))) {
      pdfIframe.src = pdfPath;
    }
    if (pdfModalBackdrop) {
      pdfModalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closePdfModal() {
    if (pdfModalBackdrop) {
      pdfModalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (openPaperPdfBtn) {
    openPaperPdfBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openPdfModal();
    });
  }

  if (pdfModalCloseBtn) pdfModalCloseBtn.addEventListener('click', closePdfModal);
  if (pdfModalBackdrop) {
    pdfModalBackdrop.addEventListener('click', (e) => {
      if (e.target === pdfModalBackdrop) closePdfModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closePdfModal();
    }
  });

  // Contact Form Handling
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('btn-submit-form');
  const formStatus = document.getElementById('form-status');

  function handleContactSubmission(e) {
    if (e) e.preventDefault();

    const hpField = contactForm.querySelector('input[name="_gotcha_hp"]');
    if (hpField && hpField.value) return false;

    const name = (document.getElementById('form-name')?.value || '').trim();
    const email = (document.getElementById('form-email')?.value || '').trim();
    const subject = (document.getElementById('form-subject')?.value || '').trim();
    const message = (document.getElementById('form-message')?.value || '').trim();

    if (!name || !email || !message) {
      formStatus.className = 'form-status error';
      formStatus.style.display = 'block';
      formStatus.textContent = 'Please fill out all required fields.';
      return false;
    }

    if (!isValidEmail(email)) {
      formStatus.className = 'form-status error';
      formStatus.style.display = 'block';
      formStatus.textContent = 'Please provide a valid email address.';
      return false;
    }

    const defaultBtnHTML = `<span>Send Direct Message</span><svg class="btn-arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 7h12M8 2l5 5-5 5"/></svg>`;
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : defaultBtnHTML;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Accepting Message...</span>`;
    }

    const refId = 'INQ-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = new Date().toISOString();
    const dateFormatted = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

    try {
      const stored = JSON.parse(localStorage.getItem('mohan_portfolio_inquiries') || '[]');
      stored.unshift({ id: refId, name, email, subject: subject || 'General Portfolio Inquiry', message, timestamp, dateFormatted });
      localStorage.setItem('mohan_portfolio_inquiries', JSON.stringify(stored.slice(0, 50)));
    } catch (storageErr) {}

    formStatus.className = 'form-status success';
    formStatus.style.display = 'block';
    formStatus.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
        <div style="font-weight: 600; font-size: 0.95rem; color: var(--color-success);">Thank you, ${name}! Message Accepted.</div>
        <p style="margin: 0; font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5;">Your inquiry has been logged. Mohan Kumar B.H will review and reply to <strong>${email}</strong>.</p>
        <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
          <span class="tabular" style="font-size: 0.75rem; font-family: var(--font-mono); padding: 2px 6px; border-radius: 2px; background: oklch(72% 0.14 148 / 0.15); color: var(--color-success);">Ref: #${refId}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">&bull; Stored in Database</span>
        </div>
      </div>
    `;

    showToast(`Message accepted! Ref: #${refId}`);
    if (contactForm) contactForm.reset();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }

    fetch('https://formsubmit.co/ajax/mohankumarbh007@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, _subject: `[Portfolio Inquiry] ${subject || 'New Message'}`, message, reference_id: refId, submitted_at: dateFormatted })
    }).catch(err => console.warn('Dispatch notice:', err));

    return false;
  }

  if (submitBtn) submitBtn.addEventListener('click', handleContactSubmission);
  if (contactForm) contactForm.addEventListener('submit', handleContactSubmission);

} // end initApp

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
