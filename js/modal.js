class Modal {
    constructor(modalSelector) {
        this.modalSelector = modalSelector;
        this.modal = document.querySelector(modalSelector);
        this.openedBy = null;
        this.focusableElements =
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        this.firstFocusableElement = null;
        this.lastFocusableElement = null;
        this.isInitialized = false;

        if (this.modal) {
            this.init();
        } else {
            console.warn(
                `[modal] Модальное окно не найдено при инициализации: ${this.modalSelector}`,
            );
        }

        document.addEventListener("DOMContentLoaded", () => {
            this.ensureModal();
        });
    }

    init() {
        if (!this.modal || this.isInitialized) return;

        this.isInitialized = true;

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

    ensureModal() {
        if (!this.modal) {
            this.modal = document.querySelector(this.modalSelector);

            if (this.modal) {
                console.info(
                    `[modal] Модальное окно найдено после готовности DOM: ${this.modalSelector}`,
                );
                this.init();
            }
        }

        return this.modal;
    }

    open() {
        if (!this.ensureModal()) {
            console.error(
                `[modal] Не удалось открыть модалку: селектор ${this.modalSelector} не найден`,
            );
            return;
        }

        this.openedBy = document.activeElement;
        this.modal.classList.add("modal--open");
        document.body.style.overflow = "hidden";

        this.updateFocusableElements();
        if (this.firstFocusableElement) {
            this.firstFocusableElement.focus();
        }
    }

    close() {
        if (!this.ensureModal()) {
            console.error(
                `[modal] Не удалось закрыть модалку: селектор ${this.modalSelector} не найден`,
            );
            return;
        }

        this.modal.classList.remove("modal--open");
        document.body.style.overflow = "";

        if (this.openedBy) {
            this.openedBy.focus();
        }
    }

    updateFocusableElements() {
        if (!this.modal) return;

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
    const modalElement = mainModal.ensureModal();

    if (!modalElement) {
        console.error(
            "[modal] toggleModal вызван, но модальное окно отсутствует в DOM",
        );
        return;
    }

    if (modalElement.classList.contains("modal--open")) {
        mainModal.close();
    } else {
        mainModal.open();
    }
}
