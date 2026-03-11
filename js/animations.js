/**
 * ScrollAnimator - класс для управления анимациями при скролле и другими визуальными эффектами.
 */
class ScrollAnimator {
    constructor() {
        this.options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.1,
        };

        this.observer = new IntersectionObserver(
            this._handleIntersect.bind(this),
            this.options,
        );
        this._init();
    }

    _init() {
        // Проверка предпочтений пользователя (уменьшение движения)
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        // Инициализация анимаций появления
        const animatedElements = document.querySelectorAll("[data-animate]");
        animatedElements.forEach((el) => {
            this.observer.observe(el);
        });

        // Инициализация счетчиков
        const counterElements = document.querySelectorAll("[data-counter]");
        if (counterElements.length > 0) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this._animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, this.options);

            counterElements.forEach((el) => counterObserver.observe(el));
        }

        // Плавный скролл для якорных ссылок
        this._initSmoothScroll();
    }

    _handleIntersect(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute("data-delay") || 0;

                setTimeout(() => {
                    el.classList.add("animated");
                }, delay);

                // Анимация срабатывает один раз
                this.observer.unobserve(el);
            }
        });
    }

    _animateCounter(el) {
        const target = parseInt(el.getAttribute("data-counter"));
        const duration = 2000; // 2 секунды
        const stepTime = Math.abs(Math.floor(duration / target));
        let current = 0;

        const timer = setInterval(() => {
            current += 1;
            el.textContent = current;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            }
        }, stepTime);
    }

    _initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                const href = this.getAttribute("href");
                if (href === "#") return;

                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                    });
                }
            });
        });
    }
}

// Инициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
    window.scrollAnimator = new ScrollAnimator();
});
