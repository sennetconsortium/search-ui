import Addon from './Addon'
import $ from 'jquery'

class GoogleTagManager extends Addon {
    constructor(el, app) {
        super(el, app)
        this.extractEvent()
        this.modules()
    }

    extractEvent() {
        if (this.el == null || !this.el.length) return
        const _t = this
        this.el[0].classList.forEach((val) => {
            if (val.indexOf(_t.app) !== -1) {
                _t.event = val.split('--')[1]
            }
        })
        this.log(`Google Tag manager ... ${this.event}`)
    }

    modules() {
        switch (this.event) {
            case 'search':
                this.search()
                break
            case 'facets':
                this.facets()
                break
            case 'results':
                this.results()
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
        this.group = this.el.parent().find('.sui-facet__title').text()
        this.el.on(
            'click',
            '.sui-multi-checkbox-facet__option-input-wrapper',
            (e) => {
                _t.handleFacets(e)
            }
        )
    }

    handleResults(e) {
        const tr = this.currentTarget(e)
        const th = ['created_by', 'sennet_id', 'entity', 'lab_id', 'category', 'group']
        const data = {}
        for (let i = 0; i < th.length; i++) {
            data[th[i]] = tr.find('td').eq(i).text()
        }
        this.gtm(data)
    }

    results() {
        const _t = this
        this.el.on('click', 'tbody tr', (e) => {
            _t.handleResults(e)
        })
    }

    handleLinks(e) {
        this.event = 'links'
        this.gtm({link: this.currentTarget(e).text()})
    }

    links() {
        const _t = this
        $('a').on('click', (e) => {
            _t.handleLinks(e)
        })
    }

    gtm(args) {
        const data = { event: this.event, ...args }
        //console.log(data)
        dataLayer.push(data)
    }
}

export default GoogleTagManager
