import GoogleTagManager from './GoogleTagManager'

/**
 * JS functionality which enhance site functionality, not necessarily part of the core.
 * @param {String} source
 * @returns
 */
function addons(source) {
    console.log('Addons ...')
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

export default addons
