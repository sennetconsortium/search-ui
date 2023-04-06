import $ from 'jquery'
class Addon {
    route;

    constructor(el, args) {
        this.el = $(el)
        this.app = args.app
        this.data = args.data
        this.user = {}
        this.router = args.router
        this.entities = args.entities
        if (args.data && args.data.user) {
            this.user = JSON.parse(args.data.user)
        }
        if (Addon.isLocal()) {
            Addon.log('Addons args:', 'log', 'aqua')
            console.log(args)
        }
        this.keycodes = {
            enter: 'Enter',
            esc: 'Escape'
        }
    }

    static cssClasses() {
        return {
            active: 'is-active'
        }
    }

    static navBar() {
        const classes = Addon.cssClasses()
        const sel = {
            heading: '.dropdown-item.is-heading',
            submenu: '+ .submenu'
        }
        $('.nav-link').on('click', (e)=>{
            $(sel.heading).find(sel.submenu).removeClass(classes.active)
        })
        $('body').on('mouseover', sel.heading, (e) => {
            $(sel.heading).find(sel.submenu).removeClass(classes.active)
            $(e.currentTarget).find(sel.submenu).addClass(classes.active)
        }).on('click', sel.heading, (e) => {
            e.stopPropagation()
            $(e.currentTarget).find(sel.submenu).toggleClass(classes.active)
        })
    }

    handleKeydown(e, trigger) {
        this.currentTarget(e).trigger(trigger)
        this.currentTarget(e).focus()
    }

    onKeydownEnter(sel, cb, trigger = 'click') {
        this.el.on('keydown', `${sel}`, ((e) => {
            if (this.isEnter(e)) {
                cb ? cb(e) : this.handleKeydown(e, trigger)
            }
        }).bind(this))
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

    static isLocal() {
        return (location.host.indexOf('localhost') !== -1)
    }

    static log(msg, fn = 'log', color = '#bada55') {
        if (Addon.isLocal()) {
            console[fn](`%c ${msg}`, `background: #222; color: ${color}`)
        }
    }

    log(msg, fn = 'log') {
        Addon.log(msg, fn)
    }
}

export default Addon