import $ from 'jquery'
class Addon {
    constructor(el, app) {
        this.el = $(el)
        this.app = app
        this.keycodes = {
            enter: 'Enter',
            esc: 'Escape'
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

    isEsc(e) {
        return e.code === this.keycodes.esc
    }

    static log(msg, fn = 'log', color = '#bada55') {
        if (location.host.indexOf('localhost') !== -1) {
            console[fn](`%c ${msg}`, `background: #222; color: ${color}`)
        }
    }

    log(msg, fn = 'log') {
        Addon.log(msg, fn)
    }
}

export default Addon
