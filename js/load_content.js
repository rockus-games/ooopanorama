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

        const parseMediaList = (rawValue) => {
            if (Array.isArray(rawValue)) {
                return rawValue
                    .map((item) => String(item || "").trim())
                    .filter(Boolean);
            }

            if (typeof rawValue === "string") {
                const trimmed = rawValue.trim();
                if (!trimmed) return [];

                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) {
                        return parsed
                            .map((item) => String(item || "").trim())
                            .filter(Boolean);
                    }
                } catch {
                    // ignore JSON parse error and treat as single path
                }

                return [trimmed];
            }

            if (rawValue) {
                const normalized = String(rawValue).trim();
                return normalized ? [normalized] : [];
            }

            return [];
        };

        // 3. Рендерим карточки
        data.forEach((item) => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = templateHtml.trim();
            const card = tempDiv.firstElementChild;
            let reviewVideoSrc = "";

            Object.keys(item).forEach((field) => {
                if (field === "id") {
                    card.dataset.id = item[field];
                    return;
                }

                const value = item[field];

                if (
                    table === "main_prices" &&
                    (field === "images" || field === "image")
                ) {
                    const element = card.querySelector('[data-field="images"]');
                    if (!element) return;

                    const imageList = parseMediaList(value);

                    if (imageList.length > 0) {
                        element.innerHTML = "";
                        imageList.forEach((src, index) => {
                            const img = document.createElement("img");
                            img.className = "price-card__image";
                            img.src = src;
                            img.alt = `${item.name || "Изображение"} ${index + 1}`;
                            img.loading = "lazy";
                            element.appendChild(img);
                        });
                    }
                    return;
                }

                if (table === "main_reviews" && field === "photos") {
                    const element = card.querySelector('[data-field="photos"]');
                    if (!element) return;

                    const photoList = parseMediaList(value);
                    element.innerHTML = "";

                    if (photoList.length > 0) {
                        photoList.forEach((src, index) => {
                            const img = document.createElement("img");
                            img.className = "review-card__photo";
                            img.src = src;
                            img.alt = `${item.name || "Фото отзыва"} ${index + 1}`;
                            img.loading = "lazy";
                            element.appendChild(img);
                        });
                    }
                    return;
                }

                if (table === "main_reviews" && field === "video") {
                    reviewVideoSrc = parseMediaList(value)[0] || "";
                    return;
                }

                if (!dbStruct || !dbStruct[field]) return;

                const element = card.querySelector(`[data-field="${field}"]`);
                if (!element) return;

                const type = dbStruct[field].type;

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

            if (table === "main_reviews" && reviewVideoSrc) {
                const photosContainer = card.querySelector(
                    '[data-field="photos"]',
                );
                if (photosContainer) {
                    const videoWrapper = document.createElement("div");
                    videoWrapper.className = "review-card__video";

                    const video = document.createElement("video");
                    video.className = "review-card__video-player";
                    video.controls = true;
                    video.preload = "metadata";
                    video.playsInline = true;

                    const source = document.createElement("source");
                    source.src = reviewVideoSrc;
                    source.type = "video/mp4";

                    video.appendChild(source);
                    videoWrapper.appendChild(video);
                    photosContainer.appendChild(videoWrapper);
                }
            }

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
