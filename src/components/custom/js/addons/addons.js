import Addon from './Addon'
import GoogleTagManager from './GoogleTagManager'
import AppModal from './AppModal'
import Facets from './Facets'

/**
 * JS functionality which enhance site functionality, not necessarily part of the core.
 * @param {String} source
 * @returns
 */
function addons(source, args) {
    Addon.log('Addons started ...', 'log', 'red')
    if (window[source] !== undefined) {
        return
    }
    window[source] = true
    let apps = {
        gtm: GoogleTagManager,
        modal: AppModal, 
        facets: Facets
    }

    setTimeout(() => {
        for (let key in apps) {
            document
                .querySelectorAll(`[class*='js-${key}--'], [data-js-${key}]`)
                .forEach((el) => {
                    new apps[key](el, {key, data: args.data })
                })

            
        }

        // Default: Capture all link clicks. 
        new GoogleTagManager(null, 'links')
    }, 1000)
}

export default addons
