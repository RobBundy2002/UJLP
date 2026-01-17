export const smoothScrollTo = (elementId, offset = 80) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element with id "${elementId}" not found`);
        return;
    }

    const startPosition = window.pageYOffset;
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    const distance = targetPosition - startPosition;
    const duration = 500; // ms
    let startTime = null;

    const easeInOutQuad = (t) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const animation = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const easeProgress = easeInOutQuad(progress);
        window.scrollTo(0, startPosition + distance * easeProgress);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    };

    requestAnimationFrame(animation);
};

export const useSmoothScroll = () => {
    const scrollTo = (elementId, offset = 80) => {
        smoothScrollTo(elementId, offset);
    };

    const scrollToTop = () => {
        const startPosition = window.pageYOffset;
        const duration = 500;
        let startTime = null;

        const easeInOutQuad = (t) => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };

        const animation = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            const easeProgress = easeInOutQuad(progress);
            window.scrollTo(0, startPosition * (1 - easeProgress));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    };

    return { scrollTo, scrollToTop };
};

export default smoothScrollTo;
