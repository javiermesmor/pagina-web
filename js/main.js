/**
 * PORTFOLIO DE JAVIER MESONERO MORO - MAIN.JS (Modern Web Baseline)
 */

let isTyping = false;
let currentProject = 0;
const galleryCurrentIndex = {};
let currentLocale = 'es';
let typingTimeoutId = null;

const CV_PATH = 'assets/pdf/CV Javi.pdf';

function translate(key) {
    return window.portfolioI18n.translate(key, currentLocale);
}

/**
 * Helper para aplicar cambios de estado con View Transitions API si está disponible
 */
function runWithViewTransition(callback) {
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.startViewTransition(callback);
    } else {
        callback();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupLanguageSelector();
    setupRandomMotivationalQuote();
    setupIntersectionObserver();
    setupSmoothScrolling();
    setupNavbarScrollEffect();
    setupBackToTop();
    setupMobileMenu();
    setupContactForm();
    setupThemeToggle();
    setupNativeDialogs();
    setupCarouselAndGalleries();
    setupEasterEgg();

    setTimeout(() => typeWriter(), 1500);
    observeCounters();
});

function setupRandomMotivationalQuote() {
    const quote = document.getElementById('motivational-quote');
    if (!quote) return;

    const quoteIndex = Math.floor(Math.random() * 5) + 1;
    quote.dataset.i18n = `motivationalQuote${quoteIndex}`;
    quote.textContent = translate(quote.dataset.i18n);
}

/**
 * Selector de idioma apoyado en Popover API nativa (popover="auto")
 */
function setupLanguageSelector() {
    const menu = document.getElementById('language-menu');
    const menuButton = document.getElementById('language-menu-button');
    const languageOptions = Array.from(menu.querySelectorAll('[data-locale]'));

    currentLocale = localStorage.getItem('portfolio-language') || 'es';
    if (!window.portfolioI18n.locales.includes(currentLocale)) {
        currentLocale = 'es';
    }

    const applyLanguage = (locale) => {
        currentLocale = locale;
        document.documentElement.lang = locale;

        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const value = translate(element.dataset.i18n);
            const textNodes = Array.from(element.childNodes).filter(
                (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()
            );

            if (textNodes.length === 1) {
                const textNode = textNodes[0];
                const leading = textNode.nodeValue.match(/^\s*/)[0];
                const trailing = textNode.nodeValue.match(/\s*$/)[0];
                textNode.nodeValue = `${leading}${value}${trailing}`;
            } else if (textNodes.length === 0) {
                element.textContent = value;
            }
        });

        document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
            el.setAttribute('aria-label', translate(el.dataset.i18nAriaLabel));
        });
        document.querySelectorAll('[data-i18n-title]').forEach((el) => {
            el.setAttribute('title', translate(el.dataset.i18nTitle));
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            el.setAttribute('placeholder', translate(el.dataset.i18nPlaceholder));
        });
        document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
            el.setAttribute('alt', translate(el.dataset.i18nAlt));
        });

        const selectedOption = languageOptions.find((opt) => opt.dataset.locale === locale);
        document.getElementById('current-language').textContent =
            selectedOption.querySelector('.language-name').textContent;

        languageOptions.forEach((option) => {
            const isSelected = option.dataset.locale === locale;
            option.setAttribute('aria-checked', String(isSelected));
            option.classList.toggle('selected', isSelected);
        });

        localStorage.setItem('portfolio-language', locale);
        if (isTyping) typeWriter(true);
    };

    // Evento nativo 'toggle' del Popover API para enfocar la opción activa
    menu.addEventListener('toggle', (event) => {
        if (event.newState === 'open') {
            const selected = languageOptions.find((opt) => opt.dataset.locale === currentLocale);
            selected?.focus();
        }
    });

    languageOptions.forEach((option, index) => {
        option.addEventListener('click', () => {
            runWithViewTransition(() => applyLanguage(option.dataset.locale));
            menu.hidePopover();
            menuButton.focus();
        });

        option.addEventListener('keydown', (event) => {
            let nextIndex = index;
            if (event.key === 'ArrowDown') nextIndex = (index + 1) % languageOptions.length;
            else if (event.key === 'ArrowUp') nextIndex = (index - 1 + languageOptions.length) % languageOptions.length;
            else if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = languageOptions.length - 1;
            else return;

            event.preventDefault();
            languageOptions[nextIndex].focus();
        });
    });

    applyLanguage(currentLocale);
}

