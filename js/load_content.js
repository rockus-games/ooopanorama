async function getDBStructure(table) {
    const response = await fetch("/json/db_structure.json");
    const data = await response.json();
    return data[table];
}

async function loadElements(containerSelector, table) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    try {
        // 1. Загружаем данные, структуру и шаблон параллельно
        const [dataResponse, dbStruct, templateResponse] = await Promise.all([
            fetch("/php/get_data.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `table=${table}`,
            }),
            getDBStructure(table),
            fetch(`/elements/${table}.html`),
        ]);

        const data = await dataResponse.json();
        if (!data || data.length === 0) return;

        const templateHtml = await templateResponse.text();

        // 2. Очищаем контейнер и создаём track
        container.innerHTML = "";
        const track = document.createElement("div");
        track.className = "carousel-track";

        // 3. Рендерим карточки
        data.forEach((item) => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = templateHtml.trim();
            const card = tempDiv.firstElementChild;

            Object.keys(item).forEach((field) => {
                if (field === "id") {
                    card.dataset.id = item[field];
                    return;
                }

                if (!dbStruct || !dbStruct[field]) return;

                const element = card.querySelector(`[data-field="${field}"]`);
                if (!element) return;

                const value = item[field];
                const type = dbStruct[field].type;

                if (field === "video") {
                    if (value) {
                        element.style.display = "";
                        const source = element.querySelector("source");
                        if (source) source.src = value;
                    }
                    return;
                }

                if (type === "file" || type === "array_of_images") {
                    const src = Array.isArray(value) ? value[0] : value;
                    if (src && element.tagName === "IMG") {
                        element.src = src;
                    } else if (element.tagName === "IMG") {
                        element.style.display = "none";
                    }
                } else {
                    element.textContent = value || "";
                }
            });

            track.appendChild(card);
        });

        container.appendChild(track);

        // 4. Инициализируем карусель
        const carouselWrapper = container.closest(".carousel-wrapper");
        if (carouselWrapper && window.Carousel) {
            new Carousel(carouselWrapper, {
                itemsVisible: {
                    mobile: 1,
                    desktop: table === "main_reviews" ? 1 : 3,
                },
                ...(table === "main_reviews" ? { scrollOffset: 0 } : {}),
            });
        }
    } catch (error) {
        console.error(`Ошибка загрузки ${table}:`, error);
    }
}

window.loadElements = loadElements;
