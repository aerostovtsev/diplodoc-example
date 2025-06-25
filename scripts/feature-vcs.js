/**
 * Фича: Возможность открыть репозиторий (или другой источник) на редактирование текущей страницы
 * Кнопка "Редактировать" будет отображаться как кнопка для GitHub. К сожалению, кастомизировать эту часть не получилось.
 *
 * Пример использования:
 *
 * .yfm >
 *      resources:
 *          script:
 *              - _assets/script/feature-base.js
 *              - _assets/script/feature-vcs.js
 *              ...
 *  toc.yaml >
 *      features:
 *        vcs:
 *            url: https://example.com/{path}/edit # Где {path} - это путь к текущей странице + .md
 */
function injectVcs() {
    const diplodocDataRef = window.__DATA__
    const diplodocTocDataRef = diplodocDataRef.data.toc

    if (diplodocDataRef.data.leading) {
        return
    }

    if (!diplodocTocDataRef.items) {
        return
    }

    if (!diplodocTocDataRef.features || !diplodocTocDataRef.features.vcs) {
        return
    }

    const options = Object.assign({}, {url: void 0}, diplodocTocDataRef.features.vcs)
    const route = diplodocDataRef.router.pathname

    if (options.url === void 0) {
        return
    }

    diplodocDataRef.data.vcsUrl = options.url.replace('{path}', `${route}.md`)
    diplodocDataRef.data.vcsType = 'github'
}

window.FEATURE_RUNNER.set("vcs", injectVcs)
