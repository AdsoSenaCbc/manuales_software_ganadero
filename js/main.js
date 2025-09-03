function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

function showManual(value) {
    document.querySelectorAll('.manual-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.classList.remove('active');
    });
    if (value) {
        document.getElementById(`manual-${value}`).classList.add('active');
        document.getElementById(`link-${value}`).classList.add('active');
    }
    if (window.innerWidth <= 480) {
        document.querySelector('.sidebar').classList.remove('active');
    }
}

function toggleSubContent(header) {
    const content = header.nextElementSibling;
    content.classList.toggle('active');
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.textContent = '🌙 Modo Oscuro';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️ Modo Claro';
        localStorage.setItem('theme', 'dark');
    }
}

// Load theme from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.querySelector('.theme-toggle');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️ Modo Claro';
    } else {
        themeToggle.textContent = '🌙 Modo Oscuro';
    }

    // Reveal sections on scroll
    const sections = document.querySelectorAll('.manual-content section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
});