/* ============================================
   Valentine — JS (Fireworks Opening + Full)
   ============================================ */

// =====================
// HEART-SHAPED FIREWORK
// =====================
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

    // Is point (px,py) inside heart shape centered at origin with given size?
    insideHeart(px, py, size) {
        const x = px / size;
        const y = -py / size; // flip y
        const a = x * x + y * y - 1;
        return (a * a * a - x * x * y * y * y) <= 0;
    }

    // Draw a small heart shape
    drawHeart(ctx, x, y, size, color, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.translate(x, y);
        ctx.beginPath();
        // Heart path
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
        // Larger heart size (fill more screen)
        const heartSize = Math.min(this.canvas.width, this.canvas.height) * 0.38;

        const colors = [
            '#ff1744', '#ff4d8d', '#d50000', '#c62828', // Deep reds
            '#ff5252', '#ff8a80', '#ffeb3b', '#ffffff'  // Highlights
        ];

        // Fill heart using grid sampling
        const step = 6; // slightly less dense but larger particles

        for (let gx = -heartSize * 1.2; gx < heartSize * 1.2; gx += step) {
            for (let gy = -heartSize * 1.5; gy < heartSize * 1.1; gy += step) {
                const rx = gx + (Math.random() - 0.5) * step * 0.8;
                const ry = gy + (Math.random() - 0.5) * step * 0.8;

                if (!this.insideHeart(rx, ry, heartSize)) continue;

                const tx = cx + rx;
                const ty = cy + ry;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const distFromCenter = Math.sqrt(rx * rx + ry * ry) / heartSize;

                this.particles.push({
                    sx: cx, sy: cy,
                    tx: tx, ty: ty,
                    x: cx, y: cy,
                    size: Math.random() * 4 + 2, // Bigger heart particles
                    color: color,
                    alpha: 0,
                    maxAlpha: 0.8 + Math.random() * 0.2,
                    duration: 12 + distFromCenter * 8 + Math.random() * 5, // Super fast explosion
                    delay: Math.random() * 5,
                    fallSpeed: 0,
                    drift: (Math.random() - 0.5) * 0.8,
                    flicker: Math.random() * 6.28
                });
            }
        }

        this.formFrames = 40;     // Fast pop (0.6s)
        this.holdFrames = 50;     // Brief hold
        this.fadeFrames = 100;    // Quick fade
        this.totalFrames = this.formFrames + this.holdFrames + this.fadeFrames;

        this.animate();
    }

    animate() {
        if (!this.running) return;
        this.frame++;
        const ctx = this.ctx;
        const f = this.frame;

        // Smoke trail effect: clear with very transparent dark red
        ctx.fillStyle = 'rgba(20, 0, 5, 0.15)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let alive = 0;

        this.particles.forEach(p => {
            // Phase 1: Form
            if (f <= this.formFrames) {
                if (f < p.delay) return;
                const progress = Math.min((f - p.delay) / p.duration, 1);
                // Elastic out for "explosion" pop
                const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                p.x = p.sx + (p.tx - p.sx) * ease;
                p.y = p.sy + (p.ty - p.sy) * ease;
                p.alpha = ease * p.maxAlpha;
            }
            // Phase 2: Hold
            else if (f <= this.formFrames + this.holdFrames) {
                p.x = p.tx + (Math.random() - 0.5) * 1.5; // More jitter
                p.y = p.ty + (Math.random() - 0.5) * 1.5;
                p.flicker += 0.2;
                p.alpha = p.maxAlpha * (0.7 + 0.3 * Math.sin(p.flicker));
            }
            // Phase 3: Fall (Smoke)
            else {
                const fallProgress = (f - this.formFrames - this.holdFrames) / this.fadeFrames;
                p.fallSpeed += 0.04 + Math.random() * 0.02;
                p.y += p.fallSpeed;
                p.x += p.drift;
                // Fade to smoke color (grey-red)
                p.size *= 0.99; // Shrink slightly
                p.alpha = p.maxAlpha * Math.max(0, 1 - fallProgress * 1.2);
            }

            if (p.alpha <= 0.01 || p.y > this.canvas.height + 50) return;
            alive++;

            // Draw Heart
            this.drawHeart(ctx, p.x, p.y, p.size, p.color, p.alpha);

            // Glow only in center
            if (f > this.formFrames && f < this.totalFrames - 50) {
                ctx.globalAlpha = p.alpha * 0.3;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }
        });

        ctx.globalAlpha = 1;

        if (alive > 0 && f < this.totalFrames + 60) {
            requestAnimationFrame(() => this.animate());
        }
    }

    stop() { this.running = false; }
}

