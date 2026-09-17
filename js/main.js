/**
 * =================================================================================================
 * PORTFOLIO DE JAVIER MESONERO MORO - MAIN.JS
 * =================================================================================================
 *
 * Descripción: Script principal para la funcionalidad interactiva del portfolio.
 * Autor: Javier Mesonero Moro
 * Versión: 1.2 (Corrección del toggle de tema en móvil)
 *
 */

/* ========================================================================== */
/* 1. VARIABLES GLOBALES                                                      */
/* ========================================================================== */

let isTyping = false;
let currentProject = 0;
let galleryCurrentIndex = {};

/* ========================================================================== */
/* 2. INICIALIZACIÓN PRINCIPAL (DOMContentLoaded)                             */
/* ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    // Configuraciones iniciales
    setupIntersectionObserver();
    setupSmoothScrolling();
    setupNavbarScrollEffect();
    setupMobileMenu();
    setupContactForm();
    setupParallaxEffect();
    setupLazyLoading();
    setupEasterEgg();
    setupThemeToggle(); // <- Llama a la versión corregida
    setupCVModal();
    initializeGalleries();

    // Iniciar efectos con retardo
    setTimeout(() => {
        typeWriter();
    }, 1500);

    observeCounters();
    handlePreloader();

    console.log("🚀 Portfolio de Javier Mesonero Moro cargado correctamente");
});


/* ========================================================================== */
/* 3. FUNCIONES DE CONFIGURACIÓN (SETUP)                                      */
/* ========================================================================== */

/**
 * >> CORRECCIÓN APLICADA AQUÍ <<
 * Configura el toggle para cambiar entre tema claro y oscuro en AMBAS vistas (desktop y móvil).
 */
function setupThemeToggle() {
    const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
    
    // Función para aplicar el cambio de tema
    const applyThemeChange = () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        showNotification(`Tema ${isLight ? 'claro' : 'oscuro'} activado`, 'success'); // Notificación aquí
    };

    // Cargar tema guardado al inicio
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
    }

    // Añadir el evento a ambos botones
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            applyThemeChange();
            // Opcional: Pequeña animación al hacer clic
            toggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                toggle.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

/**
 * Configura el formulario de contacto para enviar correos usando tu API en Vercel.
 */
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Validación de campos (Se mantiene igual)
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        if (!name || !email || !subject || !message) {
            showNotification('Por favor, completa todos los campos', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Por favor, introduce un email válido', 'error');
            return;
        }

        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.innerHTML;

        // 2. Mostrar estado de envío (Se mantiene igual)
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
        submitBtn.disabled = true;

        // 3. Preparar datos (Mantenemos los nombres que usabas para que no se rompa tu plantilla de EmailJS)
        const templateParams = {
            subject: subject,
            from_name: name,
            from_email: email,
            message: message,
            reply_to: email
        };

        try {
            // 4. Enviar el correo usando NUESTRA API DE VERCEL (Aquí está el cambio)
            const response = await fetch('/api/enviar-correo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(templateParams)
            });

            // Si la respuesta es exitosa (código 200)
            if (response.ok) {
                showNotification('¡Mensaje enviado correctamente!', 'success');
                form.reset();
                closeContactModal();
            } else {
                throw new Error('La respuesta del servidor no fue exitosa.');
            }

        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
        } finally {
            // 5. Restaurar el botón (Se mantiene igual)
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

/**
 * Configura el Intersection Observer para animaciones de entrada.
 */
function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right").forEach((el) => {
        observer.observe(el);
    });
}

/**
 * Configura el desplazamiento suave para los anclajes.
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });

                // Cerrar menú móvil al hacer clic en un enlace
                const mobileMenu = document.getElementById("mobile-menu");
                if (!mobileMenu.classList.contains("hidden")) {
                    mobileMenu.classList.add("hidden");
                    const icon = document.querySelector("#mobile-menu-btn i");
                    icon.className = "fas fa-bars text-lg";
                }
            }
        });
    });
}

/**
 * Configura el efecto de la barra de navegación al hacer scroll.
 */
function setupNavbarScrollEffect() {
    const navbar = document.getElementById("navbar");
    let lastScrollTop = 0;

    window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = "translateY(-100%)";
        } else {
            navbar.style.transform = "translateY(0)";
        }

        lastScrollTop = scrollTop;
    });
}

