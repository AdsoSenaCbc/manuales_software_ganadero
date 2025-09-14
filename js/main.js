// Enhanced JavaScript functionality
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize theme on load
document.addEventListener('DOMContentLoaded', function() {
    applyTheme(currentTheme);
    initializeAnimations();
});

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    const toggles = Array.from(document.querySelectorAll('.sidebar-toggle, .sidebar-toggle-internal'));
    const body = document.body;

    if (window.innerWidth <= 768) {
        // Mobile behavior
        const isActive = sidebar.classList.toggle('active');
        backdrop.classList.toggle('active', isActive);
        toggles.forEach(t => t.classList.toggle('active', isActive));
    } else {
        // Desktop behavior
        const isCollapsed = sidebar.classList.toggle('collapsed');
        body.classList.toggle('sidebar-collapsed', isCollapsed);
        toggles.forEach(t => t.classList.toggle('active', isCollapsed));
    }
}

function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const submenu = dropdown.querySelector('.submenu');
    const isOpen = dropdown.classList.toggle('open');
    
    submenu.classList.toggle('open', isOpen);
    
    // Close other dropdowns
    document.querySelectorAll('.menu-item.has-dropdown').forEach(item => {
        if (item.id !== dropdownId) {
            item.classList.remove('open');
            item.querySelector('.submenu').classList.remove('open');
        }
    });
}

function showManual(section) {
    // Hide all manuals
    document.querySelectorAll('.manual-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active state from all links
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected manual
    const targetManual = document.getElementById(`manual-${section}`);
    if (targetManual) {
        targetManual.classList.add('active');
        
        // Animate sections
        setTimeout(() => {
            targetManual.querySelectorAll('section').forEach((section, index) => {
                setTimeout(() => {
                    section.classList.add('visible');
                }, index * 100);
            });
        }, 50);
    }
    
    // Activate corresponding link
    const targetLink = document.getElementById(`link-${section}`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
    
    // Close mobile sidebar
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.querySelector('.sidebar-backdrop');
        const toggles = document.querySelectorAll('.sidebar-toggle, .sidebar-toggle-internal');

        sidebar.classList.remove('active');
        backdrop.classList.remove('active');
        toggles.forEach(t => t.classList.remove('active'));
    }
}

function toggleSubContent(header) {
    const content = header.nextElementSibling;
    const isActive = content.classList.toggle('active');
    header.classList.toggle('open', isActive);
}

function scrollToSection(sectionId) {
    setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            // Auto-expand the section
            const header = section.querySelector('h2[onclick]');
            if (header && !header.classList.contains('open')) {
                toggleSubContent(header);
            }
        }
    }, 300);
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
}

function applyTheme(theme) {
    const body = document.body;
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = themeBtn.querySelector('.theme-icon');
    const themeText = themeBtn.querySelector('.theme-text');
    
    if (theme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Modo Claro';
    } else {
        body.removeAttribute('data-theme');
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Modo Oscuro';
    }
}

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.manual-content section').forEach(section => {
        observer.observe(section);
    });

    // Add keyboard navigation to cards
    document.querySelectorAll('.interactive-menu .card').forEach(card => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const toggles = Array.from(document.querySelectorAll('.sidebar-toggle, .sidebar-toggle-internal'));
    const clickedOnToggle = toggles.some(t => t.contains(e.target));

    if (window.innerWidth <= 768 && 
        !sidebar.contains(e.target) && 
        !clickedOnToggle && 
        sidebar.classList.contains('active')) {
        toggleSidebar();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    const toggles = document.querySelectorAll('.sidebar-toggle, .sidebar-toggle-internal');
    const body = document.body;

    if (window.innerWidth > 768) {
        // Desktop mode - remove mobile classes
        backdrop.classList.remove('active');
        sidebar.classList.remove('active');
        toggles.forEach(t => t.classList.remove('active'));
    } else {
        // Mobile mode - remove desktop classes
        sidebar.classList.remove('collapsed');
        body.classList.remove('sidebar-collapsed');
        toggles.forEach(t => t.classList.remove('active'));
    }
});

// Initialize with home section
showManual('home');