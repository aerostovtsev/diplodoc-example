/**
 * Фича: Получение фидбэка от пользователя
 *
 * Пример использования:
 *
 * .yfm >
 *      resources:
 *          script:
 *              - _assets/script/feature-base.js
 *              - _assets/script/feature-feedback.js
 *              ...
 *  toc.yaml >
 *      features:
 *        feedback: boolean
 *        # или
 *        feedback:
 *            sendUrl: https://example.com/feedback # Адрес для отправки данных методом POST
 *
 *   Формат отправляемых данных:
 *   {
 *       route: string // Адрес страницы
 *       type: string // Тип фидбэка (like, dislike, indeterminate)
 *       comment?: string;
 *       answers?: string[]
 *   }
 *
 *
 *   Для более глубокой аналитики нужно модернизировать отправку данных, например добавить какой-то уникальный идентификатор пользователя
 */
function injectFeedback() {
    const diplodocDataRef = window.__DATA__
    const diplodocTocDataRef = diplodocDataRef.data.toc

    if (diplodocDataRef.data.leading) {
        return
    }

    if (!diplodocTocDataRef.items) {
        return
    }

    if (!diplodocTocDataRef.features || !diplodocTocDataRef.features.feedback) {
        return
    }

    const options = Object.assign({}, {sendUrl: void 0}, diplodocTocDataRef.features.feedback)
    const route = window.FEATURE_UTILS.urlWithoutExtension(diplodocDataRef.router.pathname)
    const storageKey = `feedback:${route}`

    const sendData = async (data) => {
        await fetch(options.sendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                route,
                ...data
            })
        })
    }

    const sendLocalState = (data) => {
        if (data.type === 'indeterminate') {
            window.localStorage.removeItem(storageKey)
            return
        }

        window.localStorage.setItem(storageKey, JSON.stringify(data))
    }

    const getLocalState = () => {
        const data = window.localStorage.getItem(storageKey)

        return data ? JSON.parse(data) : null
    }

    const localState = getLocalState()

    if (localState?.type === 'like') {
        diplodocDataRef.data.isLiked = true
    }

    if (localState?.type === 'dislike') {
        diplodocDataRef.data.isDisliked = true
    }

    diplodocDataRef.data.onSendFeedback = (data) => {
        sendLocalState(data)

        if (options.sendUrl !== void 0) {
            void sendData(data)
        }
    }
}

window.FEATURE_RUNNER.set("feedback", injectFeedback)
