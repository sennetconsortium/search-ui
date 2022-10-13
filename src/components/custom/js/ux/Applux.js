import $ from 'jquery'
class Applux {
    constructor(el, app) {
        this.el = $(el)
        this.app = app
        this.keycodes = {
            enter: 'Enter',
        }
    }

    currentTarget(e) {
        return $(e.currentTarget)
    }

    /**
     * Prevents bubbling of javascript event to parent
     * @param {*} e Javascript event
     */
    stop(e) {
        e.stopPropagation()
    }

    /**
     * Determines whether a keydown/keypress operation is of Enter/13
     * @param {object} e Event
     * @returns {boolean}
     */
    isEnter(e) {
        return e.code === this.keycodes.enter
    }
}

export default Applux
