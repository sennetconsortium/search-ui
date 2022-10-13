import GoogleTagManager from './GoogleTagManager'

function ux(source) {
    if (window[source] !== undefined) {
        return
    }
    window[source] = true
    let apps = {
        gtm: GoogleTagManager,
    }

    setTimeout(() => {
        for (let key in apps) {
            document
                .querySelectorAll(`[class*='js-${key}--']`)
                .forEach((el) => {
                    new apps[key](el, key)
                })

            document.querySelectorAll(`[data-js-${key}]`).forEach((el) => {
                new apps[key](el, key)
            })
        }
    }, 1000)
}

export default ux
