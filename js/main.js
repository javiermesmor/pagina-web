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
let currentLocale = 'es';
let typingTimeoutId = null;
let lastModalTrigger = null;

function translate(key) {
    return window.portfolioI18n.translate(key, currentLocale);
}

/* ========================================================================== */
/* 2. INICIALIZACIÓN PRINCIPAL (DOMContentLoaded)                             */
/* ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    setupLanguageSelector();
    setupRandomMotivationalQuote();
    // Configuraciones iniciales
    setupIntersectionObserver();
    setupSmoothScrolling();
    setupNavbarScrollEffect();
    setupBackToTop();
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

function setupRandomMotivationalQuote() {
    const quote = document.getElementById('motivational-quote');
    if (!quote) return;

    const quoteIndex = Math.floor(Math.random() * 5) + 1;
    quote.dataset.i18n = `motivationalQuote${quoteIndex}`;
    quote.textContent = translate(quote.dataset.i18n);
}

function setupLanguageSelector() {
    const control = document.querySelector('.language-control');
    const menuButton = document.getElementById('language-menu-button');
    const menu = document.getElementById('language-menu');
    const languageOptions = Array.from(menu.querySelectorAll('[data-locale]'));
    currentLocale = localStorage.getItem('portfolio-language') || 'es';
    if (!window.portfolioI18n.locales.includes(currentLocale)) {
        currentLocale = 'es';
    }

    const closeMenu = (restoreFocus = false) => {
        menu.hidden = true;
        menuButton.setAttribute('aria-expanded', 'false');
        if (restoreFocus) menuButton.focus();
    };

    const openMenu = () => {
        menu.hidden = false;
        menuButton.setAttribute('aria-expanded', 'true');
        const selectedOption = languageOptions.find(option => option.dataset.locale === currentLocale);
        selectedOption?.focus();
    };

    const applyLanguage = (locale) => {
        currentLocale = locale;
        document.documentElement.lang = locale;
        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const value = translate(element.dataset.i18n);
            const textNodes = Array.from(element.childNodes).filter((node) =>
                node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()
            );

            if (textNodes.length === 1) {
                const textNode = textNodes[0];
                const leadingSpace = textNode.nodeValue.match(/^\s*/)[0];
                const trailingSpace = textNode.nodeValue.match(/\s*$/)[0];
                textNode.nodeValue = `${leadingSpace}${value}${trailingSpace}`;
            } else if (textNodes.length === 0) {
                element.textContent = value;
            }
        });

        document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
            element.setAttribute('aria-label', translate(element.dataset.i18nAriaLabel));
        });
        const mobileMenuButton = document.getElementById('mobile-menu-btn');
        if (mobileMenuButton) {
            const menuIsOpen = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-label', translate(menuIsOpen ? 'closeMenu' : 'openMenu'));
        }
        document.querySelectorAll('[data-i18n-title]').forEach((element) => {
            element.setAttribute('title', translate(element.dataset.i18nTitle));
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
            element.setAttribute('placeholder', translate(element.dataset.i18nPlaceholder));
        });
        document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
            element.setAttribute('alt', translate(element.dataset.i18nAlt));
        });

        const selectedOption = languageOptions.find(option => option.dataset.locale === locale);
        document.getElementById('current-language').textContent = selectedOption.querySelector('.language-name').textContent;
        languageOptions.forEach((option) => {
            const isSelected = option.dataset.locale === locale;
            option.setAttribute('aria-checked', String(isSelected));
            option.classList.toggle('selected', isSelected);
        });
        localStorage.setItem('portfolio-language', locale);
        if (isTyping) typeWriter(true);
    };

    menuButton.addEventListener('click', () => {
        if (menu.hidden) openMenu();
        else closeMenu();
    });

    languageOptions.forEach((option, index) => {
        option.addEventListener('click', () => {
            applyLanguage(option.dataset.locale);
            closeMenu(true);
        });
        option.addEventListener('keydown', (event) => {
            let nextIndex = index;
            if (event.key === 'ArrowDown') nextIndex = (index + 1) % languageOptions.length;
            else if (event.key === 'ArrowUp') nextIndex = (index - 1 + languageOptions.length) % languageOptions.length;
            else if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = languageOptions.length - 1;
            else if (event.key === 'Escape') {
                event.preventDefault();
                closeMenu(true);
                return;
            } else if (event.key === 'Tab') {
                closeMenu();
                return;
            } else {
                return;
            }
            event.preventDefault();
            languageOptions[nextIndex].focus();
        });
    });

    menuButton.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openMenu();
        }
    });

    document.addEventListener('click', (event) => {
        if (!control.contains(event.target) && !menu.hidden) closeMenu();
    });

    applyLanguage(currentLocale);
}

