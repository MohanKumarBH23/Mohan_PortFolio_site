/**
 * MAIN INTERACTIVITY CONTROLLER
 * Mohan | AI & Machine Learning Engineering Portfolio
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
     4. PROJECT DETAIL MODAL SYSTEM
     ========================================================================== */
  const projectData = {
    'neurovision': {
      title: 'NeuroVision-Edge: Real-Time Edge Vision with INT8 TensorRT',
      badge: 'Edge AI & Computer Vision',
      category: 'Computer Vision & Embedded ML',
      overview: 'Engineered an ultra-low latency real-time object detection and instance segmentation pipeline for constrained robotic edge devices (NVIDIA Jetson Orin Nano). Converted YOLOv11 and custom Vision Transformer backbones to TensorRT INT8 engines.',
      architecture: [
        'Model: Quantized YOLOv11 & MobileNet-V4 backbone',
        'Inference Engine: NVIDIA TensorRT 10.x with custom CUDA plugins',
        'Hardware Target: NVIDIA Jetson Orin (8GB / 15W TDP)',
        'Quantization: INT8 Calibration with Symmetric Kullback-Leibler (KL) Divergence'
      ],
      metrics: [
        { label: 'Inference Speed', value: '120 FPS (8.3ms)' },
        { label: 'Detection Accuracy', value: '94.2% mAP@50' },
        { label: 'VRAM Footprint', value: '420 MB (4x Reduction)' },
        { label: 'Energy Efficiency', value: '7.8W Average Power' }
      ],
      codeSnippet: `# TensorRT INT8 Calibration Pipeline (PyTorch to Engine)
import tensorrt as trt

def build_int8_engine(onnx_path, calib_dataset):
    logger = trt.Logger(trt.Logger.WARNING)
    builder = trt.Builder(logger)
    config = builder.create_builder_config()
    
    # Enable INT8 Quantization
    config.set_flag(trt.BuilderFlag.INT8)
    config.int8_calibrator = CustomEntropyCalibrator(calib_dataset)
    config.set_memory_pool_limit(trt.MemoryPoolType.WORKSPACE, 1 << 30)
    
    return builder.build_serialized_network(network, config)`,
      githubUrl: 'https://github.com/mohan-ai/neurovision-edge',
      demoUrl: 'https://demo.mohan-ai.dev/neurovision'
    },
    'contextrag': {
      title: 'ContextRAG Engine: Enterprise Multi-Modal Agentic Retrieval',
      badge: 'LLMs & Agentic Systems',
      category: 'GenAI & Information Retrieval',
      overview: 'Designed a high-reliability Agentic RAG architecture incorporating Hypothetical Document Embeddings (HyDE), BGE-Reranker-Large cross-encoders, and self-correcting hallucination guards for multi-tenant technical documentation.',
      architecture: [
        'Query Expansion: HyDE (Hypothetical Document Embeddings via Llama-3.1-8B)',
        'Dense Retrieval: Qdrant Vector Store with HNSW Graph Indexing',
        'Re-ranking: BGE-Reranker-Large cross-encoder (P95 < 80ms)',
        'Hallucination Guard: RAGAS automated ground truth & context faithfulness validator'
      ],
      metrics: [
        { label: 'P95 Latency', value: '420 ms' },
        { label: 'BERTScore F1', value: '0.892' },
        { label: 'Retrieval Recall@5', value: '96.4%' },
        { label: 'Hallucination Drop', value: '-82% vs Naive RAG' }
      ],
      codeSnippet: `# HyDE + Cross-Encoder Agentic Pipeline
from langchain_community.vectorstores import Qdrant
from sentence_transformers import CrossEncoder

class AgenticRAGRetriever:
    def __init__(self, vector_store, reranker_model):
        self.vs = vector_store
        self.reranker = CrossEncoder(reranker_model)

    async def retrieve(self, query: str, top_k: int = 5):
        hypothetical_doc = await self.generate_hyde(query)
        dense_candidates = self.vs.similarity_search(hypothetical_doc, k=25)
        pairs = [[query, doc.page_content] for doc in dense_candidates]
        scores = self.reranker.predict(pairs)
        ranked = sorted(zip(dense_candidates, scores), key=lambda x: x[1], reverse=True)
        return [doc for doc, _ in ranked[:top_k]]`,
      githubUrl: 'https://github.com/mohan-ai/context-rag-engine',
      demoUrl: 'https://demo.mohan-ai.dev/contextrag'
    },
    'pulsebio': {
      title: 'PulseBio-ECG AI: Self-Supervised Vision Transformer for Cardiology',
      badge: 'Biomedical AI & Transformers',
      category: 'Deep Learning & Medical Diagnosis',
      overview: 'Self-supervised masked autoencoder (MAE) pre-trained on 150,000+ 12-lead ECG signal recordings from PhysioNet. Diagnoses 16 distinct cardiac arrhythmia conditions with cardiologist-level sensitivity.',
      architecture: [
        'Model Backbone: Swin-Transformer adapted for 1D/2D multi-lead biosignals',
        'Pretraining: Masked Biosignal Modeling (MBM) with 75% patch masking',
        'Dataset: PhysioNet Challenge 2021 & PTB-XL Cardiology Benchmark',
        'Interpretability: Integrated Gradients & Attention Rollout for clinical audit'
      ],
      metrics: [
        { label: 'AUROC', value: '98.7%' },
        { label: 'Sensitivity', value: '97.2%' },
        { label: 'Inference Time', value: '18ms per 12-lead' },
        { label: 'Validation Cohort', value: '45,000 Patients' }
      ],
      codeSnippet: `# Swin-Transformer Biosignal Forward Block
import torch.nn as nn

class ECGPatchEmbed(nn.Module):
    def __init__(self, patch_size=16, in_chans=12, embed_dim=768):
        super().__init__()
        self.proj = nn.Conv1d(in_chans, embed_dim, kernel_size=patch_size, stride=patch_size)
        self.norm = nn.LayerNorm(embed_dim)

    def forward(self, x):
        # x shape: [Batch, 12, Samples]
        x = self.proj(x).transpose(1, 2)
        return self.norm(x)`,
      githubUrl: 'https://github.com/mohan-ai/pulsebio-ecg',
      demoUrl: 'https://demo.mohan-ai.dev/pulsebio'
    },
    'distributed-tune': {
      title: 'DistributedLLM-Tune: Multi-GPU QLoRA with DeepSpeed ZeRO-3',
      badge: 'MLOps & Distributed Systems',
      category: 'Distributed Training & Scaled ML',
      overview: 'Engineered an open-source distributed fine-tuning framework for 8B–70B parameter models. Employs ZeRO-3 parameter offloading, FlashAttention-2, and 4-bit NormalFloat NF4 quantization to train 70B models on commodity hardware.',
      architecture: [
        'Parallelism: DeepSpeed ZeRO-Stage 3 with CPU/NVMe Memory Offloading',
        'Quantization: BitsAndBytes 4-bit NF4 with Double Quantization',
        'Attention Kernel: FlashAttention-2 fused kernels (2.5x speedup)',
        'Orchestration: Ray Cluster with automated spot instance fault tolerance'
      ],
      metrics: [
        { label: 'VRAM Savings', value: '68% Lower VRAM' },
        { label: 'Scaling Efficiency', value: '91.4% Across 8x A100' },
        { label: 'Throughput', value: '3,850 Tokens/sec' },
        { label: 'Training Cost', value: '55% Cloud Cost Drop' }
      ],
      codeSnippet: `# DeepSpeed ZeRO-3 Config
ds_config = {
    "zero_optimization": {
        "stage": 3,
        "offload_optimizer": {"device": "cpu", "pin_memory": True},
        "offload_param": {"device": "cpu", "pin_memory": True},
        "overlap_comm": True,
        "contiguous_gradients": True
    },
    "bf16": {"enabled": True},
    "train_micro_batch_size_per_gpu": 2
}`,
      githubUrl: 'https://github.com/mohan-ai/distributed-llm-tune',
      demoUrl: 'https://github.com/mohan-ai/distributed-llm-tune'
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
        <h4 style="font-size: 0.9375rem; margin-bottom: 12px;">Production Benchmark Metrics</h4>
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
          Repository on GitHub
        </a>
        <a href="${data.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
          Live Interactive Demo ↗
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
            el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
          }, 25);
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsStrip = document.querySelector('.metrics-strip');
  if (metricsStrip) countObserver.observe(metricsStrip);

  /* ==========================================================================
     6. SECURE CONTACT FORM HANDLER
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check honeypot anti-spam trap
      if (window.SecurityGuard && window.SecurityGuard.isHoneypotTriggered(contactForm)) {
        console.warn('Bot detected by honeypot.');
        // Pretend success to confuse spam bot
        showToast('Message sent securely.');
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

      // Format payload (Direct mailto trigger or API dispatch)
      const mailtoLink = `mailto:mohan.engineering.ai@gmail.com?subject=${encodeURIComponent('[Portfolio Inquiry] ' + subject)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;

      formStatus.className = 'form-status success';
      formStatus.innerHTML = `
        <strong>Message prepared securely!</strong><br>
        Opening your default mail client... (If it doesn't open automatically, <a href="${mailtoLink}" style="text-decoration: underline; color: inherit;">click here to send</a>).
      `;

      showToast('Dispatching secure message...');

      setTimeout(() => {
        window.location.href = mailtoLink;
        contactForm.reset();
      }, 1000);
    });
  }

  /* ==========================================================================
     7. CITATION & COPY BUTTONS (Safe Clipboard)
     ========================================================================== */
  document.querySelectorAll('.copy-bibtex-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bibtex = `@article{mohan2025pulsebio,
  title={Self-Supervised Vision Transformers for Robust Electrocardiographic Arrhythmia Screening},
  author={Mohan and Research Collaborators},
  journal={arXiv preprint arXiv:2502.04918},
  year={2025}
}`;
      if (window.SecurityGuard) {
        window.SecurityGuard.copyTextSecurely(bibtex, () => {
          showToast('BibTeX citation copied to clipboard!');
        });
      }
    });
  });

  /* ==========================================================================
     8. INTERACTIVE CLI TERMINAL (Easter Egg for Engineers & Recruiters)
     ========================================================================== */
  const cliModal = document.getElementById('cli-modal');
  const cliToggle = document.getElementById('cli-toggle-btn');
  const cliClose = document.getElementById('cli-close');
  const cliInput = document.getElementById('cli-input');
  const cliBody = document.getElementById('cli-body');

  const cliCommands = {
    help: `Available commands:
  - about       : Brief engineering background
  - skills      : Technical competencies & frameworks
  - projects    : Core research & deployment highlights
  - stats       : Benchmarks and model inference statistics
  - contact     : Reach out directly for opportunities
  - theme       : Toggle dark/light theme
  - clear       : Clear terminal screen`,
    about: `Mohan | AI & Machine Learning Engineer
