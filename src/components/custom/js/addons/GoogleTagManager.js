import Addon from './Addon'
import $ from 'jquery'

class GoogleTagManager extends Addon {
    constructor(el, args) {
        super(el, args)
        this.extractEvent()
        this.modules()
    }

    extractEvent() {
        if (this.el == null || !this.el.length) return
        this.el[0].classList.forEach(((val) => {
            if (val.indexOf(this.app) !== -1) {
                this.event = val.split('--')[1]
            }
        }).bind(this))
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
        this.el.on('click', 'button', ((e) => {
            this.handleSearch(e)
        }).bind(this))

        this.el.on('keydown', 'button, input', ((e) => {
            if (this.isEnter(e)) this.handleSearch(e)
        }).bind(this))
    }

    handleFacets(e) {
        const label = this.currentTarget(e).text()
        this.gtm({ group: this.group, label })
    }

    facets() {
        this.group = this.el.parent().find('.sui-facet__title').text()
        this.el.on(
            'click',
            '.sui-multi-checkbox-facet__option-input-wrapper',
            ((e) => {
                this.handleFacets(e)
            }).bind(this)
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
        this.el.on('click', 'tbody tr', ((e) => {
            this.handleResults(e)
        }).bind(this))
    }

    handleLinks(e) {
        this.event = 'links'
        this.gtm({link: this.currentTarget(e).text()})
    }

    links() {
        $('a').on('click', ((e) => {
            this.handleLinks(e)
        }).bind(this))
    }

    gtm(args) {
        const data = { event: this.event, ...args }
        //console.log(data)
        dataLayer.push(data)
    }
}

export default GoogleTagManager
