// Enhanced JavaScript functionality
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize theme on load
document.addEventListener('DOMContentLoaded', function() {
    applyTheme(currentTheme);
    initializeAnimations();
    buildUsuarioTimeline();
    initializeLightbox();
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

// ---------------------------
// Usuario Timeline + Lightbox
// ---------------------------

let usuarioTimeline = [];
let currentLightboxIndex = 0;

// Descripciones breves por paso (edítalas cuando quieras)
const usuarioCaptions = {
    1: 'Abrir el sistema desde el acceso principal.',
    2: 'Iniciar sesión con tu usuario y contraseña.',
    3: 'Ingresar al menú principal y seleccionar el módulo deseado.',
    4: 'Completar el formulario con los datos solicitados en registro hacienda.',
    5: 'Completar el formulario con los datos solicitados en registro animal.',
    6: 'Seleccionar la ración ceba o lactancia.',
    7: 'Definir los parámetros y condiciones del cálculo para ceba.',
    8: 'Definir los parámetros y condiciones del cálculo para lactancia.',
    9: 'Ver ingredientes.',
    10: 'Agregar un producto en una hacienda y generear reportes.',
    11: 'Ver los detalles de informe de todo el software.',
    12: 'Finalizar y cerrar sesión de forma segura.'
};

function buildUsuarioTimeline() {
    const container = document.getElementById('usuario-timeline');
    if (!container) return;

    // Generar lista de imágenes esperadas (Foto 1 ... Foto 12)
    const items = [];
    for (let i = 1; i <= 12; i++) {
        items.push({
            title: `Paso ${i}`,
            src: `assets/images/Foto ${i}.jpeg`,
            caption: usuarioCaptions[i] || `Paso ${i} del proceso`,
            index: i - 1
        });
    }

    usuarioTimeline = [];
    container.innerHTML = '';

    items.forEach((item, idx) => {
        const card = document.createElement('div');
        card.className = 'timeline-item';

        const label = document.createElement('div');
        label.className = 'timeline-step';
        label.textContent = item.title;

        const figure = document.createElement('figure');
        figure.className = 'timeline-figure';

        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.caption;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.className = 'timeline-img';

        // Si la imagen no existe, eliminar el elemento
        img.onerror = () => {
            card.remove();
        };

        // Registrar y habilitar interacción solo cuando cargue correctamente
        img.onload = () => {
            usuarioTimeline.push({ src: item.src, caption: item.caption });

            // Clic para abrir lightbox
            img.addEventListener('click', () => {
                // efecto de presionado visible
                img.classList.add('pressed');
                setTimeout(() => img.classList.remove('pressed'), 180);

                const realIndex = usuarioTimeline.findIndex(u => u.src === item.src);
                openLightbox(realIndex >= 0 ? realIndex : 0);
            });

            // Indicador accesible de activación por teclado
            img.tabIndex = 0;
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    img.click();
                }
            });
        };

        // Leyenda debajo de la miniatura
        const figcap = document.createElement('figcaption');
        figcap.className = 'timeline-caption';
        figcap.textContent = item.caption;

        figure.appendChild(img);
        figure.appendChild(figcap);
        card.appendChild(label);
        card.appendChild(figure);
        container.appendChild(card);
    });
}