// =====================
// ENVELOPE CLICK → FIREWORKS → REVEAL
// =====================
function initOpening() {
    const openScreen = document.getElementById('openingScreen');
    const envelope = document.getElementById('envelope');
    const mainContent = document.getElementById('mainContent');
    const canvas = document.getElementById('fireworksCanvas');
    const musicBtn = document.getElementById('musicBtn');
    const fw = new HeartFirework(canvas);

    envelope.addEventListener('click', () => {
        envelope.classList.add('clicked');

        // Start music
        const music = document.getElementById('bgMusic');
        music.volume = 0.25;
        music.play().catch(() => { });
        document.getElementById('musicBtn').classList.add('playing');

        // Fire after envelope disappears
        setTimeout(() => {
            fw.launch();
        }, 600);

        // After heart explosion, reveal content
        setTimeout(() => {
            fw.stop();
            openScreen.classList.add('fade-out'); // Transition happens faster now
            mainContent.classList.add('show');
            musicBtn.classList.add('active');
            setTimeout(() => {
                mainContent.classList.add('visible');
                openScreen.style.display = 'none';
                typeWriter("Na Bangaram, this is our story... scroll down, Kanna ❤️", 'heroSub', 50);
            }, 100);
        }, 3800);
    });
}

// =====================
// TYPE WRITER
// =====================
function typeWriter(text, id, speed) {
    const el = document.getElementById(id);
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

// =====================
// FLOATING HEARTS
// =====================
function initHearts() {
    const c = document.getElementById('heartsBg');
    const emojis = ['❤️', '💕', '💗', '💖', '💝', '🌹', '✨'];
    function spawn() {
        const el = document.createElement('span');
        el.classList.add('fl-heart');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (Math.random() * 14 + 10) + 'px';
        el.style.animationDuration = (Math.random() * 10 + 10) + 's';
        c.appendChild(el);
        setTimeout(() => el.remove(), 20000);
    }
    for (let i = 0; i < 5; i++) setTimeout(spawn, i * 700);
    setInterval(spawn, 2800);
}

// =====================
// HEART CURSOR TRAIL
// =====================
function initHeartCursor() {
    const c = document.getElementById('sparkleTrail');
    let last = 0;
    const colors = ['#ff4d8d', '#ff80ab', '#ff1744', '#ffd740', '#ab47bc'];
    const heartSVG = (color, size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

    document.addEventListener('mousemove', e => {
        if (Date.now() - last < 60) return;
        last = Date.now();
        const h = document.createElement('div');
        h.classList.add('cursor-heart');
        const size = Math.random() * 10 + 8;
        const color = colors[Math.floor(Math.random() * colors.length)];
        h.innerHTML = heartSVG(color, size);
        h.style.left = (e.clientX - size / 2) + 'px';
        h.style.top = (e.clientY - size / 2) + 'px';
        h.style.color = color;
        h.style.setProperty('--rot', (Math.random() * 40 - 20) + 'deg');
        c.appendChild(h);
        setTimeout(() => h.remove(), 900);
    });
}

// =====================
// SCROLL ANIMATIONS
// =====================
function initScroll() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const d = e.target.dataset.delay || 0;
                setTimeout(() => e.target.classList.add('vis'), parseInt(d));
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('[data-card]').forEach((c, i) => {
        c.dataset.delay = i * 180;
        obs.observe(c);
    });
}

// =====================
// DAY COUNTERS
// =====================
function initCounters() {
    const now = new Date();
    const dates = {
        daysSinceMet: new Date(2024, 8, 16),
        daysSinceFight: new Date(2024, 9, 14),
        daysSinceVC: new Date(2024, 10, 18),
        daysSinceProposal: new Date(2024, 11, 26),
        daysSinceKiss: new Date(2025, 0, 3),
        daysTogether: new Date(2025, 1, 4),
    };
    for (const [id, date] of Object.entries(dates)) {
        const el = document.getElementById(id);
        if (el) countUp(el, Math.floor((now - date) / 86400000));
    }
}

function countUp(el, target) {
    let cur = 0;
    const step = Math.ceil(target / 35);
    const iv = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(iv); }
        el.textContent = cur;
    }, 25);
}



// =====================
// SECRET CARDS
// =====================
function initSecrets() {
    document.querySelectorAll('.s-card').forEach(c => {
        c.addEventListener('click', () => {
            if (c.classList.contains('revealed')) return;
            c.classList.add('revealed');
            c.querySelector('.s-msg').textContent = c.dataset.msg;
            heartBurst(c);
        });
    });
}

function heartBurst(el) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const hearts = ['❤️', '💕', '💗', '💖', '✨'];
    for (let i = 0; i < 8; i++) {
        const h = document.createElement('span');
        h.classList.add('burst-heart');
        h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        const a = (360 / 8) * i;
        const d = 50 + Math.random() * 40;
        h.style.left = cx + 'px'; h.style.top = cy + 'px';
        h.style.setProperty('--tx', Math.cos(a * Math.PI / 180) * d + 'px');
        h.style.setProperty('--ty', Math.sin(a * Math.PI / 180) * d + 'px');
        h.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
        h.style.fontSize = (Math.random() * 10 + 10) + 'px';
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 1500);
    }
}

