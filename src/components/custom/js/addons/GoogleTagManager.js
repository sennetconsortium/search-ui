import Addon from './Addon'
import $ from 'jquery'

let GTM = {
    constructor: (el, args, _t) => {
        GTM = Object.assign(GTM, _t)
        GTM.main(el, args, GTM)

        GTM.sel = {
            facets: {
                title: '.sui-facet__title'
            }
        }
        GTM.extractEvent()
        GTM.modules()
    },

    extractEvent: () => {
        if (GTM.el == null || !GTM.el.length) return
        GTM.el[0].classList.forEach((val) => {
            if (val.indexOf(GTM.app) !== -1) {
                GTM.event = val.split('--')[1]
            }
        })
        GTM.log(`Google Tag manager ... ${GTM.event}`)
    },

    modules: () => {
        switch (GTM.event) {
            case 'search':
                GTM.search()
                break
            case 'facets':
                GTM.facets()
                break
            case 'dateFacets':
                GTM.dateFacets()
                break
            case 'results':
                GTM.results()
                break
            default:
                GTM.numericFacets() // As these facets can be conditional
                GTM.page()
                GTM.cta()
                GTM.links()
        }
    },

    handleSearch: (e) => {
        const keywords = GTM.currentTarget(e).parent().find('#search').val()
        GTM.gtm({ keywords })
    },

    search: () => {
        GTM.el.on('click', 'button', (e) => {
            GTM.handleSearch(e)
        })

        GTM.el.on('keydown', 'button, input', (e) => {
            if (GTM.isEnter(GTM, e)) GTM.handleSearch(GTM, e)
        })
    },

    handleFacets: (e) => {
        const label = $(e.target).parent().find('.sui-multi-checkbox-facet__input-text').text()
        GTM.gtm({ group: GTM.group, label, trail: `${GTM.group}.${label}` })
    },

    handleDateFacets: (e) => {
        // const label = this.currentTarget(e).val()
        GTM.event = 'facets'
        GTM.gtm({ group: GTM.group, label: GTM.subGroup, trail: `${GTM.group}.${GTM.subGroup}` })
    },

    handleNumericFacets: (e) => {
        GTM.event = 'facets'
        let label = GTM.currentTarget(e).find('input').val()
        GTM.gtm({ group: GTM.group, label, trail: `${GTM.group}.${label}` })
    },

    storeLoaded: (key) => {
        const $body = $('body')
        if ($body.data(key)) return null
        $body.attr(`data-${key}`, true)
        return `.js-gtm--${key}`
    },

    facets: () => {
        const sel = GTM.storeLoaded('facets')
        if (!sel) return
        const pre = 'sui-multi-checkbox-facet__'
        const body = document.querySelector('body')
        body.addEventListener('click', (e) => {
            const el = e.target
            if (el.classList.contains(`${pre}checkbox`) || el.classList.contains(`${pre}option-input-wrapper`)) {
                GTM.group = $(el).parents(sel).parent().find(GTM.sel.facets.title).text()
                GTM.handleFacets(e)
            }
        },true)
    },

    dateFacets: () => {
        GTM.group = GTM.el.parent().find(GTM.sel.facets.title).text()
        GTM.subGroup = GTM.el.find('.sui-multi-checkbox-facet').text()
        GTM.el.on(
            'change',
            'input', (e) => {
                GTM.stop(e)
                GTM.handleDateFacets(e)
            }
        )
    },

    numericFacets: () => {
        const sel = GTM.storeLoaded('numericFacets')
        if (!sel) return
        $('body').on(
            'DOMSubtreeModified',
            `${sel} .MuiSlider-thumb`,
            (e) => {
                GTM.stop(e)
                const $el = GTM.currentTarget(e)
                let val = $el.attr('data-val')
                let ioVal = $el.find('input').val()
                // on DOMSubtreeModified, multiple triggers for same value, so only gtm once
                if (val !== ioVal) {
                    $el.attr('data-val', ioVal)
                    GTM.group = GTM.currentTarget(e).parents(sel).parent().parent().find(GTM.sel.facets.title).text()
                    GTM.handleNumericFacets(e)
                }
            }
        )
    },

    handleResults: (e) => {
        const td = GTM.currentTarget(e)
        const th = ['sennet_id', 'entity_type', 'lab_id', 'group_name']
        const data = {}
        for (let i = 0; i < th.length; i++) {
            data[th[i]] = td.parent().find(`[data-field="${th[i]}"]`).text().trim()
        }
        GTM.gtm(data)
    },

    results: () => {
        GTM.el.on('click', '.rdt_TableBody .rdt_TableCell:not(div[data-column-id="1"])', (e) => {
            GTM.handleResults(e)
        })
    },

    getPath: () => {
        const path = window.location.pathname + window.location.search
        return path.length > 70 ? window.location.pathname : path;
    },

    handleLinks: (e) => {
        GTM.event = 'links'
        const $el = GTM.currentTarget(e)
        GTM.gtm({link: $el.text() || $el.attr('aria-label') || $el.attr('alt')})
    },

    links: () => {
        $('a').on('click', (e) => {
            GTM.handleLinks(e)
        })
    },

    handleCta: (e) => {
        const $el = GTM.currentTarget(e)
        const className = $el.attr('class')
        GTM.event = 'cta'
        let action
        const actions = ['json', 'submit', 'login', 'save', 'revert', 'validate', 'reorganize', 'process']
        if (className) {
            for (let i = 0; i < actions.length; i++) {
                if (className.includes(actions[i])){
                    action = actions[i]
                }
            }
        }

        if (action) {
            let data = { }
            data = GTM.entityPage(data, false)
            let action2 = data.action || null
            data = { ...data, action: (action2 ? `${action}.${action2}`: action), uuid: GTM.getUuid() }
            GTM.gtm(data)
        }

    },

    cta: () => {
        $('body').on('click', '[role="button"], .btn, button', (e) => {
            GTM.handleCta(e)
        })
    },

    page: () => {
        GTM.event = 'page'
        let data = {data: 'view'}
        Addon.log('GTM, Page event ...', 'log', 'pink')
        GTM.entityPage(data)
    },

    getUuid: () => {
        const uuid = GTM.router.asPath.split('uuid=')
        // Fully fetch the uuid, split(&)[0] in case more params follow
        return uuid.length && uuid.length > 1 ? GTM.router.asPath.split('uuid=')[1].split('&')[0] : null
    },

    entityPage: (data, send = true) => {

        const entities = Object.keys(GTM.entities)

        let pos = -1
        for (let i = 0; i < entities.length; i++) {
            if (GTM.router.route.includes(entities[i])) pos = i
        }

        if ( pos !== -1) {
            data.entity = GTM.entities[entities[pos]]
            const actions = ['register', 'edit']
            for (let action of actions) {
                if (window.location.href.indexOf(action) !== -1) {
                    data.action = action
                    break
                }
            }
            data.uuid = GTM.getUuid()

            if (send) {
                GTM.gtm(data) // push Page view
                GTM.event = 'entity'
                GTM.gtm(data) // push Entity Page view
            }
        } else {
            if (send) GTM.gtm(data) // push Page view
        }
        return data
    },

    getPerson: (bto = false) => {
        const id = GTM.user.email
        let result
        if (id) {
            result = bto ? btoa(id.replace('@', '*')) : `${id.split('@')[0]}***`
        }
        return result
    },

    gtm: (args) => {
        let data = {
            event: GTM.event,
            path: GTM.getPath(),
            person: GTM.getPerson(),
            user_id: GTM.getPerson(true),
            globus_id: GTM.user.globus_id,
            session: (GTM.user.email !== undefined), ...args
        }
        if (GTM.isLocal()) console.log(data)
        dataLayer.push(data)
    }
}

export default GTM