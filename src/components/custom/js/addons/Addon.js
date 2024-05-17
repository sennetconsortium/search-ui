import $ from 'jquery'
const Addon = {

    main: (el, args, _t) => {
        _t.el = $(el)
        _t.app = args.app
        _t.data = args.data
        _t.user = {}
        _t.router = args.router
        _t.entities = args.entities
        _t.st = null
        if (args.data && args.data.user) {
            _t.user = JSON.parse(args.data.user)
        }
        if (Addon.isLocal()) {
            Addon.log('Addons args:', 'log', 'aqua')
            console.log(args)
        }
        _t.keycodes = {
            enter: 'Enter',
            esc: 'Escape'
        }
    },

    handleKeydown: (e, trigger) => {
        Addon.currentTarget(e).trigger(trigger)
        Addon.currentTarget(e).focus()
    },

    onKeydownEnter: (_t, sel, cb, trigger = 'click') => {
        _t.el.on('keydown', `${sel}`, (e) => {
            if (_t.isEnter(_t, e)) {
                clearTimeout(_t.st)
                _t.st = setTimeout(()=> {
                    cb ? cb(e) : _t.handleKeydown(e, trigger)
                }, 100)
            }
        })
    },

    currentTarget: (e) => {
        return $(e.currentTarget)
    },

    /**
     * Prevents bubbling of javascript event to parent
     * @param {*} e Javascript event
     */
    stop: (e) => {
        e.stopPropagation()
    },

    /**
     * Determines whether a keydown/keypress operation is of Enter/13
     * @param {object} e Event
     * @returns {boolean}
     */
    isEnter: (_t, e) => {
        return e.code === _t.keycodes.enter
    },

    isEsc: (_t, e) => {
        return e.code === _t.keycodes.esc
    },

    isLocal: () => {
        return (location.host.indexOf('localhost') !== -1)
    },

    log: (msg, fn = 'log', color = '#bada55') => {
        if (Addon.isLocal()) {
            console[fn](`%c ${msg}`, `background: #222; color: ${color}`)
        }
    }
}

export default Addon