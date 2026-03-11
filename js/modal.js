class Modal {
    constructor(modalSelector) {
        this.modal = document.querySelector(modalSelector);
        this.openedBy = null;
        this.focusableElements =
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        this.firstFocusableElement = null;
        this.lastFocusableElement = null;

        if (this.modal) {
            this.init();
        }
    }

    init() {
        // Закрытие по клику на backdrop
        this.modal.addEventListener("click", (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Обработка клавиш (Esc и Tab)
        window.addEventListener("keydown", (e) => {
            if (!this.modal.classList.contains("modal--open")) return;

            if (e.key === "Escape") {
                this.close();
            }

            if (e.key === "Tab") {
                this.handleFocusTrap(e);
            }
        });
    }

    open() {
        this.openedBy = document.activeElement;
        this.modal.classList.add("modal--open");
        document.body.style.overflow = "hidden";

        this.updateFocusableElements();
        if (this.firstFocusableElement) {
            this.firstFocusableElement.focus();
        }
    }

    close() {
        this.modal.classList.remove("modal--open");
        document.body.style.overflow = "";

        if (this.openedBy) {
            this.openedBy.focus();
        }
    }

    updateFocusableElements() {
        const elements = this.modal.querySelectorAll(this.focusableElements);
        this.firstFocusableElement = elements[0];
        this.lastFocusableElement = elements[elements.length - 1];
    }

    handleFocusTrap(e) {
        this.updateFocusableElements();

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === this.firstFocusableElement) {
                this.lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            // Tab
            if (document.activeElement === this.lastFocusableElement) {
                this.firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }
}

// Инициализация глобального экземпляра для основной модалки
const mainModal = new Modal(".modal");

function toggleModal() {
    if (mainModal.modal.classList.contains("modal--open")) {
        mainModal.close();
    } else {
        mainModal.open();
    }
}
