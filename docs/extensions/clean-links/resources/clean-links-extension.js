"use strict";
window.cleanLinksExtensionInit = (options) => {
    document.addEventListener('click', (event => {
        const href = event.target.href || '';
        const locationOrigin = window.location.origin;
        if (href.startsWith(locationOrigin) && event.target.matches('.dc-doc-layout__center a')) {
            event.preventDefault();
            event.stopPropagation();
            window.location.href = href;
        }
    }), true);
    // Перехватчик для Worker. С измененными ссылками не правильно просчитывается корневой путь до базового каталога
    const nativeWorkerPostMessage = window.Worker.prototype.postMessage;
    window.Worker.prototype.postMessage = function (value, transferList) {
        if ('object' === typeof value && value.type && value.type === 'init') {
            const originalUrl = new URL(options.route, window.location.origin);
            value.base = originalUrl.href.split('/').slice(0, -value.depth).join('/');
        }
        nativeWorkerPostMessage.call(this, value, transferList);
    };
};
