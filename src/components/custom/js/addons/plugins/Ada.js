

/**
 * This adds web accessibility functionality to
 * elements.
 */
class Ada extends _Addon {
    constructor(el, args) {
        super(el, args)
        this._el = this.el.data(`js-${this.app}`)
        if (this[this._el]) {
            this[this._el]()
        } else {
            this.events()
        }
    }

    tableResults() {
        const data = this.el.data('ada-data')
        this.el.find(data.tabIndex).attr('tabindex', 0)
        this.events(data.tabIndex, data.trigger)
    }

    facets() {
        _Addon.log('Ada > Facets')
        this.onKeydownEnter('.sui-facet__title, .sui-select__control')

        this.onKeydownEnter( '.sui-multi-checkbox-facet__checkbox', ((e) => {
            this.currentTarget(e).parent().trigger('click')
            this.currentTarget(e).focus()
        }).bind(this))
    }

    modal() {
        $(window).on('keydown', ((e) => {
            _Addon.log('Ada > Modal')
            if (this.isEsc(e)) {
                $('.modal-footer .btn').eq(0).click()
            }
        }).bind(this));
    }

    events(sel, sel2) {
        sel = sel || this._el
        this.el.on('keydown', `${sel}`, ((e) => {
            if (this.isEnter(e)) {
                const $el = sel2 ? this.currentTarget(e).find(sel2) : this.currentTarget(e)
                $el.click()
            }
        }).bind(this));
    }
}

