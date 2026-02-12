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

    drawHeart(ctx, x, y, size, color, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.translate(x, y);
        ctx.beginPath();
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
        const heartSize = Math.min(this.canvas.width, this.canvas.height) * 0.35;
        // Brighter, more vibrant palette mixed with gold
        const colors = ['#ff4d8d', '#ff1744', '#ffd740', '#ffffff', '#ff80ab', '#d50000', '#d4af37'];

        const step = 6;
        for (let gx = -heartSize * 1.2; gx < heartSize * 1.2; gx += step) {
            for (let gy = -heartSize * 1.5; gy < heartSize * 1.1; gy += step) {
                const rx = gx + (Math.random() - 0.5) * step * 0.8;
                const ry = gy + (Math.random() - 0.5) * step * 0.8;
                if (!this.insideHeart(rx, ry, heartSize)) continue;

                this.particles.push({
                    sx: cx, sy: cy,
                    tx: cx + rx, ty: cy + ry,
                    x: cx, y: cy,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 3 + 1.5, // Slightly larger
                    alpha: 0,
                    maxAlpha: 1, // Full opacity
                    delay: Math.random() * 5,
                    duration: 15 + Math.random() * 10,
                    drift: (Math.random() - 0.5) * 0.5
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
            const ease = 1 - Math.pow(2, -10 * progress);

            p.x = p.sx + (p.tx - p.sx) * ease + p.drift * this.frame * 0.1;
            p.y = p.sy + (p.ty - p.sy) * ease + p.drift * this.frame * 0.1;

            // Fade out logic remains similar for both
            if (this.frame > 50) p.alpha = p.maxAlpha * (1 - (this.frame - 50) / 60);
            else p.alpha = ease * p.maxAlpha;

            if (p.alpha > 0) {
                alive++;

                // Add Glow Effect
                ctx.globalAlpha = p.alpha * 0.5;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                ctx.fill();

                // Draw Core
                this.drawHeart(ctx, p.x, p.y, p.size, p.color, p.alpha);
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
   TIMELINE ANIMATION
   ===================== */
function initTimeline() {
    const progress = select('#tlProgress');
    const items = selectAll('.tl-item');

    // Animate Line on Scroll
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        // Limit max height to not overshoot
        if (progress) progress.style.height = scrolled + "%";

        // Reveal Items
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                item.classList.add('visible');
                // Highlight dot when centered
                if (rect.top > window.innerHeight * 0.4 && rect.top < window.innerHeight * 0.6) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }
        });
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
   INIT
   ===================== */
document.addEventListener('DOMContentLoaded', () => {
    initOpening();
    initTimeline();
    initGallery();
    initCountdown();
    initSurprise();
    initMusic();
});
