/* ============================================
   Valentine — Premium Cinematic JS
   ============================================ */

/* =====================
   CORE & UTILS
   ===================== */
const select = (sel) => document.querySelector(sel);
const selectAll = (sel) => document.querySelectorAll(sel);

/* =====================
   OPENING SEQUENCE
   ===================== */
/* =====================
   REALISTIC FIREWORKS (Physics-based)
   ===================== */
class RealisticFirework {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.rockets = [];
        this.running = false;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    launch() {
        this.resize();
        this.running = true;
        this.frame = 0;
        // Launch initial barrage
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.createRocket(), i * 300);
        }
        this.animate();
    }

    createRocket() {
        const x = Math.random() * (this.canvas.width * 0.6) + (this.canvas.width * 0.2);
        const targetY = Math.random() * (this.canvas.height * 0.4) + (this.canvas.height * 0.1);

        this.rockets.push({
            x: x,
            y: this.canvas.height,
            targetY: targetY,
            speed: Math.random() * 3 + 8,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            trail: []
        });
    }

    explode(x, y, color) {
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                decay: Math.random() * 0.015 + 0.005,
                color: color,
                gravity: 0.1
            });
        }
    }

    animate() {
        if (!this.running) return;

        const ctx = this.ctx;
        // Trail effect
        ctx.fillStyle = 'rgba(5, 0, 2, 0.2)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update Rockets
        this.rockets.forEach((r, i) => {
            r.y -= r.speed;
            if (r.y <= r.targetY) {
                this.explode(r.x, r.y, r.color);
                this.rockets.splice(i, 1);
            } else {
                ctx.fillStyle = r.color;
                ctx.fillRect(r.x - 2, r.y, 4, 10);
            }
        });

        // Update Particles
        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            } else {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });

        // Continue until manually stopped or fades out
        if (this.rockets.length > 0 || this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            // Keep loop running to clear canvas properly or stop if needed
            // For this specific intro sequence, we act based on time in initOpening
            requestAnimationFrame(() => this.animate());
        }
    }
}

function initOpening() {
    const envelope = select('#envelope');
    const fw = new RealisticFirework(select('#fireworksCanvas'));
    const musicBtn = select('#musicBtn');

    envelope.addEventListener('click', () => {
        envelope.classList.add('clicked');

        // Music
        const music = select('#bgMusic');
        music.volume = 0.3;
        music.play().catch(() => { });
        musicBtn.classList.add('playing');

        setTimeout(() => fw.launch(), 400);

        setTimeout(() => {
            select('#openingScreen').classList.add('fade-out');
            select('#mainContent').classList.add('show');
            setTimeout(() => {
                select('#mainContent').classList.add('visible');
                select('#openingScreen').style.display = 'none';
                fw.running = false; // Stop fireworks
                musicBtn.classList.add('active');
                typeWriter("Na Bangaram, here is our thread of fate... ❤️", 'heroSub', 40);
            }, 100);
        }, 4000);
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
    const btn = select('#musicBtn');
    const audio = select('#bgMusic');

    if (!btn || !audio) return;

    btn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            btn.classList.add('playing');
        } else {
            audio.pause();
            btn.classList.remove('playing');
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
    initOpening();
    initMilestoneCards(); // Updated
    initGallery();
    initCountdown();
    initSurprise();
    initMusic();
    initHeartCursor();
});
