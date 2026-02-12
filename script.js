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
   DYNAMIC STARRY BACKGROUND
   ===================== */
class StarryBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.id = 'starryCanvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1'; // Behind everything
        this.canvas.style.pointerEvents = 'none';
        document.body.prepend(this.canvas);

        this.stars = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.initStars();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initStars() {
        const starCount = 150;
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background gradient (Deep Night Sky)
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#050002'); // Deep velvet
        gradient.addColorStop(1, '#1a0508'); // Dark burgundy
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Stars
        this.ctx.fillStyle = '#ffffff';
        this.stars.forEach(star => {
            this.ctx.globalAlpha = star.alpha;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Twinkle effect
            star.alpha += star.twinkle;
            if (star.alpha > 1 || star.alpha < 0.2) star.twinkle *= -1;

            // Movement (Parallax)
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
   HEART FIREWORK (Grand Royal Velvet - Optimized)
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

    insideHeart(px, py, size) {
        const x = px / size;
        const y = -py / size;
        const a = x * x + y * y - 1;
        return (a * a * a - x * x * y * y * y) <= 0;
    }

    drawHeartShape(ctx, x, y, size, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = color;
        // Optimization: Removed shadowBlur to fix lag
        // Use slight transparency for glow effect without performance hit
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        // Heart shape path
        ctx.moveTo(0, -size * 0.3);
        ctx.bezierCurveTo(-size * 0.5, -size, -size, -size * 0.3, 0, size * 0.5);
        ctx.bezierCurveTo(size, -size * 0.3, size * 0.5, -size, 0, -size * 0.3);
        ctx.fill();
        ctx.restore();
    }

    launch() {
        this.resize();
        this.running = true;
        this.frame = 0;
        this.particles = [];
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        // Massive Scale
        const heartSize = Math.min(this.canvas.width, this.canvas.height) * 0.5;

        // STRICT Royal Velvet Red Palette (No Gold/White)
        const colors = [
            '#8a0303', // Blood Red
            '#b80a0a', // Deep Crimson
            '#4a0000', // Dark Velvet
            '#c70039', // Royal Red
            '#900c3f'  // Burgundy
        ];

        const step = 10; // Optimized spacing
        for (let gx = -heartSize * 1.3; gx < heartSize * 1.3; gx += step) {
            for (let gy = -heartSize * 1.5; gy < heartSize * 1.2; gy += step) {
                const rx = gx + (Math.random() - 0.5) * step * 0.8;
                const ry = gy + (Math.random() - 0.5) * step * 0.8;
                if (!this.insideHeart(rx, ry, heartSize)) continue;

                this.particles.push({
                    sx: cx, sy: cy,
                    tx: cx + rx, ty: cy + ry,
                    x: cx, y: cy,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 6 + 4, // Large visible hearts
                    alpha: 0,
                    maxAlpha: 0.9,
                    delay: Math.random() * 6,
                    duration: 40 + Math.random() * 10,
                    drift: (Math.random() - 0.5) * 1.5,
                    gravity: 0.06,
                    rotation: Math.random() * 360,
                    rotSpeed: (Math.random() - 0.5) * 5
                });
            }
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
            const ease = 1 - Math.pow(1 - progress, 3);

            if (progress < 1) {
                p.x = p.sx + (p.tx - p.sx) * ease;
                p.y = p.sy + (p.ty - p.sy) * ease;
            } else {
                p.x += p.drift;
                p.y += p.gravity * (this.frame - p.delay - p.duration);
                p.rotation += p.rotSpeed;
            }

            if (this.frame > 70) p.alpha -= 0.02;
            else p.alpha = Math.min(p.maxAlpha, p.alpha + 0.05);

            if (p.alpha > 0) {
                alive++;
                ctx.globalAlpha = p.alpha;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                this.drawHeartShape(ctx, 0, 0, p.size, p.color);
                ctx.restore();
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
