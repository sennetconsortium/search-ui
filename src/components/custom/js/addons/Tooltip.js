import $ from 'jquery'

let Tooltip = {
    constructor: (el, args, _t) => {
        Tooltip = Object.assign(Tooltip, _t)
        Tooltip.main(el, args, Tooltip)

        Tooltip.log('Tooltip')
        Tooltip.ops = Tooltip.el.data('js-tooltip')
        Tooltip.timeouts = null
        if (Tooltip.ops) {
            Tooltip.events()
        } else {
            Tooltip.ops = {}
            Tooltip.text = args.text
            Tooltip.e = args.e
            Tooltip.show()
        }
    },

    handleToolTip: (e) => {
        const text = $(Tooltip.ops.data).attr('data-tooltiptext')
        if (text) {
            Tooltip.text = text
            Tooltip.show()
            clearTimeout(Tooltip.timeouts)
            Tooltip.timeouts = setTimeout(()=>{
                $('.js-popover').remove()
            }, 3000)
        }
    },

    events: () => {
        const _t = Tooltip
        Tooltip.el.on('click', Tooltip.ops.trigger, (e)=>{
            Tooltip.e = e
            clearTimeout(Tooltip.timeouts)
            _t.timeouts = setTimeout(() => {
                $('.js-popover').remove()
                _t.handleToolTip(e)
            }, 200)
        })
    },

    getPosition: () => {
        const rect = Tooltip.e.currentTarget.getBoundingClientRect()
        const x = Tooltip.e.clientX - rect.left / 2
        const y = Tooltip.e.clientY + (Tooltip.ops.diffY || 0)
        return  {x, y};
    },

    buildHtml: () => {
        const pos = Tooltip.getPosition()
        return `<div role="tooltip" x-placement="right" class="fade show popover bs-popover-end js-popover ${Tooltip.ops.class || ''}" id="popover-basic"
             data-popper-reference-hidden="false" data-popper-escaped="false" data-popper-placement="right"
             style="position: absolute; display: block; inset: 0px auto auto 0px; transform: translate(${pos.x}px, ${pos.y}px);">
            <div class="popover-arrow" style="position: absolute; top: 0px; transform: translate(0px, 47px);"></div>
            <div class="popover-body">${Tooltip.text}</div>
        </div>`
    },

    show: () => {
        Tooltip.el.append(Tooltip.buildHtml())
    }
}

export default Tooltip