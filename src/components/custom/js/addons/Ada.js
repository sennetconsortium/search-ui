import Addon from './Addon'
import $ from 'jquery'

/**
 * This adds web accessibility functionality to
 * elements.
 */
let Ada = {
    constructor: (el, args, _t) => {
        Ada = Object.assign(Ada, _t)
        Ada.main(el, args, Ada)
        Ada._el = Ada.el.data(`js-${Ada.app}`)
        if (Ada[Ada._el]) {
            Ada[Ada._el]()
        } else {
            Ada.events()
        }
    },

    tableResults: () => {
        const data = Ada.el.data('ada-data')
        Ada.el.find(data.tabIndex).attr('tabindex', 0)
        Ada.events(data.tabIndex, data.trigger)
    },

    facets: () => {
        Addon.log('Ada > Facets')
        Ada.onKeydownEnter(Ada,'.sui-facet__title, .sui-select__control')

        Ada.onKeydownEnter(Ada, '.sui-multi-checkbox-facet__checkbox', (e) => {
            Ada.currentTarget(e).parent().trigger('click')
            Ada.currentTarget(e).focus()
        })
    },

    modal: () => {
        $(window).on('keydown', (e) => {
            Addon.log('Ada > Modal')
            if (Ada.isEsc(Ada, e)) {
                $('.modal-footer .btn').eq(0).click()
            }
        });
    },

    events: (sel, sel2) => {
        sel = sel || Ada._el
        Ada.el.on('keydown', `${sel}`, (e) => {
            if (Ada.isEnter(Ada, e)) {
                const $el = sel2 ? Ada.currentTarget(e).find(sel2) : Ada.currentTarget(e)
                $el.click()
            }
        });
    }
}

export default Ada