// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Theme Toggle Logic
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle?.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

if (localStorage.getItem('theme')) {
    body.setAttribute('data-theme', localStorage.getItem('theme'));
}

// Mobile Menu Logic
const hamburger = document.getElementById('hamburger');
const navOverlay = document.getElementById('navOverlay');
const overlayLinks = document.querySelectorAll('.nav-overlay a');

function toggleMenu() {
    hamburger?.classList.toggle('active');
    navOverlay?.classList.toggle('active');
    body.style.overflow = navOverlay?.classList.contains('active') ? 'hidden' : '';
}

hamburger?.addEventListener('click', toggleMenu);
overlayLinks.forEach(link => link.addEventListener('click', toggleMenu));

// Custom Cursor with Lag Effect
const cursor = document.getElementById('cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    let dx = mouseX - cursorX;
    let dy = mouseY - cursorY;
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    if (cursor) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, select, input, .accordion-header, .masonry-item').forEach(el => {
    el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
});

// Reveal Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Parallax & Navbar Scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxHero = document.getElementById('parallaxHero');
    if (parallaxHero) {
        parallaxHero.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
    }
    
    const nav = document.querySelector('nav');
    if (nav) {
        if (scrolled > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }
});

// Admin Chart Helper (only for admin.html)
function drawAdminChart() {
    const canvas = document.getElementById('visitorsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const data = [40, 80, 60, 120, 150, 90, 180, 210, 170, 240, 300, 280];
    const months = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const padding = 50;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);
    const barWidth = chartWidth / data.length - 20;
    const maxVal = Math.max(...data);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    data.forEach((val, i) => {
        const x = padding + (i * (chartWidth / data.length)) + 10;
        const h = (val / maxVal) * chartHeight;
        const y = canvas.height - padding - h;

        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent');
        ctx.fillRect(x, y, barWidth, h);

        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text');
        ctx.font = '10px Jost';
        ctx.textAlign = 'center';
        ctx.fillText(months[i], x + (barWidth / 2), canvas.height - 20);
        ctx.fillText(val, x + (barWidth / 2), y - 10);
    });
}

if (window.location.pathname.includes('admin.html')) {
    window.addEventListener('load', drawAdminChart);
    window.addEventListener('resize', drawAdminChart);
}
