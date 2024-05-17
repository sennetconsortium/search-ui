import Addon from './Addon'
import GTM from './GoogleTagManager'
import Ada from './Ada'
import Tooltip from './Tooltip'

/**
 * JS functionality which enhance site functionality, not necessarily part of the core.
 * @param {string} source
 * @param {object} args
 * @returns
 */
function addons(source, args= null) {
    Addon.log('Addons started ...', 'log',  'red')
    window.addons = window.addons || {}
    if (window.addons[source] !== undefined) {
        return
    }
    window.addons[source] = args

    let apps = {
        gtm: GTM,
        ada: Ada,
        tooltip: Tooltip
    }

    setTimeout(() => {
        args = args || window.addons.init
        try {
            for (let app in apps) {
                document
                    .querySelectorAll(`[class*='js-${app}--'], [data-js-${app}]`)
                    .forEach((el) => {
                        const contextApp = Object.assign(Addon, apps[app])
                        apps[app].constructor(el, {app, ...args }, Addon)
                    })
            }

            // Default: Capture all link clicks.
            GTM.constructor(null, {app: 'links', ...args }, Addon)
        } catch (e) {
            console.error(e)
        }
    }, 1000)

}

export default addons