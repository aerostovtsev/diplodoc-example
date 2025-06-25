/**
 * Базовый файл для работы с фичами. Должен быть подключен первым.
 * Реагируем на изменение данных в __DATA__ и запускаем инициализацию зарегистрированных фич
 * */

window.FEATURE_RUNNER = new Map()

let diplodocDataRef = {}

Object.defineProperty(window, "__DATA__", {
    set: newData => {
        let diplodocTocRef = {}

        diplodocDataRef = newData

        Object.defineProperty(diplodocDataRef.data, "toc", {
            set: newToc => {
                diplodocTocRef = newToc
                runInjectFeatures()
            },
            get: () => diplodocTocRef,
            enumerable: true
        })
        
    },
    get: () =>  diplodocDataRef,
    enumerable: true
})


function runInjectFeatures() {
    window.FEATURE_RUNNER.forEach((featureFn) => featureFn())
}


window.FEATURE_UTILS = {
    urlWithoutExtension: (url) => {
        if (url.endsWith(".html")) {
            return url.slice(0, -5)
        }

        return url
    }
}
