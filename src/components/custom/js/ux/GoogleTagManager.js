import Applux from './Applux'
import $ from 'jquery'

class GoogleTagManager extends Applux {
    constructor(el, app) {
        super(el, app)
        this.extractEvent()
        this.modules()
    }

    extractEvent() {
        const _t = this
        this.el[0].classList.forEach((val) => {
            if (val.indexOf(_t.app) !== -1) {
                _t.event = val.split('--')[1]
            }
        })
    }

    modules() {
        switch (this.event) {
            case 'search':
                this.search()
                break
            case 'facets':
                this.facets()
                break
            default:
                this.links()
        }
    }

    handleSearch(e) {
        const keywords = this.currentTarget(e).parent().find('#search').val()
        this.gtm({ keywords })
    }

    search() {
        const _t = this
        this.el.on('click', 'button', (e) => {
            _t.handleSearch(e)
        })

        this.el.on('keydown', 'button, input', (e) => {
            if (_t.isEnter(e)) _t.handleSearch(e)
        })
    }

    handleFacets(e) {
        const label = this.currentTarget(e).text()
        this.gtm({ group: this.group, label })
    }

    facets() {
        const _t = this
        this.group = $(this.el).find('.sui-facet__title').text()
        this.el.on(
            'click',
            '.sui-multi-checkbox-facet__option-input-wrapper',
            (e) => {
                _t.handleFacets(e)
            }
        )
    }

    links() {}

    gtm(args) {
        const data = { event: this.event, ...args }
        //console.log(data)
        dataLayer.push(data)
    }
}

export default GoogleTagManager