Graduate Computer Science & AI Engineer passionate about edge computer vision, large language model inference architectures, and distributed systems.`,
    skills: `Frameworks: PyTorch, TensorFlow, Hugging Face, TensorRT, JAX
Languages : Python (Expert), C++, SQL, Bash, CUDA C
MLOps     : Docker, Kubernetes, MLflow, Weights & Biases, DeepSpeed
Data/GenAI: LangChain, Qdrant, ChromaDB, Polars, Scikit-Learn`,
    projects: `1. NeuroVision-Edge   - 120 FPS INT8 Edge Detection
2. ContextRAG Engine   - Agentic RAG with HyDE & Cross-Encoders
3. PulseBio-ECG AI     - 98.7% AUROC Self-Supervised Vision Transformer
4. DistributedLLM-Tune - Multi-GPU DeepSpeed ZeRO-3 QLoRA Framework`,
    stats: `[Model Benchmarks]
- TensorRT Latency   : 8.3 ms @ Jetson Orin Nano
- Cross-Encoder P95  : 420 ms
- VRAM Savings       : 68% with ZeRO-3 + FlashAttention-2
- Model Precision    : 94.2% mAP / 98.7% AUROC`,
    contact: `Email    : mohan.engineering.ai@gmail.com
LinkedIn : linkedin.com/in/mohan-ai
GitHub   : github.com/mohan-ai
Kaggle   : kaggle.com/mohan-ml`,
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

          // Add user input line to body
          const userLine = document.createElement('div');
          userLine.style.color = '#38bdf8';
          userLine.textContent = `visitor@mohan-ai:~$ ${val}`;
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
     9. TOAST NOTIFICATION UTILITY
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
