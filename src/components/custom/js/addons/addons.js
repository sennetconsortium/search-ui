import Addon from './Addon'
import GoogleTagManager from './GoogleTagManager'
import AppModal from './AppModal'
import Facets from './Facets'

/**
 * JS functionality which enhance site functionality, not necessarily part of the core.
 * @param {string} source
 * @param {object} args
 * @returns
 */
function addons(source, args) {
    Addon.log('Addons started ...', 'log',  'red')
    window.addons = window.addons || {}
    if (window.addons[source] !== undefined) {
        return
    }
    window.addons[source] = args

    let apps = {
        gtm: GoogleTagManager,
        modal: AppModal, 
        facets: Facets
    }

    setTimeout(() => {
        try {
            for (let app in apps) {
                document
                    .querySelectorAll(`[class*='js-${app}--'], [data-js-${app}]`)
                    .forEach((el) => {
                        new apps[app](el, {app, ...args || ...window.addons.init })
                    })
            }

            // Default: Capture all link clicks.
            new GoogleTagManager(null, 'links', ...args || ...window.addons.init })
        } catch (e) {
            console.error(e)
        }
    }, 1000)
}

export default addons