function setupBackToTop() {
    const button = document.getElementById('back-to-top');
    if (!button) return;

    const updateVisibility = () => {
        const isVisible = window.scrollY > 300;
        button.hidden = !isVisible;
        button.classList.toggle('visible', isVisible);
    };

    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();

    let scrollAnimationId = null;
    button.addEventListener('click', () => {
        if (scrollAnimationId !== null) {
            cancelAnimationFrame(scrollAnimationId);
            scrollAnimationId = null;
        }

        const startPosition = window.scrollY;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || startPosition === 0) {
            window.scrollTo({ top: 0, behavior: 'auto' });
            return;
        }

        const startTime = performance.now();
        const duration = Math.min(15000, Math.max(3000, (startPosition / window.innerHeight) * 2500));
        const animateScroll = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, startPosition * (1 - easedProgress));

            if (progress < 1) {
                scrollAnimationId = requestAnimationFrame(animateScroll);
            } else {
                scrollAnimationId = null;
            }
        };

        scrollAnimationId = requestAnimationFrame(animateScroll);
    });
}


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
        themeToggles.forEach(button => button.setAttribute('aria-pressed', String(isLight)));
        showNotification(translate(isLight ? 'themeLight' : 'themeDark'), 'success', 1500, 'theme-change');
    };

    // Cargar tema guardado al inicio
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
    }
    const isLight = document.body.classList.contains('light-theme');
    themeToggles.forEach(button => button.setAttribute('aria-pressed', String(isLight)));

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
            showNotification(translate('formRequired'), 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification(translate('invalidEmail'), 'error');
            return;
        }

        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.innerHTML;

        // 2. Mostrar estado de envío (Se mantiene igual)
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>${translate('sending')}`;
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
                showNotification(translate('messageSent'), 'success');
                form.reset();
                closeContactModal();
            } else {
                throw new Error('La respuesta del servidor no fue exitosa.');
            }

        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            showNotification(translate('sendFailed'), 'error');
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
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
                });

                // Cerrar menú móvil al hacer clic en un enlace
                const mobileMenu = document.getElementById("mobile-menu");
                if (!mobileMenu.classList.contains("hidden")) {
                    mobileMenu.classList.add("hidden");
                    document.getElementById("mobile-menu-btn").setAttribute("aria-expanded", "false");
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

    const setMenuOpen = (isOpen) => {
        mobileMenu.classList.toggle("hidden", !isOpen);
        mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
        mobileMenuBtn.setAttribute("aria-label", translate(isOpen ? 'closeMenu' : 'openMenu'));
        const icon = mobileMenuBtn.querySelector("i");
        icon.className = isOpen ? "fas fa-times text-lg" : "fas fa-bars text-lg";
    };

    mobileMenuBtn.addEventListener("click", () => {
        setMenuOpen(mobileMenu.classList.contains("hidden"));
    });

    document.addEventListener("click", (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            setMenuOpen(false);
        }
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMenuOpen(false));
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
function typeWriter(restart = false) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.getElementById('hero-rotating-text').textContent = translate('heroLine1');
        return;
    }
    if (isTyping && !restart) return;
    if (typingTimeoutId) clearTimeout(typingTimeoutId);
    isTyping = true;

    const texts = [
        translate('heroLine1'),
        translate('heroLine2'),
        translate('heroLine3')
    ];
    const rotatingText = document.getElementById('hero-rotating-text');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        rotatingText.textContent = currentText.substring(0, charIndex);

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

        typingTimeoutId = setTimeout(type, typeSpeed);
    }
    typingTimeoutId = setTimeout(type, restart ? 0 : 1000);
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
 * @param {number} durationMs - Tiempo visible antes de ocultar la notificación.
 * @param {string|null} notificationKey - Clave para reemplazar una notificación activa del mismo tipo.
 */
function showNotification(message, type = "info", durationMs = 3000, notificationKey = null) {
    if (notificationKey) {
        document.querySelector(`[data-notification-key="${notificationKey}"]`)?.remove();
    }

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
    notification.setAttribute('role', type === 'error' ? 'alert' : 'status');
    notification.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    notification.setAttribute('aria-atomic', 'true');
    const content = document.createElement('div');
    content.className = 'flex items-center';
    const icon = document.createElement('i');
    icon.className = `fas ${typeIcons[type]} mr-2`;
    icon.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    text.textContent = message;
    content.append(icon, text);
    notification.appendChild(content);
    if (notificationKey) {
        notification.dataset.notificationKey = notificationKey;
    }

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.remove("translate-x-full"), 100);
    setTimeout(() => {
        notification.classList.add("translate-x-full");
        setTimeout(() => notification.remove(), 300);
    }, durationMs);
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
    showNotification(translate('cvDownloaded'), 'success');
}

function openCVModal() {
    const modal = document.getElementById('cv-modal');
    lastModalTrigger = document.activeElement;
    document.getElementById('pdf-viewer').src = CV_PATH;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('close-modal').focus();
}

function closeCVModal() {
    const modal = document.getElementById('cv-modal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    if (lastModalTrigger instanceof HTMLElement) lastModalTrigger.focus();
}

function openCVInNewTab() {
    window.open(CV_PATH, '_blank', 'noopener');
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
    lastModalTrigger = document.activeElement;
    const modalContent = document.getElementById('modal-content');
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
        document.getElementById('contact-name').focus();
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
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        if (lastModalTrigger instanceof HTMLElement) lastModalTrigger.focus();
    }, 300);
}

document.addEventListener('keydown', (e) => {
    const cvModal = document.getElementById('cv-modal');
    const contactModal = document.getElementById('contact-modal');
    const modal = cvModal.classList.contains('active') ? cvModal :
        (!contactModal.classList.contains('hidden') ? contactModal : null);
    if (!modal) return;

    if (e.key === 'Escape') {
        if (modal === cvModal) closeCVModal();
        else closeContactModal();
        return;
    }

    if (e.key === 'Tab') {
        const focusable = Array.from(modal.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter((element) => element.getClientRects().length > 0);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
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
            showNotification(translate('developerMode'), "success");
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
