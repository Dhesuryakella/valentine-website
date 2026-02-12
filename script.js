/* ============================================
   Valentine — Premium Cinematic JS
   ============================================ */

/* =====================
   CORE & UTILS
   ===================== */
const select = (sel) => document.querySelector(sel);
const selectAll = (sel) => document.querySelectorAll(sel);

/* =====================
   DYNAMIC STARRY BACKGROUND (Optimized)
   ===================== */
class StarryBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.canvas.id = 'starryCanvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        document.body.prepend(this.canvas);

        this.stars = [];
        this.gradient = null;
        this.resize();
        window.addEventListener('resize', () => {
            this.resize();
            this.createGradient();
        });
        this.initStars();
        this.createGradient();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createGradient() {
        this.gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        this.gradient.addColorStop(0, '#050002');
        this.gradient.addColorStop(1, '#1a0508');
    }

    initStars() {
        const starCount = 60; // Reduced count
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.5,
                alpha: Math.random(),
                speed: Math.random() * 0.05 + 0.01,
                twinkle: Math.random() * 0.02 + 0.005
            });
        }
    }

    animate() {
        if (!this.gradient) return;

        this.ctx.fillStyle = this.gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#ffffff';
        this.stars.forEach(star => {
            this.ctx.globalAlpha = star.alpha;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();

            star.alpha += star.twinkle;
            if (star.alpha > 1 || star.alpha < 0.2) star.twinkle *= -1;

            star.y -= star.speed;
            if (star.y < 0) {
                star.y = this.canvas.height;
                star.x = Math.random() * this.canvas.width;
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

/* =====================
   HEART FIREWORK (Cinematic Pure Heart - Optimized)
   ===================== */
class HeartFirework {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.running = false;
        this.frame = 0;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Parametric Heart Equation for "Pure" Shape
    getHeartPoint(t, size) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return { x: x * size, y: y * size };
    }

    drawSparkle(ctx, x, y, size, color, alpha, vx, vy) {
        ctx.save();
        ctx.translate(x, y);

        // Motion Streak (Directional tail)
        const stretch = 2;
        const angle = Math.atan2(vy, vx);
        ctx.rotate(angle);

        // Glow Gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
        gradient.addColorStop(0, '#ffffff'); // Hot center
        gradient.addColorStop(0.3, color);   // Velvet color
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.globalAlpha = alpha;

        // Draw the streak
        ctx.beginPath();
        ctx.ellipse(0, 0, size * stretch, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    launch() {
        this.resize();
        this.running = true;
        this.frame = 0;
        this.particles = [];
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height * 0.45; // Centered vertically

        // Explosion Scale
        const scale = Math.min(this.canvas.width, this.canvas.height) * 0.025;

        // STRICT Royal Red Velvet Palette
        const colors = [
            '#ff0033', // Bright Scarlet
            '#cc0000', // Crimson
            '#800000', // Maroon
            '#ff4d4d', // Light Red (Sparkle intensity)
            '#b30000'  // Strong Red
        ];

        // Generate particles along the heart outline (Pure shape)
        const particleCount = 280;
        for (let i = 0; i < particleCount; i++) {
            const t = (i / particleCount) * Math.PI * 2;
            const target = this.getHeartPoint(t, scale);

            this.particles.push({
                sx: cx, sy: cy,
                tx: cx + target.x, ty: cy + target.y,
                x: cx, y: cy,
                vx: target.x * 0.15, vy: target.y * 0.15, // Initial velocity
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 3 + 2,
                alpha: 0,
                maxAlpha: 1,
                delay: Math.random() * 5,
                duration: 60 + Math.random() * 20,
                shimmer: Math.random() * 0.1,
                gravity: 0.04
            });
        }
        this.animate();
    }

    animate() {
        if (!this.running) return;
        this.frame++;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let alive = 0;
        this.particles.forEach(p => {
            if (this.frame < p.delay) return;

            const progress = Math.min((this.frame - p.delay) / p.duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4); // Fast expand, slow drift

            if (progress < 1) {
                // Expansion phase
                p.x = p.sx + (p.tx - p.sx) * ease;
                p.y = p.sy + (p.ty - p.sy) * ease;
                p.alpha = Math.min(1, p.alpha + 0.1);
            } else {
                // Drift and Gravity phase
                p.x += (p.tx - p.sx) * 0.01; // Tiny persistent drift
                p.y += p.gravity;
                p.alpha -= 0.015; // Slow fade
            }

            // Random shimmer sparkle
            const currentAlpha = p.alpha * (1 - Math.random() * p.shimmer);

            if (p.alpha > 0) {
                alive++;
                this.drawSparkle(ctx, p.x, p.y, p.size, p.color, currentAlpha, p.tx - p.sx, p.ty - p.sy);
            }
        });

        if (alive > 0) requestAnimationFrame(() => this.animate());
        else this.running = false;
    }
}

function initOpening() {
    const envelope = select('#envelope');
    const fw = new HeartFirework(select('#fireworksCanvas'));
    const musicBtn = select('#musicBtn');

    envelope.addEventListener('click', () => {
        envelope.classList.add('clicked');

        // Music
        const music = select('#bgMusic');
        music.volume = 0.3;
        music.play().catch(() => { });
        musicBtn.classList.add('playing');

        setTimeout(() => fw.launch(), 800);

        setTimeout(() => {
            select('#openingScreen').classList.add('fade-out');
            select('#mainContent').classList.add('show');
            setTimeout(() => {
                select('#mainContent').classList.add('visible');
                select('#openingScreen').style.display = 'none';
                musicBtn.classList.add('active');
                typeWriter("Na Bangaram, here is our thread of fate... ❤️", 'heroSub', 40);
            }, 100);
        }, 3500);
    });
}

function typeWriter(text, id, speed) {
    const el = document.getElementById(id);
    if (!el) return;
    let i = 0;
    el.textContent = '';
    (function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    })();
}

/* =====================
   MILESTONE CARDS ANIMATION
   ===================== */
function initMilestoneCards() {
    const cards = selectAll('.m-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        observer.observe(card);
    });
}

/* =====================
   POLAROID GALLERY
   ===================== */
function initGallery() {
    selectAll('.polaroid').forEach(card => {
        card.addEventListener('click', () => {
            // Close others
            selectAll('.polaroid.revealed').forEach(c => {
                if (c !== card) c.classList.remove('revealed');
            });
            card.classList.toggle('revealed');
        });
    });
}

/* =====================
   COUNTDOWN
   ===================== */
function initCountdown() {
    const cdIds = ['cdDays', 'cdHours', 'cdMins', 'cdSecs'];
    const title = select('#cdTitle');
    const msg = select('#cdMsg');

    function tick() {
        const now = new Date();
        const year = now.getFullYear();
        let target = new Date(year, 1, 14); // Feb 14
        if (now > new Date(year, 1, 15)) target = new Date(year + 1, 1, 14); // Next year if passed

        const diff = target - now;

        if (now.getMonth() === 1 && now.getDate() === 14) {
            if (title) title.textContent = "It's Valentine's Day, Kanna! ❤️";
            cdIds.forEach(id => select('#' + id) ? select('#' + id).textContent = "❤️" : null);
            if (msg) msg.textContent = "I love you more than anything!";
            return;
        }

        if (diff <= 0) return;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        if (select('#' + cdIds[0])) select('#' + cdIds[0]).textContent = String(d).padStart(2, '0');
        if (select('#' + cdIds[1])) select('#' + cdIds[1]).textContent = String(h).padStart(2, '0');
        if (select('#' + cdIds[2])) select('#' + cdIds[2]).textContent = String(m).padStart(2, '0');
        if (select('#' + cdIds[3])) select('#' + cdIds[3]).textContent = String(s).padStart(2, '0');
    }

    setInterval(tick, 1000);
    tick();
}

/* =====================
   SURPRISE & MUSIC
   ===================== */
function initSurprise() {
    const btn = select('#surpriseBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        // Create falling hearts
        for (let i = 0; i < 30; i++) {
            setTimeout(createFallingHeart, i * 100);
        }

        // Show premium overlay
        setTimeout(showPremiumOverlay, 600);
    });
}

function showPremiumOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'surprise-overlay';

    // Premium Card Structure
    overlay.innerHTML = `
        <div class="surprise-card">
            <span class="sc-icon">💖</span>
            <h2 class="sc-title">I Love You!</h2>
            <div class="sc-msg">
                Nee kosam, Bangaram.<br>
                You are my forever and always.<br>
                My heart beats only for you, Bujjamma.
            </div>
            <div class="sc-footer">Sep 16, 2024 • Infinite</div>
        </div>
    `;

    // Click anywhere to close
    overlay.addEventListener('click', () => {
        overlay.style.animation = 'fadeInOverlay 0.5s reverse forwards';
        setTimeout(() => overlay.remove(), 500);
    });

    document.body.appendChild(overlay);
}

function createFallingHeart() {
    const heart = document.createElement('div');
    heart.className = 'fw-particle'; // Reuse class for simplicity or add new
    heart.textContent = ['❤️', '💖', '✨', '🌹'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '-50px';
    heart.style.fontSize = Math.random() * 20 + 20 + 'px';
    heart.style.position = 'fixed';
    heart.style.transition = 'top 3s ease-in';
    heart.style.zIndex = '10000';
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.style.top = '110vh';
    }, 50);

    setTimeout(() => heart.remove(), 3500);
}

