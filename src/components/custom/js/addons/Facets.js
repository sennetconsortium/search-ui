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
            select: '.sui-select__control',
            checkbox: '.sui-multi-checkbox-facet__checkbox',
            label: '.sui-multi-checkbox-facet label',
            ioText: '.sui-multi-checkbox-facet__input-text'
        }
        this.groups = ['Organ']
        this.formatFilters()
        this.events()
    }

    events() {
        $(document).on('DOMSubtreeModified', ((e) => {
            this.formatFilters(0)
        }).bind(this))

        this.onKeydownEnter(`${this.sel.title},${this.sel.select}`)

        this.onKeydownEnter( `${this.sel.checkbox}`, ((e) => {
            this.currentTarget(e).parent().trigger('click')
            this.currentTarget(e).focus()
        }).bind(this))
    }

    /**
     * Find elements to be formatted
     */
    formatFilters(time = 150) {

        //Get some delay by triggering the web api
        let st = setTimeout((() => {
            this.el.find(this.sel.title).each(((index, el) => {
                const $el = $(el)
                const txt = $el.text()

                if (this.groups.indexOf(txt) !== -1) {
                    this.updateFilters($el.parent().find(this.sel.label))
                }

            }).bind(this))

        }).bind(this), time)
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