// =====================
// COUNTDOWN
// =====================
function initCountdown() {
    function tick() {
        const now = new Date();
        let vday = new Date(now.getFullYear(), 1, 14);
        const vEnd = new Date(now.getFullYear(), 1, 15);

        if (now >= vday && now < vEnd) {
            document.getElementById('cdTitle').textContent = "🎉 It's Valentine's Day, Bangaram! 🎉";
            ['cdDays', 'cdHours', 'cdMins', 'cdSecs'].forEach(id => document.getElementById(id).textContent = '💕');
            document.getElementById('cdMsg').textContent = "Happy Valentine's Day, my Bujjamma! ❤️";
            return;
        }
        if (now >= vEnd) vday = new Date(now.getFullYear() + 1, 1, 14);

        const d = vday - now;
        document.getElementById('cdDays').textContent = String(Math.floor(d / 86400000)).padStart(2, '0');
        document.getElementById('cdHours').textContent = String(Math.floor((d % 86400000) / 3600000)).padStart(2, '0');
        document.getElementById('cdMins').textContent = String(Math.floor((d % 3600000) / 60000)).padStart(2, '0');
        document.getElementById('cdSecs').textContent = String(Math.floor((d % 60000) / 1000)).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
}

// =====================
// SURPRISE
// =====================
function initSurprise() {
    document.getElementById('surpriseBtn').addEventListener('click', () => {
        launchFW();
        setTimeout(showOverlay, 600);
    });
}

function launchFW() {
    const colors = ['#ff4d8d', '#ffd740', '#ff1744', '#42a5f5', '#ab47bc', '#ff80ab', '#fff', '#ffab40'];
    for (let b = 0; b < 5; b++) {
        setTimeout(() => {
            const cx = Math.random() * window.innerWidth;
            const cy = Math.random() * window.innerHeight * 0.5;
            for (let i = 0; i < 22; i++) {
                const p = document.createElement('div');
                p.classList.add('fw-particle');
                p.style.left = cx + 'px'; p.style.top = cy + 'px';
                p.style.background = colors[Math.floor(Math.random() * colors.length)];
                const a = (360 / 22) * i;
                const d = 40 + Math.random() * 80;
                p.style.setProperty('--fx', Math.cos(a * Math.PI / 180) * d + 'px');
                p.style.setProperty('--fy', Math.sin(a * Math.PI / 180) * d + 'px');
                p.style.boxShadow = '0 0 5px ' + p.style.background;
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 1300);
            }
        }, b * 200);
    }
}

function showOverlay() {
    const o = document.createElement('div');
    o.classList.add('surprise-overlay');
    o.innerHTML = `<div class="surprise-text">Nee kosam, Bangaram ❤️<br><span style="font-size:.65em">I love you, my Bujjamma</span><br><span style="font-size:.4em;opacity:.6;display:block;margin-top:.7em">Sep 16, 2024 → Forever & Always 💕<br>Bangaram • Bujjamma • Kannalu • Kanna • Nanna</span></div>`;
    o.addEventListener('click', () => {
        o.style.animation = 'oIn .4s ease reverse';
        setTimeout(() => o.remove(), 400);
    });
    document.body.appendChild(o);

    const rain = setInterval(() => {
        for (let i = 0; i < 3; i++) {
            const h = document.createElement('span');
            h.classList.add('burst-heart');
            h.textContent = ['❤️', '💕', '💗', '💖', '🌹'][Math.floor(Math.random() * 5)];
            h.style.left = Math.random() * 100 + 'vw';
            h.style.top = '-5vh';
            h.style.setProperty('--tx', (Math.random() * 60 - 30) + 'px');
            h.style.setProperty('--ty', window.innerHeight + 'px');
            h.style.setProperty('--rot', Math.random() * 720 + 'deg');
            h.style.fontSize = (Math.random() * 16 + 12) + 'px';
            h.style.animationDuration = '2.5s';
            document.body.appendChild(h);
            setTimeout(() => h.remove(), 2500);
        }
    }, 120);
    setTimeout(() => clearInterval(rain), 5000);
}

// =====================
// MUSIC
// =====================
function initMusic() {
    const btn = document.getElementById('musicBtn');
    const m = document.getElementById('bgMusic');
    btn.addEventListener('click', () => {
        if (m.paused) {
            m.volume = 0.25; m.play().catch(() => { });
            btn.classList.add('playing');
        } else {
            m.pause(); btn.classList.remove('playing');
        }
    });
}

// =====================
// INIT
// =====================
document.addEventListener('DOMContentLoaded', () => {
    initOpening();
    initHearts();
    initHeartCursor();
    initScroll();
    initCounters();
    initSecrets();
    initCountdown();
    initSurprise();
    initMusic();
});
