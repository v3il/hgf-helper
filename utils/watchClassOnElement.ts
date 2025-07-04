export function watchClassOnElement(element: HTMLElement, className: string, callback: (hasClass: boolean) => void) {
    const observer = new MutationObserver(() => {
        callback(element.classList.contains(className));
    });

    observer.observe(element, {
        attributes: true,
        attributeFilter: ['class'],
    });

    callback(element.classList.contains(className));

    return observer;
}