/**
 * Configura el menú para dispositivos móviles.
 */
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
        const icon = mobileMenuBtn.querySelector("i");
        icon.className = mobileMenu.classList.contains("hidden") ? "fas fa-bars text-lg" : "fas fa-times text-lg";
    });

    document.addEventListener("click", (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add("hidden");
            const icon = mobileMenuBtn.querySelector("i");
            icon.className = "fas fa-bars text-lg";
        }
    });
}

/**
 * Configura el lazy loading para imágenes.
 */
function setupLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove("opacity-0");
                img.classList.add("opacity-100");
                observer.unobserve(img);
            }
        });
    });

    images.forEach((img) => imageObserver.observe(img));
}


/* ========================================================================== */
/* 4. FUNCIONALIDADES PRINCIPALES                                             */
/* ========================================================================== */

/**
 * Efecto de máquina de escribir para el subtítulo del hero.
 */
function typeWriter() {
    if (isTyping) return;
    isTyping = true;

    const texts = [
        "Desarrollador de 22 años especializado en soluciones multiplataforma, con experiencia en diseño de APIs, arquitectura de sistemas y gestión de bases de datos.",
        "Actualmente cursando ASIR y enfocado en crear soluciones tecnológicas eficientes, escalables e innovadoras.",
        "Perfil analítico, proactivo y orientado a resultados, con mentalidad de mejora continua y aprendizaje constante."
    ];
    const heroSubtitle = document.querySelector(".hero-subtitle");
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        heroSubtitle.innerHTML = `${currentText.substring(0, charIndex)}<span class="typing-cursor"></span>`;

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        if (isDeleting) charIndex--;
        else charIndex++;

        setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1000);
}


/**
 * Carrusel de Proyectos
 */
function nextProject() {
    const carousel = document.getElementById("project-carousel");
    const totalProjects = carousel.children.length;
    currentProject = (currentProject + 1) % totalProjects;
    updateCarousel();
}

function previousProject() {
    const carousel = document.getElementById("project-carousel");
    const totalProjects = carousel.children.length;
    currentProject = (currentProject - 1 + totalProjects) % totalProjects;
    updateCarousel();
}

function goToProject(index) {
    currentProject = index;
    updateCarousel();
}

function updateCarousel() {
    const carousel = document.getElementById("project-carousel");
    carousel.style.transform = `translateX(-${currentProject * 100}%)`;
    document.querySelectorAll(".carousel-indicator").forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentProject);
    });
}

/**
 * Galería de Imágenes de Proyectos
 */
function initializeGalleries() {
    document.querySelectorAll(".gallery-container").forEach(container => {
        const id = container.id;
        galleryCurrentIndex[id] = 0;
        showImage(id, 0);
    });
}


function showImage(galleryId, index) {
    const gallery = document.getElementById(galleryId);
    const images = gallery.querySelectorAll(".gallery-image");
    const dots = gallery.parentElement.querySelectorAll(".gallery-dot");

    images.forEach((img) => img.classList.add("hidden"));
    images[index].classList.remove("hidden");

    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    galleryCurrentIndex[galleryId] = index;
}

function nextImage(galleryId) {
    const gallery = document.getElementById(galleryId);
    const images = gallery.querySelectorAll(".gallery-image");
    const currentIndex = galleryCurrentIndex[galleryId] || 0;
    showImage(galleryId, (currentIndex + 1) % images.length);
}

function previousImage(galleryId) {
    const gallery = document.getElementById(galleryId);
    const images = gallery.querySelectorAll(".gallery-image");
    const currentIndex = galleryCurrentIndex[galleryId] || 0;
    showImage(galleryId, (currentIndex - 1 + images.length) % images.length);
}

/* ========================================================================== */
/* 5. COMPONENTES DE LA INTERFAZ (UI)                                         */
/* ========================================================================== */

/**
 * Muestra una notificación emergente.
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - 'success', 'error', o 'info'.
 */
