/**
 * @fileoverview Unified Portfolio Projects Catalog.
 * Serves as the single source of truth for both project overview cards and deep-dive modals.
 */

export const PROJECTS = Object.freeze([
  {
    id: 'intelli-eye',
    featured: true,
    categoryKey: 'vision',
    domainTag: 'Featured IEEE Publication • Computer Vision & Edge AI',
    cardTitle: 'Intelli-Eye: Multi-Modal Threat Detection Pipeline',
    cardSummary:
      'A GPU-accelerated multi-modal surveillance architecture that executes concurrent threat classification. Combines fine-tuned YOLOv8 bounding-box detection for weapons, fire, and vehicle collisions with a YOLOv8-Pose skeletal tracking engine that calculates Euclidean keypoint velocity for shoplifting heuristics.',
    cardTags: [
      'Python',
      'YOLOv8 & YOLO-Pose',
      'OpenCV',
      'Edge AI',
      'Telegram Webhooks',
      'CIoU Loss'
    ],
    cardMeta: 'mAP: 91.3% • 2026',
    ctaLabel: 'View Architecture & Formulas',
    pipelineDiagram: {
      title: 'SYSTEM PIPELINE',
      telemetry: 'LATENCY: 14.2ms',
      nodes: [
        { step: '01. Input Normalization', detail: '640x640 RGB', accent: false },
        { step: '02. YOLOv8 Threat Engine', detail: 'Weapons • Fire', accent: true },
        { step: '03. YOLO-Pose Heuristic', detail: 'Δd/Δt Velocity', accent: true },
        { step: '04. Automated Dispatch', detail: 'Telegram & SMS', accent: false }
      ]
    },
    modal: {
      title:
        'Intelli-Eye: A Holistic Deep-Learning Architecture for Threat Analysis & Alert Automation',
      badge: 'IEEE ICNPCV 2026 Conference Proceeding',
      category: 'Dept. of CSE (AI&ML), Sai Vidya Institute of Technology • IEEE Bangalore Section',
      overview:
        'Published research accepted at IEEE ICNPCV 2026. A modular, high-throughput deep-learning architecture engineered to detect multiple real-time threats simultaneously (weapons, fire, accidents, and shoplifting) by coupling fine-tuned YOLOv8 CNN models with a YOLOv8-Pose skeletal heuristic scoring engine and multi-channel Telegram/SMS dispatch.',
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
      pdfUrl: 'assets/documents/intelli-eye-paper.pdf',
      githubUrl: 'https://github.com/MohanKumarBH23'
    }
  },
  {
    id: 'ai-interview',
    featured: false,
    categoryKey: 'llm',
    domainTag: 'Multimodal AI • LLMs',
    cardTitle: 'AI Interview Engine (Gemini 2.0 Flash)',
    cardSummary:
      'Real-time bilingual platform (Kannada/English) developed at Digitaltransols AI featuring multimodal audio transcription, dynamic rubric evaluation, and automated performance reports.',
    cardTags: ['Gemini 2.0', 'FastAPI', 'Next.js', 'Audio NLP'],
    cardMeta: '2026 • Industry',
    ctaLabel: 'Case Study',
    githubUrl: 'https://github.com/MohanKumarBH23',
    modal: {
      title: 'AI Interview Engine (Gemini 2.0 Flash)',
      badge: 'Multimodal AI & LLMs',
      category: 'Digitaltransols AI Private Limited',
      overview:
        'Engineered an end-to-end bilingual (Kannada & English) conversational interview platform at Digitaltransols AI. Leverages Gemini 2.0 Flash for low-latency multimodal audio transcription, rubric evaluation, and contextual dynamic follow-ups.',
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
      githubUrl: 'https://github.com/MohanKumarBH23'
    }
  },
  {
    id: 'pychess',
    featured: false,
    categoryKey: 'ai',
    domainTag: 'Autonomous AI • Game Theory',
    cardTitle: 'PyChess: Minimax Autonomous AI & Engine',
    cardSummary:
      'Autonomous desktop chess engine driven by recursive Minimax with Alpha-Beta branch pruning (depth 3), Shannon heuristic board evaluation, and complete FIDE move validation with an artisanal Pygame GUI.',
    cardTags: [
      'Python 3.10+',
      'Minimax AI',
      'Alpha-Beta Pruning',
      'Pygame GUI',
      'FIDE Validation'
    ],
    cardMeta: '2025 • Open Source',
    ctaLabel: 'Case Study',
    githubUrl: 'https://github.com/MohanKumarBH23/AI-Chess-Bot',
    modal: {
      title: 'PyChess: Minimax Autonomous AI & Neo Kinpaku Engine',
      badge: 'Autonomous AI & Game Theory Search',
      category: 'Python 3.10+ • Minimax with Alpha-Beta Pruning • FIDE Rules • Pygame GUI',
      overview:
        'A high-performance desktop chess application engineered with strict separation between board state representation, FIDE-standard move validation, autonomous heuristic search, and an artisanal visual interface. Features recursive Minimax adversarial search up to depth 3 with alpha-beta branch pruning, evaluating material balances, piece mobility rays, and king safety.',
      architecture: [
        'Adversarial Search Core: Recursive Minimax algorithm exploring move permutations up to depth 3 with Alpha-Beta pruning (alpha >= beta) for exponential branch reduction and sub-second decision making',
        'Heuristic Evaluation Matrix: Composite board scoring combining Shannon piece weights (P:100, N:320, B:330, R:500, Q:900, K:20000), square-table center bias, and piece mobility counts',
        'FIDE Move Validation State Machine: Strict rule enforcement for legal moves, pinned pieces (pinnedw, pinnedb), castling (kingside/queenside), pawn promotion, en passant, check, and checkmate/stalemate detection',
        'Dual Game Modes: Adversarial Human vs Autonomous Minimax AI and over-the-board local Pass & Play (2 Player)',
        'Custom Pygame Interface: Obsidian lacquer board (#101113), gold leaf accents (#D4AF37), bilinear anti-aliased sprites, move indicator rings, and in-place promotion modals'
      ],
      metrics: [
        { label: 'Search Lookahead', value: 'Depth 3' },
        { label: 'Pruning Algorithm', value: 'Alpha-Beta' },
        { label: 'Rules Compliance', value: 'FIDE Standard' },
        { label: 'Engine', value: 'Pure Python' },
        { label: 'UI Engine', value: 'Pygame >= 2.6' },
        { label: 'Game Modes', value: 'PvAI & PvP' }
      ],
      image: 'assets/images/ai_chess_board.png',
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
  },
  {
    id: 'music-recommender',
    featured: false,
    categoryKey: 'ml',
    domainTag: 'ML • Unsupervised Stats',
    cardTitle: 'Music Recommendation Engine',
    cardSummary:
      'High-dimensional audio clustering engine combining Spotify API metadata, K-Means clustering, PCA reduction, and Cosine similarity metric spaces.',
    cardTags: ['Scikit-learn', 'PCA & t-SNE', 'K-Means', 'Spotify API'],
    cardMeta: '2025 • Open Source',
    ctaLabel: 'Case Study',
    githubUrl: 'https://github.com/MohanKumarBH23/Music-Recommendation-Agent',
    modal: {
      title: 'Personalized Music Recommendation System',
      badge: 'Machine Learning & Clustering',
      category: 'Data Science & Statistical Modeling',
      overview:
        'Comprehensive music recommendation system applying Collaborative Filtering, Content-Based Filtering, and K-Means clustering. Analyzes acoustic features from Spotify API with PCA and t-SNE for dimensional projection and Cosine Similarity.',
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
    }
  },
  {
    id: 'maze-runner',
    featured: false,
    categoryKey: 'algo',
    domainTag: 'Algorithms • Simulation',
    cardTitle: 'Maze Pathfinding Framework',
    cardSummary:
      'Graph traversal framework executing procedural generation (DFS Backtracking) and comparative solvers (BFS Shortest Path vs Bi-Directional Search) with animated simulation.',
    cardTags: ['Python 3.8+', 'BFS & Bi-Dir', 'DFS Backtracking', 'Matplotlib'],
    cardMeta: '2024 • Open Source',
    ctaLabel: 'Case Study',
    githubUrl: 'https://github.com/MohanKumarBH23/Maze-Runner-Py',
    modal: {
      title: 'Maze-Runner-Py: Procedural 2D Maze & Pathfinding Framework',
      badge: 'Graph Algorithms & 2D Simulation Engine',
      category: 'Python • Graph Search Algorithms • Procedural Generation • Matplotlib Simulation',
      overview:
        'A modular, high-performance Python framework for procedural 2D maze generation, intelligent pathfinding algorithms, and dynamic Matplotlib visualizations. Implements Depth-First Backtracking and Binary Tree generation alongside optimal Breadth-First (BFS) shortest-path and Bi-Directional graph search solvers.',
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
      image: 'assets/images/maze_solution.png',
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
    }
  }
]);

