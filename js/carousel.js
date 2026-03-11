class Carousel {
    constructor(container, options = {}) {
        this.container = container;
        this.trackContainer = container.querySelector(
            ".carousel-track-container",
        );
        this.track = container.querySelector(".carousel-track");
        this.prevBtn = container.querySelector(".carousel-btn--prev");
        this.nextBtn = container.querySelector(".carousel-btn--next");
        this.dotsContainer = container.querySelector(".carousel-dots");

        this.currentIndex = 0;
        this.items = [];
        this.itemsVisible = options.itemsVisible || { mobile: 1, desktop: 3 };
        this.gap = options.gap || 20;
        this.scrollOffset = options.scrollOffset || 0;
        this.totalItemWidth = 0;

        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.isDragging = false;
        this.animationId = null;

        this.init();
    }

    init() {
        this.updateItems();
        this.setupEventListeners();
        this.setupResizeObserver();
        this.update();
    }

    updateItems() {
        if (!this.track) return;
        this.items = Array.from(this.track.children);
        this.createDots();
    }

    createDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = "";
        const dotsCount = Math.min(this.items.length, 50);

        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement("button");
            dot.classList.add("carousel-dot");
            dot.setAttribute("aria-label", `Слайд ${i + 1}`);
            dot.addEventListener("click", () => this.goTo(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    getVisibleCount() {
        return window.innerWidth < 769
            ? this.itemsVisible.mobile
            : this.itemsVisible.desktop;
    }

    getItemWidth() {
        const containerWidth = this.trackContainer
            ? this.trackContainer.offsetWidth
            : this.container.offsetWidth;
        const visibleCount = this.getVisibleCount();
        const gap = this.gap;
        return (containerWidth - gap * (visibleCount - 1)) / visibleCount;
    }

    getMaxIndex() {
        return Math.max(0, this.items.length - this.getVisibleCount());
    }

    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener("click", () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener("click", () => this.next());
        }

        if (!this.track) return;

        // Touch events
        this.track.addEventListener("touchstart", (e) => this.onDragStart(e), {
            passive: true,
        });
        this.track.addEventListener("touchmove", (e) => this.onDragMove(e), {
            passive: false,
        });
        this.track.addEventListener("touchend", () => this.onDragEnd());

        // Mouse events (desktop drag)
        this.track.addEventListener("mousedown", (e) => this.onDragStart(e));
        this.track.addEventListener("mousemove", (e) => this.onDragMove(e));
        this.track.addEventListener("mouseup", () => this.onDragEnd());
        this.track.addEventListener("mouseleave", () => {
            if (this.isDragging) this.onDragEnd();
        });

        // Prevent image dragging
        this.track.addEventListener("dragstart", (e) => e.preventDefault());
    }

    setupResizeObserver() {
        const ro = new ResizeObserver(() => {
            this.update();
        });
        ro.observe(this.container);
    }

    onDragStart(e) {
        this.isDragging = true;
        this.startX = this.getPointerX(e);
        this.track.style.transition = "none";
    }

    onDragMove(e) {
        if (!this.isDragging) return;
        const currentX = this.getPointerX(e);
        const diff = currentX - this.startX;

        if (Math.abs(diff) > 5 && e.cancelable) {
            e.preventDefault();
        }

        const translate = this.prevTranslate + diff;
        this.applyTranslate(translate);
    }

    onDragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;

        const movedBy = this.currentTranslate - this.prevTranslate;
        const totalItemWidth =
            this.totalItemWidth || this.getItemWidth() + this.gap;
        const threshold = totalItemWidth / 3;

        if (movedBy < -threshold && this.currentIndex < this.getMaxIndex()) {
            this.currentIndex++;
        } else if (movedBy > threshold && this.currentIndex > 0) {
            this.currentIndex--;
        }

        this.update();
    }

    getPointerX(e) {
        return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    }

    applyTranslate(translate) {
        const totalItemWidth =
            this.totalItemWidth || this.getItemWidth() + this.gap;
        const maxTranslate = 0;
        const minTranslate =
            -this.getMaxIndex() * totalItemWidth +
            this.getMaxIndex() * this.scrollOffset;

        this.currentTranslate = Math.max(
            minTranslate,
            Math.min(maxTranslate, translate),
        );
        if (this.track) {
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        }
    }

    update() {
        if (!this.track || this.items.length === 0) return;

        const gap = this.gap;
        const itemWidth = this.getItemWidth();

        this.items.forEach((item) => {
            const style = window.getComputedStyle(item);
            const marginLeft = parseFloat(style.marginLeft) || 0;
            const marginRight = parseFloat(style.marginRight) || 0;
            item.style.width = `${itemWidth - marginLeft - marginRight}px`;
            item.style.flexShrink = "0";
        });

        const firstItem = this.items[0];
        const firstItemStyle = window.getComputedStyle(firstItem);
        const marginLeft = parseFloat(firstItemStyle.marginLeft) || 0;
        const marginRight = parseFloat(firstItemStyle.marginRight) || 0;
        this.totalItemWidth =
            firstItem.getBoundingClientRect().width +
            marginLeft +
            marginRight +
            gap;

        const maxIndex = this.getMaxIndex();
        this.currentIndex = Math.max(0, Math.min(this.currentIndex, maxIndex));

        const translate =
            -this.currentIndex * this.totalItemWidth +
            this.currentIndex * this.scrollOffset;
        this.track.style.transition = "transform 0.3s ease-out";
        this.applyTranslate(translate);
        this.prevTranslate = this.currentTranslate;

        this.updateButtons();
        this.updateDots();
    }

    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex <= 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= this.getMaxIndex();
        }
    }

    updateDots() {
        if (!this.dotsContainer) return;
        const dots = this.dotsContainer.querySelectorAll(".carousel-dot");
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === this.currentIndex);
        });
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.update();
        }
    }

    next() {
        if (this.currentIndex < this.getMaxIndex()) {
            this.currentIndex++;
            this.update();
        }
    }

    goTo(index) {
        const maxIndex = this.getMaxIndex();
        this.currentIndex = Math.max(0, Math.min(index, maxIndex));
        this.update();
    }
}

window.Carousel = Carousel;
