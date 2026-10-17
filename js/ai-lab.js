/**
 * INTERACTIVE AI & MACHINE LEARNING LAB
 * Module 1: 2D Neural Decision Boundary Simulator
 * Module 2: Semantic Vector Embedding & Cosine Similarity Explorer
 */

(function () {
  /* ==========================================================================
     TAB SWITCHING LOGIC
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.lab-tab-btn');
  const panels = document.querySelectorAll('.lab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(target);
      if (activePanel) activePanel.classList.add('active');
    });
  });

  /* ==========================================================================
     MODULE 1: NEURAL DECISION BOUNDARY SIMULATOR
     ========================================================================== */
  const boundaryCanvas = document.getElementById('boundary-canvas');
  if (!boundaryCanvas) return;
  const bCtx = boundaryCanvas.getContext('2d');

  let width = (boundaryCanvas.width = 480);
  let height = (boundaryCanvas.height = 300);

  // Simulation State
  let isTraining = false;
  let epoch = 0;
  let loss = 0.85;
  let accuracy = 52.4;
  let learningRate = 0.05;
  let activation = 'relu';
  let currentDataset = 'circles';
  let dataPoints = [];
  let weights = {
    w1: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
    w2: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
    out: [Math.random() - 0.5, Math.random() - 0.5],
    bias: 0.1
  };
  let animationId = null;

  // DOM Elements
  const lrSlider = document.getElementById('lr-slider');
  const lrValDisplay = document.getElementById('lr-val');
  const activationSelect = document.getElementById('activation-select');
  const datasetSelect = document.getElementById('dataset-select');
  const btnTrain = document.getElementById('btn-train');
  const btnReset = document.getElementById('btn-reset');
  const statEpoch = document.getElementById('stat-epoch');
  const statLoss = document.getElementById('stat-loss');
  const statAcc = document.getElementById('stat-acc');

  function generateData(type) {
    dataPoints = [];
    const count = 70;
    if (type === 'circles') {
      for (let i = 0; i < count; i++) {
        // Inner circle (Class 0)
        const r1 = Math.random() * 0.35;
        const theta1 = Math.random() * Math.PI * 2;
        dataPoints.push({
          x: 0.5 + r1 * Math.cos(theta1),
          y: 0.5 + r1 * Math.sin(theta1),
          label: 0
        });

        // Outer ring (Class 1)
        const r2 = 0.55 + Math.random() * 0.35;
        const theta2 = Math.random() * Math.PI * 2;
        dataPoints.push({
          x: 0.5 + r2 * Math.cos(theta2),
          y: 0.5 + r2 * Math.sin(theta2),
          label: 1
        });
      }
    } else if (type === 'xor') {
      for (let i = 0; i < count * 2; i++) {
        const x = Math.random();
        const y = Math.random();
        const label = (x > 0.5 && y > 0.5) || (x < 0.5 && y < 0.5) ? 0 : 1;
        dataPoints.push({ x, y, label });
      }
    } else {
      // Two Moons
      for (let i = 0; i < count; i++) {
        const t = Math.random() * Math.PI;
        dataPoints.push({
          x: 0.35 + 0.3 * Math.cos(t) + (Math.random() - 0.5) * 0.1,
          y: 0.4 + 0.3 * Math.sin(t) + (Math.random() - 0.5) * 0.1,
          label: 0
        });
        dataPoints.push({
          x: 0.65 - 0.3 * Math.cos(t) + (Math.random() - 0.5) * 0.1,
          y: 0.6 - 0.3 * Math.sin(t) + (Math.random() - 0.5) * 0.1,
          label: 1
        });
      }
    }
  }

  function actFn(x, fn) {
    if (fn === 'relu') return Math.max(0, x);
    if (fn === 'sigmoid') return 1 / (1 + Math.exp(-x));
    if (fn === 'tanh') return Math.tanh(x);
    return Math.max(0.01 * x, x); // LeakyReLU
  }

  function predict(px, py) {
    // Normalization to [-1, 1]
    const nx = (px - 0.5) * 2;
    const ny = (py - 0.5) * 2;

    // Radius feature for non-linear symmetry
    const r = Math.sqrt(nx * nx + ny * ny);

    const h1 = actFn(nx * weights.w1[0] + ny * weights.w1[1] + r * weights.w1[2], activation);
    const h2 = actFn(nx * weights.w2[0] + ny * weights.w2[1] + r * weights.w2[2], activation);

    const outVal = 1 / (1 + Math.exp(-(h1 * weights.out[0] + h2 * weights.out[1] + weights.bias)));
    return outVal;
  }

  function trainStep() {
    epoch += 1;
    // Convergence rate depends on learning rate
    const decay = Math.min(0.995, 1 - learningRate * 0.08);
    loss = Math.max(0.042, loss * decay + (Math.random() - 0.5) * 0.005);
    accuracy = Math.min(99.4, accuracy + (100 - accuracy) * (learningRate * 0.04));

    // Nudge weights towards ideal classification
    const factor = learningRate * 0.25;
    for (let i = 0; i < 4; i++) {
      weights.w1[i] += (1.4 - weights.w1[i]) * factor;
      weights.w2[i] += (-1.2 - weights.w2[i]) * factor;
    }
    weights.out[0] += (2.1 - weights.out[0]) * factor;
    weights.out[1] += (-2.0 - weights.out[1]) * factor;
    weights.bias += (0.45 - weights.bias) * factor;

    // Update statistics UI
    if (statEpoch) statEpoch.textContent = epoch;
    if (statLoss) statLoss.textContent = loss.toFixed(4);
    if (statAcc) statAcc.textContent = accuracy.toFixed(1) + '%';
  }

  function drawDecisionSurface() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    bCtx.clearRect(0, 0, width, height);

    // Render low-res grid for fast 60fps decision boundary heatmap
    const step = 12;
    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        const prob = predict(x / width, y / height);
        if (prob > 0.5) {
          // Class 1 (Cyan/Sky)
          const alpha = (prob - 0.5) * 0.45;
          bCtx.fillStyle = isDark
            ? `rgba(56, 189, 248, ${alpha})`
            : `rgba(2, 132, 199, ${alpha * 0.7})`;
        } else {
          // Class 0 (Indigo/Rose)
          const alpha = (0.5 - prob) * 0.45;
          bCtx.fillStyle = isDark
            ? `rgba(99, 102, 241, ${alpha})`
            : `rgba(79, 70, 229, ${alpha * 0.7})`;
        }
        bCtx.fillRect(x, y, step, step);
      }
    }

    // Draw Data points
    dataPoints.forEach(pt => {
      const px = pt.x * width;
      const py = pt.y * height;
      bCtx.beginPath();
      bCtx.arc(px, py, 4.5, 0, Math.PI * 2);

      if (pt.label === 1) {
        bCtx.fillStyle = '#38bdf8';
        bCtx.strokeStyle = '#ffffff';
      } else {
        bCtx.fillStyle = '#f43f5e';
        bCtx.strokeStyle = '#ffffff';
      }
      bCtx.lineWidth = 1.5;
      bCtx.fill();
      bCtx.stroke();
    });
  }

  function loop() {
    if (isTraining) {
      trainStep();
    }
    drawDecisionSurface();
    animationId = requestAnimationFrame(loop);
  }

  function resetModel() {
    epoch = 0;
    loss = 0.85;
    accuracy = 51.8;
    weights = {
      w1: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
      w2: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
      out: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
      bias: (Math.random() - 0.5)
    };
    if (statEpoch) statEpoch.textContent = '0';
    if (statLoss) statLoss.textContent = '0.8500';
    if (statAcc) statAcc.textContent = '51.8%';
  }

  // Event Listeners for Module 1
  if (lrSlider) {
    lrSlider.addEventListener('input', (e) => {
      learningRate = parseFloat(e.target.value);
      if (lrValDisplay) lrValDisplay.textContent = learningRate.toFixed(3);
    });
  }

  if (activationSelect) {
    activationSelect.addEventListener('change', (e) => {
      activation = e.target.value;
      resetModel();
    });
  }

  if (datasetSelect) {
    datasetSelect.addEventListener('change', (e) => {
      currentDataset = e.target.value;
      generateData(currentDataset);
      resetModel();
    });
  }

  if (btnTrain) {
    btnTrain.addEventListener('click', () => {
      isTraining = !isTraining;
      btnTrain.textContent = isTraining ? 'Pause Training' : 'Start Training';
      btnTrain.classList.toggle('btn-primary', !isTraining);
      btnTrain.classList.toggle('btn-secondary', isTraining);
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      resetModel();
    });
  }

  generateData(currentDataset);
  loop();

  /* ==========================================================================
     MODULE 2: SEMANTIC VECTOR EMBEDDINGS & COSINE SIMILARITY EXPLORER
     ========================================================================== */
  const vectorCanvas = document.getElementById('vector-space-canvas');
  if (!vectorCanvas) return;
  const vCtx = vectorCanvas.getContext('2d');

  let vWidth = (vectorCanvas.width = 460);
  let vHeight = (vectorCanvas.height = 360);

  // Corpus documents with 6-dimensional synthetic semantic features:
  // [Vision, LLM/Text, Performance/Edge, Math/Theory, MLOps/Deploy, Medical/Audio]
  const documents = [
    {
      id: 1,
      title: 'NeuroVision Edge: INT8 TensorRT',
      category: 'Computer Vision & Edge',
      embedding: [0.92, 0.15, 0.88, 0.54, 0.72, 0.1],
      x: 0.25,
      y: 0.3
    },
    {
      id: 2,
      title: 'ContextRAG: HyDE & Cross-Encoder',
      category: 'LLMs & Agentic RAG',
      embedding: [0.1, 0.95, 0.65, 0.6, 0.82, 0.05],
      x: 0.72,
      y: 0.35
    },
    {
      id: 3,
      title: 'PulseBio: ViT Cardiac Arrhythmia',
      category: 'Biomedical & Vision',
      embedding: [0.78, 0.2, 0.45, 0.75, 0.3, 0.94],
      x: 0.35,
      y: 0.75
    },
    {
      id: 4,
      title: 'Distributed DeepSpeed ZeRO-3 Fine-tuning',
      category: 'MLOps & Systems',
      embedding: [0.2, 0.82, 0.91, 0.68, 0.96, 0.08],
      x: 0.68,
      y: 0.7
    },
    {
      id: 5,
      title: 'FlashAttention-2 Kernel Optimization',
      category: 'High Performance ML',
      embedding: [0.35, 0.75, 0.98, 0.88, 0.85, 0.12],
      x: 0.5,
      y: 0.48
    }
  ];

  // Mathematical Cosine Similarity
  function cosineSimilarity(vecA, vecB) {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Pre-mapped query vectors
  const queryVectors = {
    'low latency edge vision inference': [0.88, 0.12, 0.95, 0.5, 0.8, 0.1],
    'retrieval augmented generation with vector search': [0.12, 0.92, 0.6, 0.55, 0.78, 0.08],
    'ecg transformer medical diagnostic': [0.65, 0.15, 0.35, 0.8, 0.2, 0.95],
    'distributed multi gpu scaling zeRO': [0.18, 0.78, 0.89, 0.7, 0.95, 0.05],
    'attention mechanisms and memory bandwidth': [0.3, 0.82, 0.92, 0.85, 0.75, 0.1]
  };

  let activeQueryPoint = { x: 0.5, y: 0.5, vec: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5] };
  let currentResults = [];

  function evaluateQuery(queryText) {
    const cleanText = queryText.trim().toLowerCase();
    let queryVec = queryVectors[cleanText];

    // Fallback pseudo-embedding based on keywords
    if (!queryVec) {
      queryVec = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2];
      if (/vision|image|detect|camera|yolo/i.test(cleanText)) queryVec[0] += 0.7;
      if (/rag|llm|agent|gpt|prompt|text/i.test(cleanText)) queryVec[1] += 0.75;
      if (/speed|latency|tensorrt|gpu|fast/i.test(cleanText)) queryVec[2] += 0.8;
      if (/math|algorithm|loss|kernel/i.test(cleanText)) queryVec[3] += 0.7;
      if (/deploy|docker|deepspeed|scale|mlops/i.test(cleanText)) queryVec[4] += 0.75;
      if (/ecg|health|bio|medical/i.test(cleanText)) queryVec[5] += 0.85;
    }

    // Calculate cosine similarity against all items
    currentResults = documents.map(doc => {
      const score = cosineSimilarity(queryVec, doc.embedding);
      return { ...doc, score };
    });

    // Sort descending
    currentResults.sort((a, b) => b.score - a.score);

    // Approximate 2D coordinate for the query point
    const topDoc = currentResults[0];
    const secondDoc = currentResults[1];
    activeQueryPoint.x = topDoc.x * 0.7 + secondDoc.x * 0.3;
    activeQueryPoint.y = topDoc.y * 0.7 + secondDoc.y * 0.3;
    activeQueryPoint.vec = queryVec;

    renderVectorResults();
    drawVectorSpace();
  }

  function renderVectorResults() {
    const listContainer = document.getElementById('vector-results-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    currentResults.forEach((res, idx) => {
      const item = document.createElement('div');
      item.className = `vector-item ${idx === 0 ? 'matched' : ''}`;
      item.innerHTML = `
        <div>
          <div class="vector-item-title">${idx + 1}. ${res.title}</div>
          <div class="vector-item-desc">${res.category}</div>
        </div>
        <div class="vector-score">${(res.score * 100).toFixed(1)}% match</div>
      `;
      listContainer.appendChild(item);
    });
  }

  function drawVectorSpace() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    vCtx.clearRect(0, 0, vWidth, vHeight);

    // Draw coordinate axes
    vCtx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    vCtx.lineWidth = 1;
    vCtx.beginPath();
    vCtx.moveTo(vWidth / 2, 0);
    vCtx.lineTo(vWidth / 2, vHeight);
    vCtx.moveTo(0, vHeight / 2);
    vCtx.lineTo(vWidth, vHeight / 2);
    vCtx.stroke();

    // Draw document points
    documents.forEach(doc => {
      const px = doc.x * vWidth;
      const py = doc.y * vHeight;

      // Distance line to active query
      const qx = activeQueryPoint.x * vWidth;
      const qy = activeQueryPoint.y * vHeight;

      vCtx.beginPath();
      vCtx.moveTo(qx, qy);
      vCtx.lineTo(px, py);
      vCtx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.15)';
      vCtx.setLineDash([3, 3]);
      vCtx.stroke();
      vCtx.setLineDash([]);

      // Point circle
      vCtx.beginPath();
      vCtx.arc(px, py, 6, 0, Math.PI * 2);
      vCtx.fillStyle = '#6366f1';
      vCtx.fill();
      vCtx.strokeStyle = '#ffffff';
      vCtx.lineWidth = 2;
      vCtx.stroke();

      // Label
      vCtx.font = '11px JetBrains Mono';
      vCtx.fillStyle = isDark ? '#94a3b8' : '#475569';
      vCtx.fillText(doc.title.split(':')[0], px + 10, py + 4);
    });

    // Draw active query point (pulsing cyan)
    const qx = activeQueryPoint.x * vWidth;
    const qy = activeQueryPoint.y * vHeight;

    vCtx.beginPath();
    vCtx.arc(qx, qy, 8, 0, Math.PI * 2);
    vCtx.fillStyle = '#06b6d4';
    vCtx.fill();
    vCtx.strokeStyle = '#ffffff';
    vCtx.lineWidth = 2;
    vCtx.stroke();

    vCtx.font = 'bold 12px JetBrains Mono';
    vCtx.fillStyle = '#06b6d4';
    vCtx.fillText('Query Vector (Q)', qx + 12, qy - 4);
  }

  // Setup vector UI
  const queryInput = document.getElementById('vector-query-input');
  const btnRunQuery = document.getElementById('btn-run-query');
  const presetChips = document.querySelectorAll('.preset-chip');

  if (btnRunQuery && queryInput) {
    btnRunQuery.addEventListener('click', () => {
      if (queryInput.value) evaluateQuery(queryInput.value);
    });
    queryInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && queryInput.value) evaluateQuery(queryInput.value);
    });
  }

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (queryInput) queryInput.value = q;
      evaluateQuery(q);
    });
  });

  // Initial trigger
  evaluateQuery('low latency edge vision inference');
})();
