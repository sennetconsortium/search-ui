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
        this.events()
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