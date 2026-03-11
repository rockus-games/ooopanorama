(function () {
    const MOBILE_QUERY = "(max-width: 767px)";
    const CORNER_RADIUS = 18;
    const EDGE_GAP = 8;
    const OUTER_GAP = 26;

    function fmt(value) {
        return Number(value.toFixed(2));
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function makePoint(x, y) {
        return { x: fmt(x), y: fmt(y) };
    }

    function toLocalRect(element, originRect) {
        const rect = element.getBoundingClientRect();
        return {
            left: rect.left - originRect.left,
            right: rect.right - originRect.left,
            top: rect.top - originRect.top,
            bottom: rect.bottom - originRect.top,
            width: rect.width,
            height: rect.height,
            cx: rect.left - originRect.left + rect.width / 2,
            cy: rect.top - originRect.top + rect.height / 2,
        };
    }

    function roundedOrthogonalPath(points, radius) {
        const pts = points.filter(Boolean);
        if (pts.length < 2) return "";

        let d = `M ${pts[0].x} ${pts[0].y}`;

        for (let i = 1; i < pts.length; i += 1) {
            const prev = pts[i - 1];
            const current = pts[i];
            const next = pts[i + 1];

            if (!next) {
                d += ` L ${current.x} ${current.y}`;
                continue;
            }

            const v1x = current.x - prev.x;
            const v1y = current.y - prev.y;
            const v2x = next.x - current.x;
            const v2y = next.y - current.y;
            const len1 = Math.hypot(v1x, v1y);
            const len2 = Math.hypot(v2x, v2y);

            const isStraight =
                (Math.abs(v1x) < 0.01 && Math.abs(v2x) < 0.01) ||
                (Math.abs(v1y) < 0.01 && Math.abs(v2y) < 0.01);

            if (len1 < 0.5 || len2 < 0.5 || isStraight) {
                d += ` L ${current.x} ${current.y}`;
                continue;
            }

            const cut = Math.min(radius, len1 / 2, len2 / 2);
            const inPoint = makePoint(
                current.x - Math.sign(v1x) * cut,
                current.y - Math.sign(v1y) * cut,
            );
            const outPoint = makePoint(
                current.x + Math.sign(v2x) * cut,
                current.y + Math.sign(v2y) * cut,
            );

            const cross = v1x * v2y - v1y * v2x;
            const sweep = cross > 0 ? 1 : 0;

            d += ` L ${inPoint.x} ${inPoint.y}`;
            d += ` A ${fmt(cut)} ${fmt(cut)} 0 0 ${sweep} ${outPoint.x} ${outPoint.y}`;
        }

        return d;
    }

    function collectElements() {
        const section = document.querySelector(".simpleSteps");
        if (!section) return null;

        const title = section.querySelector("h1.titleText");
        const flow = section.querySelector(".stepsFlow");
        const benefits = section.querySelector(".stepsBenefits");
        const svg = flow?.querySelector(".stepsConnectorsSvg");

        const cards = [
            flow?.querySelector(".stepCard--1"),
            flow?.querySelector(".stepCard--2"),
            flow?.querySelector(".stepCard--3"),
            flow?.querySelector(".stepCard--4"),
        ];

        const texts = cards.map((card) =>
            card?.querySelector(".stepCard__text"),
        );
        const icons = cards.map((card) =>
            card?.querySelector(".stepCard__icon"),
        );
        const cta = cards[0]?.querySelector(".stepCard__cta");

        const mainPath = flow?.querySelector(".stepsConnectorsSvg__path--12");
        const extraPath23 = flow?.querySelector(
            ".stepsConnectorsSvg__path--23",
        );
        const extraPath34 = flow?.querySelector(
            ".stepsConnectorsSvg__path--34",
        );

        if (
            !title ||
            !flow ||
            !benefits ||
            !svg ||
            cards.some((card) => !card) ||
            texts.some((text) => !text) ||
            icons.some((icon) => !icon) ||
            !cta ||
            !mainPath ||
            !extraPath23 ||
            !extraPath34
        ) {
            return null;
        }

        return {
            title,
            flow,
            benefits,
            svg,
            cards,
            texts,
            icons,
            cta,
            mainPath,
            extraPath23,
            extraPath34,
        };
    }

    function buildDesktopPoints(metrics) {
        const {
            flowRect,
            titleRect,
            benefitsRect,
            cardRects,
            textRects,
            ctaRect,
        } = metrics;

        const leftEdge = EDGE_GAP;
        const rightEdge = flowRect.width - EDGE_GAP;
        const centerX = flowRect.width / 2;

        const startY = titleRect.bottom;
        const headerDropY = startY + 18;

        const row1Bottom = Math.max(cardRects[0].bottom, cardRects[1].bottom);
        const row2Top = Math.min(cardRects[2].top, cardRects[3].top);
        const rowGapMidY = row1Bottom + (row2Top - row1Bottom) / 2;

        const belowFirstButtonY = Math.max(
            ctaRect.bottom + 16,
            textRects[0].bottom + 18,
            row1Bottom + 12,
        );

        const laneAfterTopRowY = clamp(
            rowGapMidY + 80,
            belowFirstButtonY + 76,
            row2Top - 16,
        );

        const belowThirdTextY = Math.max(
            textRects[2].bottom + 14,
            textRects[3].bottom + 14,
        );
        const laneBeforeBenefitsY = Math.min(
            belowThirdTextY,
            benefitsRect.top - 26,
        );
        const finalY = benefitsRect.top - 10;

        return [
            makePoint(titleRect.cx, startY),
            makePoint(titleRect.cx, headerDropY),
            makePoint(leftEdge, headerDropY),
            makePoint(leftEdge, belowFirstButtonY),
            makePoint(rightEdge, belowFirstButtonY),
            makePoint(rightEdge, laneAfterTopRowY),
            makePoint(leftEdge, laneAfterTopRowY),
            makePoint(leftEdge, laneBeforeBenefitsY),
            makePoint(centerX, laneBeforeBenefitsY),
            makePoint(centerX, finalY),
        ];
    }

    function buildMobilePoints(metrics) {
        const { flowRect, titleRect, benefitsRect, cardRects, textRects } =
            metrics;

        const centerX = flowRect.width / 2;
        const minX = EDGE_GAP;
        const maxX = flowRect.width - EDGE_GAP;

        const points = [];
        const startY = titleRect.bottom;
        const firstEntryY = textRects[0].top - 16;

        points.push(makePoint(titleRect.cx, startY));
        points.push(makePoint(titleRect.cx, startY + 16));
        points.push(makePoint(centerX, firstEntryY));

        for (let i = 0; i < cardRects.length; i += 1) {
            const textRect = textRects[i];
            const cardRect = cardRects[i];
            const goLeft = i % 2 === 0;

            const outsideX = goLeft
                ? clamp(textRect.left - OUTER_GAP, minX, maxX)
                : clamp(textRect.right + OUTER_GAP, minX, maxX);

            const aroundTopY = textRect.top - 6;
            const aroundBottomY = cardRect.bottom + 10;

            points.push(makePoint(centerX, aroundTopY));
            points.push(makePoint(outsideX, aroundTopY));
            points.push(makePoint(outsideX, aroundBottomY));
            points.push(makePoint(centerX, aroundBottomY));

            if (i < cardRects.length - 1) {
                points.push(makePoint(centerX, textRects[i + 1].top - 16));
            }
        }

        points.push(makePoint(centerX, benefitsRect.bottom));

        // points.push(makePoint(centerX + 30, benefitsRect.top - 10));
        // points.push(makePoint(centerX - 5, benefitsRect.top + 40));
        return points;
    }

    function applyPathStyle(path) {
        path.setAttribute("stroke", "#4b7b9e");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("stroke-dasharray", "8 6");
        path.setAttribute("fill", "none");
    }

    function drawStepsConnectors() {
        const els = collectElements();
        if (!els) return;

        const flowRect = els.flow.getBoundingClientRect();
        if (flowRect.width < 10 || flowRect.height < 10) return;

        const titleRect = toLocalRect(els.title, flowRect);
        const benefitsRect = toLocalRect(els.benefits, flowRect);
        const cardRects = els.cards.map((item) => toLocalRect(item, flowRect));
        const textRects = els.texts.map((item) => toLocalRect(item, flowRect));
        const ctaRect = toLocalRect(els.cta, flowRect);

        els.svg.setAttribute(
            "viewBox",
            `0 0 ${fmt(flowRect.width)} ${fmt(flowRect.height)}`,
        );
        els.svg.setAttribute("preserveAspectRatio", "none");

        const metrics = {
            flowRect,
            titleRect,
            benefitsRect,
            cardRects,
            textRects,
            ctaRect,
        };

        const points = window.matchMedia(MOBILE_QUERY).matches
            ? buildMobilePoints(metrics)
            : buildDesktopPoints(metrics);

        const d = roundedOrthogonalPath(points, CORNER_RADIUS);

        applyPathStyle(els.mainPath);
        els.mainPath.setAttribute("d", d);
        els.extraPath23.setAttribute("d", "");
        els.extraPath34.setAttribute("d", "");
    }

    let rafId = null;
    function scheduleDraw() {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function () {
            drawStepsConnectors();
            rafId = null;
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        scheduleDraw();
        setTimeout(scheduleDraw, 120);
        setTimeout(scheduleDraw, 360);

        window.addEventListener("resize", scheduleDraw, { passive: true });
        window.addEventListener("orientationchange", scheduleDraw, {
            passive: true,
        });

        if (
            document.fonts &&
            typeof document.fonts.ready?.then === "function"
        ) {
            document.fonts.ready.then(scheduleDraw);
        }
    });
})();