function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const btnClose = lightbox.querySelector('.lightbox-close');
    const btnPrev = lightbox.querySelector('.lightbox-nav.prev');
    const btnNext = lightbox.querySelector('.lightbox-nav.next');
    const btnZoomIn = document.getElementById('zoom-in');
    const btnZoomOut = document.getElementById('zoom-out');
    const btnZoomReset = document.getElementById('zoom-reset');
    const imgWrapper = lightbox.querySelector('.lightbox-image-wrapper');
    const imgEl = document.getElementById('lightbox-image');

    btnClose.addEventListener('click', closeLightbox);
    btnPrev.addEventListener('click', () => navigateLightbox(-1));
    btnNext.addEventListener('click', () => navigateLightbox(1));

    // Cerrar al hacer clic en el fondo
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Teclado: Esc, flechas
    document.addEventListener('keydown', (e) => {
        const isOpen = lightbox.classList.contains('open');
        if (!isOpen) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Estado de zoom y arrastre
    let zoomScale = 1;
    const ZOOM_MIN = 1;
    const ZOOM_MAX = 5;
    const ZOOM_STEP = 0.25;
    let isPanning = false;
    let startX = 0, startY = 0;
    let translateX = 0, translateY = 0;

    function applyTransform() {
        imgEl.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomScale})`;
        imgWrapper.classList.toggle('zoomed', zoomScale > 1);
    }

    function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

    function zoomTo(newScale, centerX = imgEl.clientWidth / 2, centerY = imgEl.clientHeight / 2) {
        const prevScale = zoomScale;
        zoomScale = clamp(newScale, ZOOM_MIN, ZOOM_MAX);
        // Mantener el punto de enfoque durante el zoom
        const rect = imgEl.getBoundingClientRect();
        const offsetX = centerX - rect.width / 2;
        const offsetY = centerY - rect.height / 2;
        if (prevScale !== 0) {
            const scaleChange = zoomScale / prevScale;
            translateX = (translateX + offsetX) * scaleChange - offsetX;
            translateY = (translateY + offsetY) * scaleChange - offsetY;
        }
        // Limitar el arrastre para que no se pierda la imagen
        constrainPan();
        applyTransform();
        updateZoomLabel();
    }

    function updateZoomLabel() {
        if (btnZoomReset) btnZoomReset.textContent = `${Math.round(zoomScale * 100)}%`;
    }

    function resetZoom() {
        zoomScale = 1;
        translateX = 0;
        translateY = 0;
        applyTransform();
        updateZoomLabel();
    }

    function constrainPan() {
        if (zoomScale <= 1) { translateX = 0; translateY = 0; return; }
        const rect = imgEl.getBoundingClientRect();
        const wrapperRect = imgWrapper.getBoundingClientRect();
        const maxX = Math.max(0, (rect.width - wrapperRect.width) / 2);
        const maxY = Math.max(0, (rect.height - wrapperRect.height) / 2);
        translateX = clamp(translateX, -maxX, maxX);
        translateY = clamp(translateY, -maxY, maxY);
    }

    // Botones de zoom
    btnZoomIn?.addEventListener('click', () => zoomTo(zoomScale + ZOOM_STEP));
    btnZoomOut?.addEventListener('click', () => zoomTo(zoomScale - ZOOM_STEP));
    btnZoomReset?.addEventListener('click', resetZoom);

    // Doble clic para alternar zoom 1x/2x
    imgWrapper.addEventListener('dblclick', (e) => {
        const targetScale = zoomScale > 1 ? 1 : 2;
        const centerX = e.clientX - imgEl.getBoundingClientRect().left;
        const centerY = e.clientY - imgEl.getBoundingClientRect().top;
        zoomTo(targetScale, centerX, centerY);
    });

    // Arrastre para mover cuando está ampliado
    imgWrapper.addEventListener('mousedown', (e) => {
        if (zoomScale <= 1) return;
        isPanning = true;
        imgWrapper.classList.add('panning');
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        constrainPan();
        applyTransform();
    });
    window.addEventListener('mouseup', () => {
        isPanning = false;
        imgWrapper.classList.remove('panning');
    });

    // Resetear zoom cuando se cambia de imagen o se abre
    function onOpenOrNavigate() {
        resetZoom();
    }
    // Hook en funciones globales
    const _openLightbox = openLightbox;
    openLightbox = function(index) { _openLightbox(index); onOpenOrNavigate(); };
    const _navigateLightbox = navigateLightbox;
    navigateLightbox = function(dir) { _navigateLightbox(dir); onOpenOrNavigate(); };
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const imgEl = document.getElementById('lightbox-image');
    const captionEl = document.getElementById('lightbox-caption');
    if (!lightbox || !imgEl || !captionEl) return;

    if (!usuarioTimeline.length) return;
    currentLightboxIndex = Math.max(0, Math.min(index, usuarioTimeline.length - 1));

    const item = usuarioTimeline[currentLightboxIndex];
    imgEl.src = item.src;
    imgEl.alt = item.caption;
    captionEl.textContent = item.caption;

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    if (!usuarioTimeline.length) return;
    currentLightboxIndex = (currentLightboxIndex + direction + usuarioTimeline.length) % usuarioTimeline.length;
    const item = usuarioTimeline[currentLightboxIndex];
    const imgEl = document.getElementById('lightbox-image');
    const captionEl = document.getElementById('lightbox-caption');
    if (imgEl && captionEl) {
        imgEl.src = item.src;
        imgEl.alt = item.caption;
        captionEl.textContent = item.caption;
    }
}