function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    const typeClasses = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500"
    };
    const typeIcons = {
        success: "fa-check-circle",
        error: "fa-exclamation-circle",
        info: "fa-info-circle"
    };

    notification.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${typeClasses[type]} text-white`;
    notification.innerHTML = `<div class="flex items-center"><i class="fas ${typeIcons[type]} mr-2"></i><span>${message}</span></div>`;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.remove("translate-x-full"), 100);
    setTimeout(() => {
        notification.classList.add("translate-x-full");
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

/**
 * Efecto parallax para elementos decorativos.
 */
function setupParallaxEffect() {
    window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll(".shape").forEach((shape, index) => {
            const speed = (index + 1) * 0.2;
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

/**
 * Animación de contadores de estadísticas.
 */
function animateCounters() {
    document.querySelectorAll(".counter").forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target"));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        updateCounter();
    });
    
    // Animar barra de progreso
    setTimeout(() => {
        const progressBar = document.getElementById("progress-bar");
        if (progressBar) {
            progressBar.style.width = "75%";
        }
    }, 500);
}

/**
 * Observador específico para iniciar la animación de contadores cuando son visibles.
 */
function observeCounters() {
    const statsSection = document.querySelector("#estadisticas");
    if (statsSection) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterObserver.observe(statsSection);
    }
}

/**
 * Oculta el preloader de la página.
 */
function handlePreloader() {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = "0";
            setTimeout(() => preloader.style.display = "none", 500);
        }, 1000);
    }
}


/* ========================================================================== */
/* 6. MANEJO DEL CV (MODAL Y DESCARGA)                                        */
/* ========================================================================== */

const CV_PATH = "assets/pdf/CV Javi.pdf";

function downloadCV() {
    const link = document.createElement('a');
    link.href = CV_PATH;
    link.download = 'CV_Javier_Mesonero_Moro.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('CV descargado correctamente', 'success');
}

function openCVModal() {
    const modal = document.getElementById('cv-modal');
    document.getElementById('pdf-viewer').src = CV_PATH;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCVModal() {
    const modal = document.getElementById('cv-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openCVInNewTab() {
    window.open(CV_PATH, '_blank');
    closeCVModal();
}

function setupCVModal() {
    const modal = document.getElementById('cv-modal');
    const closeBtn = document.getElementById('close-modal');

    closeBtn.addEventListener('click', closeCVModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCVModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeCVModal();
        }
    });
}

/* ========================================================================== */
/* 7. MODAL DE CONTACTO                                                       */
/* ========================================================================== */

function openContactModal() {
    const modal = document.getElementById('contact-modal');
    if(!modal) return;
    const modalContent = document.getElementById('modal-content');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 50);
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if(!modal) return;
    const modalContent = document.getElementById('modal-content');
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 300);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('contact-modal');
        if (modal && !modal.classList.contains('hidden')) {
            closeContactModal();
        }
    }
});


/* ========================================================================== */
/* 8. FUNCIONALIDADES ADICIONALES (EASTER EGG, PERFORMANCE)                   */
/* ========================================================================== */

/**
 * Konami Code Easter Egg.
 */
function setupEasterEgg() {
    const konamiCode = ["ArrowUp", "ArrowDown", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];
    let userInput = [];

    document.addEventListener("keydown", (e) => {
        userInput.push(e.code);
        if (userInput.length > konamiCode.length) userInput.shift();

        if (userInput.join(",") === konamiCode.join(",")) {
            document.body.style.filter = "hue-rotate(180deg)";
            showNotification("¡Modo desarrollador activado! 🚀", "success");
            setTimeout(() => document.body.style.filter = "none", 30000);
            userInput = [];
        }
    });
}

/**
 * Monitorización del rendimiento de carga de la página.
 */
window.addEventListener("load", function () {
    const loadTime = performance.now();
    console.log(`⚡ Página cargada en ${Math.round(loadTime)}ms`);
});


/* ========================================================================== */
/* 9. ASIGNACIÓN A `WINDOW` Y MANEJO DE ERRORES                              */
/* ========================================================================== */

// Hacer funciones accesibles globalmente si se llaman desde el HTML (onclick)
window.downloadCV = downloadCV;
window.openCVModal = openCVModal;
window.closeCVModal = closeCVModal;
window.openCVInNewTab = openCVInNewTab;
window.nextProject = nextProject;
window.previousProject = previousProject;
window.goToProject = goToProject;
window.nextImage = nextImage;
window.previousImage = previousImage;
window.showImage = showImage;
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;

// Manejo de errores global
window.addEventListener("error", function (e) {
    console.error("Error global detectado:", e.error);
});

// Mensaje de despedida
window.addEventListener("beforeunload", function () {
    console.log("👋 ¡Hasta la vista!");
});