/**
 * Toggle de tema con View Transitions API
 */
function setupThemeToggle() {
    const themeToggles = document.querySelectorAll('[data-theme-toggle]');

    const updatePressedState = () => {
        const isLight = document.body.classList.contains('light-theme');
        themeToggles.forEach((btn) => btn.setAttribute('aria-pressed', String(isLight)));
    };

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
    }
    updatePressedState();

    themeToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            runWithViewTransition(() => {
                document.body.classList.toggle('light-theme');
                const isLight = document.body.classList.contains('light-theme');
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
                updatePressedState();
                showNotification(translate(isLight ? 'themeLight' : 'themeDark'), 'success', 1500, 'theme-change');
            });
        });
    });
}

/**
 * Modales nativos <dialog> (.showModal() y .close())
 */
function setupNativeDialogs() {
    document.querySelectorAll('[data-open-dialog]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const dialogId = trigger.dataset.openDialog;
            const dialog = document.getElementById(dialogId);
            if (!dialog) return;

            if (dialogId === 'cv-modal') {
                const viewer = document.getElementById('pdf-viewer');
                if (viewer && !viewer.src) viewer.src = CV_PATH;
            }

            dialog.showModal();
        });
    });

    document.querySelectorAll('[data-close-dialog]').forEach((closeBtn) => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('dialog')?.close();
        });
    });

    document.getElementById('download-cv-btn')?.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = CV_PATH;
        link.download = 'CV_Javier_Mesonero_Moro.pdf';
        link.click();
        showNotification(translate('cvDownloaded'), 'success');
    });

    document.getElementById('open-new-tab-btn')?.addEventListener('click', () => {
        window.open(CV_PATH, '_blank', 'noopener,noreferrer');
        document.getElementById('cv-modal')?.close();
    });
}

/**
 * Menú móvil controlado por Popover API nativa
 */
function setupMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (!mobileMenu || !mobileMenuBtn) return;

    mobileMenu.addEventListener('toggle', (event) => {
        const isOpen = event.newState === 'open';
        mobileMenuBtn.setAttribute('aria-label', translate(isOpen ? 'closeMenu' : 'openMenu'));
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = isOpen ? 'fas fa-times text-lg' : 'fas fa-bars text-lg';
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => mobileMenu.hidePopover());
    });
}

