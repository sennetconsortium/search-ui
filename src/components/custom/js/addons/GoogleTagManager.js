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
                this.page()
                this.cta()
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

    getPath() {
        const path = window.location.pathname + window.location.search
        return path > 70 ? window.location : path;
    }
    handleLinks(e) {
        this.event = 'links'
        const $el = this.currentTarget(e)
        this.gtm({link: $el.text() || $el.attr('aria-label') || $el.attr('alt')})
    }

    links() {
        $('a').on('click', ((e) => {
            this.handleLinks(e)
        }).bind(this))
    }

    handleCta(e) {
        const $el = this.currentTarget(e)
        const className = $el.attr('class')
        this.event = 'cta'
        let action
        const actions = ['json', 'submit', 'login', 'save']
        if (className) {
            for (let i = 0; i < actions.length; i++) {
                if (className.includes(actions[i])){
                    action = actions[i]
                }
            }
        }

        if (action) {
            let data = { }
            data = this.entityPage(data, false)
            let action2 = data.action || null
            data = { ...data, action: (action2 ? `${action}.${action2}`: action), uuid: this.getUuid() }
            this.gtm(data)
        }

    }

    cta() {
        $('[role="button"], .btn, button').on('click', ((e) => {
            this.handleCta(e)
        }).bind(this))
    }

    page() {
        this.event = 'page'
        let data = {data: 'view'}
        Addon.log('GTM, Page event ...', 'log', 'pink')
        this.entityPage(data)
    }

    getUuid() {
        const uuid = this.router.asPath.split('uuid=')
        // Fully fetch the uuid, split(&)[0] in case more params follow
        return uuid.length && uuid.length > 1 ? this.router.asPath.split('uuid=')[1].split('&')[0] : null
    }

    entityPage(data, send = true) {

        const entities = Object.keys(this.entities)

        let pos = -1
        for (let i = 0; i < entities.length; i++) {
            if (this.router.route.includes(entities[i])) pos = i
        }

        if ( pos !== -1) {
            data.entity = this.entities[entities[pos]]
            const actions = ['create', 'edit']
            for (let action of actions) {
                if (this.router.route.indexOf(action) !== -1) {
                    data.action = action
                }
            }
            data.uuid = this.getUuid()

            if (send) {
                this.gtm(data) // push Page view
                this.event = 'entity'
                this.gtm(data) // push Entity Page view
            }
        } else {
            if (send) this.gtm(data) // push Page view
        }
        return data
    }
    getPerson(bto = false) {
        const id = this.user.email
        let result
        if (id) {
            result = bto ? btoa(id.replace('@', '*')) : `${id.split('@')[0]}***`
        }
        return result
    }
    gtm(args) {
        let data = {
            event: this.event,
            path: this.getPath(),
            person: this.getPerson(),
            user_id: this.getPerson(true),
            globus_id: this.user.globus_id,
            session: (this.user.email !== undefined), ...args
        }
        if (Addon.isLocal()) console.log(data)
        dataLayer.push(data)
    }
}

export default GoogleTagManager