import Addon from './Addon'
import $ from 'jquery'

class Facets extends Addon {
    constructor(el, args) {
        super(el, args)
        this.log('Addon > Facets')
        this.facets = this.data.facets
        this.sel = {
            wrapper: '.sui-multi-checkbox-facet__option-input-wrapper',
            more: '.sui-facet-view-more',
            title: '.sui-facet__title',
            label: '.sui-multi-checkbox-facet label',
            ioText: '.sui-multi-checkbox-facet__input-text',
            clearFilters: '.clear-filter-button'
        }
        this.groups = ['Organ']
        this.storageKeys = {
            filters: 'addon:facets:filters',
            more: 'addon:facets:more',
            date: 'addon:facets:date'
        }
        this.timeout = 400
        this.applied = {}
        this.setUpMore()
        this.events()
        this.applyFilters()
    }

    /**
     * Checks if the filters have expired.
     * @returns {boolean}
     */
    hasExpired() {
        let date = localStorage[this.storageKeys.date];
        date = date ? new Date(date) : null
        if (!date) return false
        const oneHour = 60 * 60 * 1000
        if ((new(Date) - date) > oneHour) {
            this.deleteFilters()
            return true;
        }
        return false
    }

    deleteFilters() {
        delete localStorage[this.storageKeys.filters]
        delete localStorage[this.storageKeys.more]
    }

    /**
     * Adds some ids to the more buttons
     */
    setUpMore() {
        $(this.sel.more).each(((index, el) =>{
            
            if (!$(el).attr('id')) {
                let mod = $(el).parent().parent().find(this.sel.title).text().replace(/\s/g, '-')
                $(el).attr('id', `js-facets--more${mod}`)
            }
        }).bind(this))
    }

    /**
     * Get value in storage
     * @param {string} key 
     * @returns {array}
     */
    getStorage(key) {
        let filters = localStorage.getItem(key)
        return filters ? filters.split(',') : []
    }

    /**
     * Get ids of all filters clicked
     * @returns {array}
     */
    getFilters() {
        return this.getStorage(this.storageKeys.filters)
    }

    /**
     * Get ids of all more buttons clicked
     * @returns {array}
     */
    getMoreIds() {
        return this.getStorage(this.storageKeys.more)
    }

    /**
     * Saves clicks on filter
     * @param {Event} e 
     */
    saveFilter(e) {
        const filter = this.currentTarget(e).find('input').attr('id')
        let filters = this.getFilters()
        const pos = filters.indexOf(filter)
        if (pos === -1) {
            if (filter.length) {
                filters.push(filter)
            }
        } else {
            filters.splice(pos, 1)
        }
        localStorage.setItem(this.storageKeys.date, (new Date()).toISOString())
        localStorage.setItem(this.storageKeys.filters, filters.join(','))
    }

    /**
     * Saves clicks on More buttons
     * @param {Event} e 
     */
    saveMore(e) {
        let ids = this.getMoreIds()
        const id = this.currentTarget(e).attr('id')
        if (ids.indexOf(id) === -1) {
            ids.push(id)
        }
        localStorage.setItem(this.storageKeys.more, ids.join(','))
    } 

    /**
     * Auto select last selected filters stored
     * @param {boolean} applyMore 
     * @returns 
     */
    applyFilters( applyMore = true) {
        if (!this.getFilters().length || this.hasExpired()) return
        const filters = this.getFilters()
        const ids = this.getMoreIds()

        // First open open more of elements stored
        if (applyMore) {
            ids.forEach(((id, index)=> {
                $(`[id="${id}"]`).trigger('click', {applying: true})
            }).bind(this))
        }
        
        // Then apply the filters clicked
        let st0 = setTimeout((() => {
            
            filters.forEach(((id, index)=> {
                let $el = $(`[id="${id}"]`)
                if (!this.applied[id]) {
                    $el.parent().trigger('click', {applying: true})
                }
                
                if ($el.length) {
                    this.applied[id] = true
                }
            }).bind(this))
            
        }).bind(this), this.timeout)
        
    }

    events() {
        $('body').on('click', this.sel.clearFilters, ((e) => {
            this.deleteFilters()
        }).bind(this))

        this.el.on('click', this.sel.wrapper, ((e, data) => {
            let st1 = setTimeout((() => {
                this.setUpMore()
                if (data && data.applying) {
                    this.applyFilters( false )
                }
            }), this.timeout)
            if (data ? !data.applying : true) {
                this.saveFilter(e)
            }
        }).bind(this))

        this.el.on('click', `${this.sel.wrapper},${this.sel.more}`, ((e) => {
            this.formatFilters(e)
        }).bind(this))

        this.el.on('click', this.sel.more, ((e, data) => {
            this.saveMore(e)
            if (data && data.applying) {
                this.applyFilters( false )
            }
        }).bind(this))
    }

    /**
     * Find elements to be formatted
     * @param {Event} e 
     */
    formatFilters(e) {

        //Get some delay by triggering the web api
        let st = setTimeout((() => {
            this.el.find(this.sel.title).each(((index, el) => {
                const $el = $(el)
                const txt = $el.text()
               
                if (this.groups.indexOf(txt) !== -1) {
                    this.updateFilters($el.parent().find(this.sel.label))
                }
                
            }).bind(this))

        }).bind(this), 0) 
    }

    /**
     * Updates formatting of filters.
     * @param {Element} $parent 
     */
    updateFilters($parent) {
        $parent.find(this.sel.ioText).each(((index, el) => {
            const $el = $(el)
            const key = $el.text()
            let text = this.facets[key] || key
            $el.text(text)
        }).bind(this)) 
    }
}

export default Facets