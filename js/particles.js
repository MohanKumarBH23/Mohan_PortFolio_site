/**
 * TOUCH & MOUSE RESPONSIVE NEURAL CANVAS ANIMATION
 * Ambient 60fps kinetic particle network with full mouse cursor & multi-touch parity.
 * Features:
 * - Real-time cursor tracking with smooth lerp physics and velocity vectoring
 * - Dynamic synaptic filaments bridging the mouse cursor and nearby neural nodes
 * - Fluid kinetic wake stirring particles in the cursor's path
 * - Ambient cybernetic rose aura and pulsing core node at cursor position
 * - Click & tap kinetic shockwave ripples deflecting particles
 * - Full multi-touch support for touchscreens and mobile devices
 * - Zero external dependencies, pure vanilla HTML5 2D Canvas API
 * - Theme-aware contrast optimization (Dark & Light modes)
 */

(function () {
  'use strict';

  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let particles = [];
  let ripples = [];
  let animationFrameId = null;
  let isPageVisible = true;
  let dpr = 1;

  // Configuration Constants
  const BASE_SPEED = 0.55;
  const CONNECTION_DIST = 125;
  const MOUSE_RADIUS = 200;        // Extended interaction field for cursor
  const MOUSE_FILAMENT_DIST = 190; // Maximum distance to weave filaments to cursor
  const MOUSE_BUFFER = 48;         // Soft inner cushion around cursor tip
  const TOUCH_RADIUS = 160;        // Touch interaction field
  const TOUCH_FILAMENT_DIST = 160; // Max distance for touch filaments
  const TOUCH_BUFFER = 42;
  const RIPPLE_MAX_RADIUS = 210;

  // Desktop Mouse Cursor Controller
  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    vx: 0,
    vy: 0,
    speed: 0,
    active: false,
    alpha: 0 // Smooth fade-in/out
  };

  // Mobile / Touchscreen Multi-Touch Controller (identifier -> {x, y})
  const touchPointers = new Map();

  /**
   * Neural Particle Class
   */
  class Particle {
    constructor(x, y) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : Math.random() * height;
      this.baseVx = (Math.random() - 0.5) * BASE_SPEED;
      this.baseVy = (Math.random() - 0.5) * BASE_SPEED;
      this.vx = this.baseVx;
      this.vy = this.baseVy;
      this.radius = Math.random() * 1.8 + 1.2;
      this.baseAlpha = Math.random() * 0.45 + 0.3;
      this.glow = 0;
    }

    update() {
      // Natural dampening back toward base floating velocity
      this.vx = this.vx * 0.95 + this.baseVx * 0.05;
      this.vy = this.vy * 0.95 + this.baseVy * 0.05;

      this.x += this.vx;
      this.y += this.vy;

      // Soft boundary rebound
      if (this.x < 0) {
        this.x = 0;
        this.vx *= -1;
        this.baseVx *= -1;
      } else if (this.x > width) {
        this.x = width;
        this.vx *= -1;
        this.baseVx *= -1;
      }

      if (this.y < 0) {
        this.y = 0;
        this.vy *= -1;
        this.baseVy *= -1;
      } else if (this.y > height) {
        this.y = height;
        this.vy *= -1;
        this.baseVy *= -1;
      }

      this.glow = 0;

      // ======================================================================
      // 1. DESKTOP MOUSE CURSOR KINETIC INTERACTION
      // ======================================================================
      if (mouse.alpha > 0.01) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const norm = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          const angle = Math.atan2(dy, dx);

          // Kinetic fluid wake: rapid cursor sweeps push particles along trajectory
          if (mouse.speed > 0.6) {
            const drag = norm * Math.min(2.5, mouse.speed * 0.16) * mouse.alpha;
            this.vx += mouse.vx * drag * 0.28;
            this.vy += mouse.vy * drag * 0.28;
          }

          // Gentle close-proximity cushion so particles do not crowd cursor tip
          if (dist < MOUSE_BUFFER) {
            const cushion = ((MOUSE_BUFFER - dist) / MOUSE_BUFFER) * 1.4 * mouse.alpha;
            this.vx -= Math.cos(angle) * cushion;
            this.vy -= Math.sin(angle) * cushion;
          } else if (dist >= MOUSE_BUFFER && mouse.speed < 2.0) {
            // Subtle harmonic resonance: gently gathers mesh around hovering cursor
            const pull = norm * 0.08 * mouse.alpha;
            this.vx += Math.cos(angle) * pull;
            this.vy += Math.sin(angle) * pull;
          }

          // Brighten particle based on proximity and cursor presence
          this.glow = Math.max(this.glow, norm * mouse.alpha);
        }
      }

      // ======================================================================
      // 2. MOBILE / TOUCHSCREEN MULTI-TOUCH INTERACTION
      // ======================================================================
      touchPointers.forEach(t => {
        const dx = t.x - this.x;
        const dy = t.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < TOUCH_RADIUS && dist > 0) {
          const norm = (TOUCH_RADIUS - dist) / TOUCH_RADIUS;
          const angle = Math.atan2(dy, dx);

          if (dist < TOUCH_BUFFER) {
            const push = ((TOUCH_BUFFER - dist) / TOUCH_BUFFER) * 1.6;
            this.vx -= Math.cos(angle) * push;
            this.vy -= Math.sin(angle) * push;
          } else {
            const pull = norm * 0.07;
            this.vx += Math.cos(angle) * pull;
            this.vy += Math.sin(angle) * pull;
          }

          this.glow = Math.max(this.glow, norm);
        }
      });

      // ======================================================================
      // 3. EXPANDING SHOCKWAVE / RIPPLE WAVEFRONT INTERACTION
      // ======================================================================
      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i];
        const dx = this.x - r.x;
        const dy = this.y - r.y;
        const dist = Math.hypot(dx, dy);
        const waveDist = Math.abs(dist - r.radius);

        if (waveDist < 35 && dist > 0) {
          const pushForce = ((35 - waveDist) / 35) * r.alpha * 1.8;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * pushForce;
          this.vy += Math.sin(angle) * pushForce;
          this.glow = Math.max(this.glow, r.alpha);
        }
      }
    }

    draw(isDark) {
      const alpha = Math.min(1, this.baseAlpha + this.glow * 0.55);
      const renderRadius = this.radius + this.glow * 1.4;

      ctx.beginPath();
      ctx.arc(this.x, this.y, renderRadius, 0, Math.PI * 2);

      // Rose Accent: #f43f5e (rgb: 244, 63, 94)
      ctx.fillStyle = `rgba(244, 63, 94, ${alpha})`;
      ctx.fill();

      // Ambient halo glow when energized
      if (this.glow > 0.08) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, (this.radius + 3.5) * (1 + this.glow), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 63, 94, ${this.glow * (isDark ? 0.28 : 0.2)})`;
        ctx.fill();
      }
    }
  }

  /**
   * Spawn a kinetic shockwave ripple on click or tap
   */
  function createRipple(x, y) {
    if (ripples.length > 8) ripples.shift();
    ripples.push({
      x,
      y,
      radius: 6,
      maxRadius: RIPPLE_MAX_RADIUS,
      alpha: 0.75
    });
  }

  /**
   * Handle viewport resizing with High-DPI crispness
   */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    initParticles();
  }

  /**
   * Initialize particle field dynamically scaled to viewport area
   */
  function initParticles() {
    particles = [];
    // Dynamic density: ~36 on mobile up to ~85 on widescreen desktop
    const targetCount = Math.max(36, Math.min(85, Math.floor((width * height) / 16000)));
    for (let i = 0; i < targetCount; i++) {
      particles.push(new Particle());
    }
  }

  /**
   * Main 60 FPS Animation & Rendering Loop
   */
  function animate() {
    if (!isPageVisible) return;

    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const now = Date.now();

    // ------------------------------------------------------------------------
    // A. Smooth Mouse Position & Velocity Lerp
    // ------------------------------------------------------------------------
    if (mouse.active) {
      const dx = mouse.targetX - mouse.x;
      const dy = mouse.targetY - mouse.y;
      mouse.vx = dx * 0.4;
      mouse.vy = dy * 0.4;
      mouse.x += mouse.vx;
      mouse.y += mouse.vy;
      mouse.speed = Math.hypot(mouse.vx, mouse.vy);
      mouse.alpha = Math.min(1, mouse.alpha + 0.09); // Quick fade-in
    } else {
      mouse.alpha = Math.max(0, mouse.alpha - 0.04); // Graceful fade-out
      mouse.vx *= 0.85;
      mouse.vy *= 0.85;
      mouse.speed *= 0.85;
    }

    // ------------------------------------------------------------------------
    // B. Render Expanding Kinetic Ripples (Shockwaves)
    // ------------------------------------------------------------------------
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += 4.2;
      r.alpha *= 0.94;

      if (r.alpha > 0.02 && r.radius < r.maxRadius) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(244, 63, 94, ${r.alpha * (isDark ? 0.5 : 0.4)})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Subtle secondary trailing ring
        if (r.radius > 25) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.75, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(244, 63, 94, ${r.alpha * 0.22})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      } else {
        ripples.splice(i, 1);
      }
    }

    const particleLen = particles.length;

    // ------------------------------------------------------------------------
    // C. Render Inter-Particle Synaptic Connection Lines
    // ------------------------------------------------------------------------
    for (let i = 0; i < particleLen; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particleLen; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < CONNECTION_DIST) {
          const alphaFactor = 1 - dist / CONNECTION_DIST;
          const boost = Math.max(p1.glow, p2.glow);
          const lineAlpha = (alphaFactor * (isDark ? 0.24 : 0.16)) + (boost * 0.3);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(244, 63, 94, ${Math.min(0.85, lineAlpha)})`;
          ctx.lineWidth = boost > 0.25 ? 1.3 : 0.85;
          ctx.stroke();
        }
      }
    }

    // ------------------------------------------------------------------------
    // D. Render Mouse Cursor Synaptic Hub & Ambient Aura
    // ------------------------------------------------------------------------
    if (mouse.alpha > 0.02) {
      // 1. Soft Ambient Rose Aura behind cursor
      const auraRadius = 150;
      const auraGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, auraRadius);
      auraGrad.addColorStop(0, `rgba(244, 63, 94, ${0.15 * mouse.alpha * (isDark ? 1 : 0.75)})`);
      auraGrad.addColorStop(0.5, `rgba(244, 63, 94, ${0.04 * mouse.alpha * (isDark ? 1 : 0.7)})`);
      auraGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, auraRadius, 0, Math.PI * 2);
      ctx.fillStyle = auraGrad;
      ctx.fill();

      // 2. Synaptic filaments bridging cursor to nearby particles
      let mouseConnections = 0;
      for (let i = 0; i < particleLen; i++) {
        const p = particles[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < MOUSE_FILAMENT_DIST && mouseConnections < 8) {
          const factor = 1 - dist / MOUSE_FILAMENT_DIST;
          const lineAlpha = factor * mouse.alpha * (isDark ? 0.65 : 0.5);

          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(244, 63, 94, ${lineAlpha})`;
          ctx.lineWidth = factor > 0.5 ? 1.4 : 0.9;
          ctx.stroke();
          mouseConnections++;
        }
      }

      // 3. Central Neural Core Node at cursor tip
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 63, 94, ${0.85 * mouse.alpha})`;
      ctx.fill();

      // 4. Subtle pulsing cybernetic radar ring
      const pulseSize = 8 + Math.sin(now * 0.005) * 2.5;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(244, 63, 94, ${0.35 * mouse.alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // ------------------------------------------------------------------------
    // E. Render Mobile / Touchscreen Synaptic Hubs
    // ------------------------------------------------------------------------
    touchPointers.forEach(t => {
      let touchConnections = 0;
      for (let i = 0; i < particleLen; i++) {
        const p = particles[i];
        const dx = t.x - p.x;
        const dy = t.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < TOUCH_FILAMENT_DIST && touchConnections < 6) {
          const factor = 1 - dist / TOUCH_FILAMENT_DIST;
          const lineAlpha = factor * (isDark ? 0.6 : 0.45);

          ctx.beginPath();
          ctx.moveTo(t.x, t.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(244, 63, 94, ${lineAlpha})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();
          touchConnections++;
        }
      }

      // Touch point luminous ring & dot
      ctx.beginPath();
      ctx.arc(t.x, t.y, 10, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(244, 63, 94, ${isDark ? 0.45 : 0.35})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 63, 94, 0.8)`;
      ctx.fill();
    });

    // ------------------------------------------------------------------------
    // F. Update and Render All Particles
    // ------------------------------------------------------------------------
    for (let i = 0; i < particleLen; i++) {
      particles[i].update();
      particles[i].draw(isDark);
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // ==========================================================================
  // UNIVERSAL MOUSE & POINTER LISTENERS (Desktop)
  // ==========================================================================

  function handlePointerMove(e) {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    if (!mouse.active) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }
  }

  // Pointer Events (primary modern pipeline)
  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('mousemove', handlePointerMove, { passive: true });

  window.addEventListener('pointerdown', (e) => {
    // Only handle mouse / pen pointerdown (touch has dedicated touchstart listener)
    if (e.pointerType !== 'touch') {
      handlePointerMove(e);
      createRipple(e.clientX, e.clientY);
    }
  }, { passive: true });

  window.addEventListener('mousedown', (e) => {
    handlePointerMove(e);
    createRipple(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    mouse.active = false;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  }, { passive: true });

  // ==========================================================================
  // MULTI-TOUCH LISTENERS (Mobile & Touchscreens)
  // ==========================================================================

  function updateTouchList(e) {
    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches[i];
      touchPointers.set(t.identifier, {
        x: t.clientX,
        y: t.clientY
      });
    }
  }

  window.addEventListener('touchstart', (e) => {
    updateTouchList(e);
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      createRipple(t.clientX, t.clientY);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    updateTouchList(e);
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      touchPointers.delete(e.changedTouches[i].identifier);
    }
  }, { passive: true });

  window.addEventListener('touchcancel', (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      touchPointers.delete(e.changedTouches[i].identifier);
    }
  }, { passive: true });

  // ==========================================================================
  // RESIZE & LIFECYCLE OPTIMIZATIONS
  // ==========================================================================

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 100);
  });

  // Pause when tab is inactive to preserve battery & CPU
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (isPageVisible) {
      cancelAnimationFrame(animationFrameId);
      animate();
    } else {
      cancelAnimationFrame(animationFrameId);
    }
  });

  // Start animation
  resize();
  animate();
})();