function initMusic() {
    const musicBtn = select('#musicBtn');
    const bgMusic = select('#bgMusic');

    if (!musicBtn || !bgMusic) return;

    musicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicBtn.classList.add('playing');
            }).catch(e => {
                console.log("Audio playback failed (likely empty or missing file):", e);
                alert("Please add your 'music.mp3' file to the project folder!");
            });
        } else {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
        }
    });
}

/* =====================
   HEART CURSOR TRAIL
   ===================== */
function initHeartCursor() {
    const c = document.createElement('div');
    c.id = 'sparkleTrail';
    document.body.appendChild(c);

    let last = 0;
    const colors = ['#ce9dba', '#d4af37', '#8a3a54', '#ffffff', '#ff4d8d'];
    const heartSVG = (color, size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

    document.addEventListener('mousemove', e => {
        if (Date.now() - last < 50) return;
        last = Date.now();
        const h = document.createElement('div');
        h.classList.add('cursor-heart');
        const size = Math.random() * 12 + 8;
        const color = colors[Math.floor(Math.random() * colors.length)];
        h.innerHTML = heartSVG(color, size);
        h.style.left = (e.clientX - size / 2) + 'px';
        h.style.top = (e.clientY - size / 2) + 'px';
        h.style.position = 'fixed';
        h.style.pointerEvents = 'none';
        h.style.zIndex = '9999';
        h.style.transform = `rotate(${Math.random() * 360}deg) scale(0)`;
        h.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        h.style.opacity = '0.8';

        c.appendChild(h);

        requestAnimationFrame(() => {
            h.style.transform = `rotate(${Math.random() * 360}deg) scale(1)`;
        });

        setTimeout(() => {
            h.style.opacity = '0';
            h.style.transform = `rotate(${Math.random() * 360}deg) scale(1.5)`;
            setTimeout(() => h.remove(), 500);
        }, 400);
    });
}

/* =====================
   INIT
   ===================== */
document.addEventListener('DOMContentLoaded', () => {
    new StarryBackground(); // Added Dynamic Background
    initOpening();
    initMilestoneCards(); // Updated
    initGallery();
    initCountdown();
    initSurprise();
    initMusic();
    initHeartCursor();
});
