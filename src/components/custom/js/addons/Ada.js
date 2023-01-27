import Addon from './Addon'
import $ from 'jquery'

/**
 * This adds web accessibility functionality to
 * elements.
 */
class Ada extends Addon {
    constructor(el, args) {
        super(el, args)
        this._el = this.el.data(`js-${this.app}`)
        if (this[this._el]) {
            this[this._el]()
        } else {
            this.events()
        }
    }

    facets() {
        const sui = {
            title: '.sui-facet__title',
            select: '.sui-select__control',
            checkbox: '.sui-multi-checkbox-facet__checkbox',
        }

        this.onKeydownEnter(`${sui.title},${sui.select}`)

        this.onKeydownEnter( `${sui.checkbox}`, ((e) => {
            this.currentTarget(e).parent().trigger('click')
            this.currentTarget(e).focus()
        }).bind(this))
    }


    events() {

        this.el.on('keydown', `${this._el}`, ((e) => {
            if (this.isEnter(e)) {
                this.currentTarget(e).click()
            }
        }).bind(this));
    }
}

export default Ada