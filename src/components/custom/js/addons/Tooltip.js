import Addon, {_addon} from './Addon'
import $ from 'jquery'
import Popover from 'react-bootstrap/Popover'

class Tooltip extends Addon {
    constructor(el, args) {
        super(el, args)
        this.log('Tooltip')
        this.ops = this.el.data('js-tooltip')

        if (this.ops) {
            this.events()
        } else {
            this.ops = {}
            this.text = args.text
            this.e = args.e
            this.show()
        }

    }

    handleToolTip(e) {
        const text = $(this.ops.data).attr('data-tooltiptext')
        if (text) {
            this.text = text
            this.show()
            setTimeout(()=>{
                $('.js-popover').remove()
            }, 3000)
        }
    }

    events() {
        this.el.on('click', this.ops.trigger, ((e)=>{
            this.e = e
            const _t = this
            setTimeout(() =>{
                _t.handleToolTip(e)
            }, 200)
        }).bind(this))
    }

    getPosition() {
        const rect = this.e.currentTarget.getBoundingClientRect()
        const x = this.e.clientX //- rect.left
        const y = this.e.clientY + (this.ops.diffY || 0)
        return  {x, y};
    }

    buildHtml() {
        const pos = this.getPosition()
        return `<div role="tooltip" x-placement="right" class="fade show popover bs-popover-end js-popover ${this.ops.class || ''}" id="popover-basic"
             data-popper-reference-hidden="false" data-popper-escaped="false" data-popper-placement="right"
             style="position: absolute; display: block; inset: 0px auto auto 0px; transform: translate(${pos.x}px, ${pos.y}px);">
            <div class="popover-arrow" style="position: absolute; top: 0px; transform: translate(0px, 47px);"></div>
            <div class="popover-body">${this.text}</div>
        </div>`
    }
    show() {

        this.el.append(this.buildHtml())
    }
}

export default Tooltip