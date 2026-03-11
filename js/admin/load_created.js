function parseArrayField(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value !== "string" || value.trim() === "") {
        return [];
    }

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function fillTemplateFields(root, item, dbStruct) {
    Object.keys(item).forEach((field) => {
        if (field === "id") {
            root.setAttribute("data-id", item[field]);
            return;
        }

        if (!dbStruct || !dbStruct[field]) {
            return;
        }

        const value = item[field];
        const type = dbStruct[field].type;
        const fieldElement = root.querySelector(`[data-field="${field}"]`);

        if (!fieldElement) {
            return;
        }

        if (field === "video") {
            const source = fieldElement.querySelector("source");
            if (value) {
                fieldElement.style.display = "";
                if (source) {
                    source.src = value;
                }
            } else {
                fieldElement.style.display = "none";
                if (source) {
                    source.src = "";
                }
            }
            return;
        }

        if (type === "file") {
            if (fieldElement.tagName === "IMG") {
                if (value) {
                    fieldElement.src = value;
                    fieldElement.style.display = "";
                } else {
                    if (field === "avatar") {
                        fieldElement.src = "/images/icons/person.png";
                        fieldElement.style.display = "";
                    } else {
                        fieldElement.style.display = "none";
                    }
                }
            }
            return;
        }

        if (type === "array_of_images") {
            const images = parseArrayField(value);
            const src = images[0] || "";

            if (fieldElement.tagName === "IMG") {
                if (src) {
                    fieldElement.src = src;
                    fieldElement.style.display = "";
                } else {
                    fieldElement.style.display = "none";
                }
            }
            return;
        }

        fieldElement.textContent = value || "";
    });
}

function fillPreviewForEdit(previewDiv, addBlock, item, dbStruct) {
    Object.keys(item).forEach((field) => {
        if (field === "id") {
            addBlock.setAttribute("data-id", item[field]);
            return;
        }

        if (!dbStruct || !dbStruct[field]) {
            return;
        }

        const addInput = addBlock.querySelector(`[data-field="${field}"]`);
        if (addInput) {
            addInput.value = item[field] || "";
        }

        const value = item[field];
        const type = dbStruct[field].type;
        const fieldElement = previewDiv.querySelector(
            `[data-field="${field}"]`,
        );

        if (!fieldElement) {
            return;
        }

        if (field === "video") {
            const source = fieldElement.querySelector("source");
            if (value) {
                fieldElement.style.display = "";
                if (source) {
                    source.src = value;
                }
            } else {
                fieldElement.style.display = "none";
                if (source) {
                    source.src = "";
                }
            }
            return;
        }

        if (type === "file") {
            if (fieldElement.tagName === "IMG") {
                if (value) {
                    fieldElement.src = value;
                    fieldElement.style.display = "";
                } else if (field === "avatar") {
                    fieldElement.src = "/images/icons/person.png";
                    fieldElement.style.display = "";
                } else {
                    fieldElement.src = "";
                    fieldElement.style.display = "none";
                }
            }
            return;
        }

        if (type === "array_of_images") {
            const images = parseArrayField(value);
            const src = images[0] || "";

            if (fieldElement.tagName === "IMG") {
                if (src) {
                    fieldElement.src = src;
                    fieldElement.style.display = "";
                } else {
                    fieldElement.style.display = "none";
                }
            }
            return;
        }

        fieldElement.textContent = value || "";
    });
}

function initAdminCarousel(showBlock, table) {
    const carouselWrapper = showBlock.closest(".carousel-wrapper");
    if (!carouselWrapper || !window.Carousel) {
        return;
    }

    new Carousel(carouselWrapper, {
        itemsVisible: {
            mobile: 1,
            desktop: table === "main_reviews" ? 1 : 3,
        },
        ...(table === "main_reviews" ? { scrollOffset: 0 } : {}),
    });
}

async function loadElements(table) {
    const showBlock = document.querySelector("#showBlock");
    if (!showBlock) {
        return;
    }

    $.ajax({
        url: "/php/get_data.php",
        method: "POST",
        data: { table: table },
        success: async (data) => {
            const parsedData = JSON.parse(data);

            if (!parsedData || parsedData.length === 0) {
                showBlock.innerHTML = "Элементов нет";
                return;
            }

            showBlock.innerHTML = "";

            const dbStruct = await getDBStructure(table);
            const templateResponse = await fetch(`/elements/${table}.html`);
            const templateHtml = await templateResponse.text();

            const track = document.createElement("div");
            track.className = "carousel-track";

            parsedData.forEach((item) => {
                const element = document.createElement("div");
                element.className = "createdElement";

                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = templateHtml.trim();
                const card = tempDiv.firstElementChild;

                if (!card) {
                    return;
                }

                fillTemplateFields(card, item, dbStruct);

                if (card.dataset.id) {
                    element.dataset.id = card.dataset.id;
                }

                const hoverMenu = document.createElement("div");
                hoverMenu.className = "hoverMenu";

                const editButton = document.createElement("button");
                editButton.innerHTML = "Редактировать";
                editButton.onclick = () => {
                    const addBlock = document.querySelector("#addBlock");
                    const previewDiv = document.querySelector("#previewDiv");

                    if (!addBlock || !previewDiv) {
                        return;
                    }

                    fillPreviewForEdit(previewDiv, addBlock, item, dbStruct);
                };

                const deleteButton = document.createElement("button");
                deleteButton.innerHTML = "Удалить";
                deleteButton.onclick = () => {
                    $.ajax({
                        url: "/php/delete_data.php",
                        method: "POST",
                        data: {
                            table: table,
                            id: element.dataset.id,
                            login: sessionStorage.getItem("login"),
                            password: sessionStorage.getItem("password"),
                        },
                        success: () => {
                            location.reload();
                        },
                    });
                };

                hoverMenu.appendChild(editButton);
                hoverMenu.appendChild(deleteButton);

                element.appendChild(card);
                element.appendChild(hoverMenu);

                element.addEventListener("mouseenter", (event) => {
                    const hover =
                        event.currentTarget.querySelector(".hoverMenu");
                    if (hover) {
                        hover.style.display = "flex";
                    }
                });

                element.addEventListener("mouseleave", (event) => {
                    const hover =
                        event.currentTarget.querySelector(".hoverMenu");
                    if (hover) {
                        hover.style.display = "none";
                    }
                });

                track.appendChild(element);
            });

            showBlock.appendChild(track);
            initAdminCarousel(showBlock, table);
        },
    });
}
