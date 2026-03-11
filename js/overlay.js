class Lightbox {
    constructor() {
        this.overlay = null;
        this.img = null;
        this.images = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        // Создаем структуру оверлея, если её нет
        if (!document.querySelector(".lightbox-overlay")) {
            const overlayHtml = `
                <div class="lightbox-overlay" role="dialog" aria-modal="true">
                    <button class="lightbox-close" aria-label="Закрыть">&times;</button>
                    <button class="lightbox-prev" aria-label="Предыдущее фото">&#10094;</button>
                    <div class="lightbox-content">
                        <img src="" alt="">
                    </div>
                    <button class="lightbox-next" aria-label="Следующее фото">&#10095;</button>
                </div>
            `;
            document.body.insertAdjacentHTML("beforeend", overlayHtml);
        }

        this.overlay = document.querySelector(".lightbox-overlay");
        this.img = this.overlay.querySelector("img");

        this.overlay.addEventListener("click", (e) => {
            if (
                e.target === this.overlay ||
                e.target.classList.contains("lightbox-content")
            ) {
                this.close();
            }
        });

        this.overlay.querySelector(".lightbox-close").onclick = () =>
            this.close();
        this.overlay.querySelector(".lightbox-prev").onclick = () =>
            this.prev();
        this.overlay.querySelector(".lightbox-next").onclick = () =>
            this.next();

        window.addEventListener("keydown", (e) => {
            if (!this.overlay.classList.contains("active")) return;
            if (e.key === "Escape") this.close();
            if (e.key === "ArrowLeft") this.prev();
            if (e.key === "ArrowRight") this.next();
        });

        // Touch events
        let touchStartX = 0;
        this.overlay.addEventListener(
            "touchstart",
            (e) => {
                touchStartX = e.changedTouches[0].screenX;
            },
            { passive: true },
        );

        this.overlay.addEventListener(
            "touchend",
            (e) => {
                let touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) this.next();
                if (touchEndX - touchStartX > 50) this.prev();
            },
            { passive: true },
        );

        this.bindImages();
    }

    bindImages() {
        // Находим все изображения в каруселях работ
        document.addEventListener("click", (e) => {
            const target = e.target;
            if (
                target.tagName === "IMG" &&
                (target.closest(".carousel") || target.closest(".works"))
            ) {
                // Собираем все картинки из этого же контейнера для навигации
                const container =
                    target.closest(".carousel") || target.closest(".works");
                this.images = Array.from(container.querySelectorAll("img")).map(
                    (img) => img.src,
                );
                this.currentIndex = this.images.indexOf(target.src);
                this.open();
            }
        });
    }

    open() {
        this.updateImage();
        this.overlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    close() {
        this.overlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
    }

    prev() {
        this.currentIndex =
            (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
    }

    updateImage() {
        this.img.src = this.images[this.currentIndex];
    }
}

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", () => {
    new Lightbox();
});

function toggleOverlay(element, selector) {
    const overlay = element.querySelector(selector);
    if (overlay) {
        overlay.classList.toggle("active");
    }
}

function showOverlayImages(element) {
    toggleOverlay(element, ".overlayImages");
}

function showOverlayVideos(element) {
    toggleOverlay(element, ".overlayVideos");
}

function scrollGallery(container, direction) {
    if (!container) return;
    const scrollAmount = container.clientWidth;
    container.scrollBy({
        top: 0,
        left: direction * scrollAmount,
        behavior: "smooth",
    });
}

function nextImageSimple(container) {
    scrollGallery(container, 1);
}
function prevImageSimple(container) {
    scrollGallery(container, -1);
}