/**
 * Formulario de contacto con AbortController para evitar bloqueos de red
 */
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const subject = String(formData.get('subject') || '').trim();
        const message = String(formData.get('message') || '').trim();

        if (!name || !email || !subject || !message) {
            showNotification(translate('formRequired'), 'error');
            return;
        }

        const submitBtn = document.getElementById('submit-btn');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>${translate('sending')}`;
        submitBtn.disabled = true;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch('/api/enviar-correo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    subject,
                    from_name: name,
                    from_email: email,
                    message,
                    reply_to: email
                })
            });

            if (!response.ok) throw new Error('Error HTTP');

            showNotification(translate('messageSent'), 'success');
            form.reset();
            document.getElementById('contact-modal')?.close();
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            showNotification(translate('sendFailed'), 'error');
        } finally {
            clearTimeout(timeoutId);
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    });
}

/**
 * Delegación de eventos para carrusel y galerías (sin onclick inline)
 */
function setupCarouselAndGalleries() {
    document.querySelectorAll('.gallery-container').forEach((container) => {
        galleryCurrentIndex[container.id] = 0;
        showImage(container.id, 0);
    });

    document.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;

        if (target.hasAttribute('data-carousel-prev')) {
            const total = document.getElementById('project-carousel').children.length;
            currentProject = (currentProject - 1 + total) % total;
            updateCarousel();
        } else if (target.hasAttribute('data-carousel-next')) {
            const total = document.getElementById('project-carousel').children.length;
            currentProject = (currentProject + 1) % total;
            updateCarousel();
        } else if (target.hasAttribute('data-carousel-goto')) {
            currentProject = Number(target.dataset.carouselGoto);
            updateCarousel();
        } else if (target.hasAttribute('data-gallery-prev')) {
            const id = target.dataset.galleryPrev;
            const total = document.getElementById(id).querySelectorAll('.gallery-image').length;
            showImage(id, ((galleryCurrentIndex[id] || 0) - 1 + total) % total);
        } else if (target.hasAttribute('data-gallery-next')) {
            const id = target.dataset.galleryNext;
            const total = document.getElementById(id).querySelectorAll('.gallery-image').length;
            showImage(id, ((galleryCurrentIndex[id] || 0) + 1) % total);
        } else if (target.hasAttribute('data-gallery-goto')) {
            showImage(target.dataset.galleryGoto, Number(target.dataset.index));
        }
    });
}

function updateCarousel() {
    const carousel = document.getElementById('project-carousel');
    carousel.style.transform = `translateX(-${currentProject * 100}%)`;
    document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentProject);
    });
}

function showImage(galleryId, index) {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;
    const images = gallery.querySelectorAll('.gallery-image');
    const dots = gallery.parentElement.querySelectorAll('.gallery-dot');

    images.forEach((img, i) => img.classList.toggle('hidden', i !== index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    galleryCurrentIndex[galleryId] = index;
}

function setupIntersectionObserver() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach((el) => observer.observe(el));
}

function setupSmoothScrolling() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const offsetPosition = target.offsetTop - 80;
            window.scrollTo({
                top: offsetPosition,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    });
}

function setupNavbarScrollEffect() {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    window.addEventListener(
        'scroll',
        () => {
            const scrollTop = window.scrollY;
            navbar.classList.toggle('scrolled', scrollTop > 50);
            navbar.style.transform = scrollTop > lastScrollTop && scrollTop > 100 ? 'translateY(-100%)' : 'translateY(0)';
            lastScrollTop = scrollTop;
        },
        { passive: true }
    );
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

    button.addEventListener('click', () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
}

function typeWriter(restart = false) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.getElementById('hero-rotating-text').textContent = translate('heroLine1');
        return;
    }
    if (isTyping && !restart) return;
    if (typingTimeoutId) clearTimeout(typingTimeoutId);
    isTyping = true;

    const texts = [translate('heroLine1'), translate('heroLine2'), translate('heroLine3')];
    const rotatingText = document.getElementById('hero-rotating-text');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        rotatingText.textContent = currentText.substring(0, charIndex);

        let typeSpeed = isDeleting ? 45 : 90;
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        charIndex += isDeleting ? -1 : 1;
        typingTimeoutId = setTimeout(type, typeSpeed);
    }

    typingTimeoutId = setTimeout(type, restart ? 0 : 1000);
}

function observeCounters() {
    const statsSection = document.querySelector('#estadisticas');
    if (!statsSection) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.counter').forEach((counter) => {
                        const target = Number(counter.dataset.target);
                        const increment = target / 120;
                        let current = 0;
                        const update = () => {
                            if (current < target) {
                                current += increment;
                                counter.textContent = String(Math.ceil(current));
                                requestAnimationFrame(update);
                            } else {
                                counter.textContent = String(target);
                            }
                        };
                        update();
                    });
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    observer.observe(statsSection);
}

function showNotification(message, type = 'info', durationMs = 3000, notificationKey = null) {
    if (notificationKey) {
        document.querySelector(`[data-notification-key="${notificationKey}"]`)?.remove();
    }

    const typeClasses = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600' };
    const typeIcons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };

    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${typeClasses[type]} text-white`;
    notification.setAttribute('role', type === 'error' ? 'alert' : 'status');
    notification.innerHTML = `<div class="flex items-center"><i class="fas ${typeIcons[type]} mr-2" aria-hidden="true"></i><span></span></div>`;
    notification.querySelector('span').textContent = message;

    if (notificationKey) notification.dataset.notificationKey = notificationKey;
    document.body.appendChild(notification);

    requestAnimationFrame(() => notification.classList.remove('translate-x-full'));
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, durationMs);
}

function setupEasterEgg() {
    const konamiCode = ['ArrowUp', 'ArrowDown', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let userInput = [];

    document.addEventListener('keydown', (e) => {
        userInput.push(e.code);
        if (userInput.length > konamiCode.length) userInput.shift();

        if (userInput.join(',') === konamiCode.join(',')) {
            document.body.style.filter = 'hue-rotate(180deg)';
            showNotification(translate('developerMode'), 'success');
            setTimeout(() => (document.body.style.filter = 'none'), 30000);
            userInput = [];
        }
    });
}