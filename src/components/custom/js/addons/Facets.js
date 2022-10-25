import Addon from './Addon'
import $ from 'jquery'

class Facets extends Addon {
    constructor(el, args) {
        super(el, args)
        this.log('Addon > Facets')
        this.facets = this.data.facets
        this.sel = {
            triggers: '.sui-multi-checkbox-facet__option-input-wrapper, .sui-facet-view-more',
            title: '.sui-facet__title',
            label: '.sui-multi-checkbox-facet label',
            ioText: '.sui-multi-checkbox-facet__input-text'
        }
        this.groups = ['Organ']
        this.events()
    }

    events() {
        this.el.on('click', this.sel.triggers, ((e) => {
            setTimeout((() => {
                this.el.find(this.sel.title).each(((index, el) => {
                    const $el = $(el)
                    const txt = $el.text()
                   
                    if (this.groups.indexOf(txt) !== -1) {
                        this.updateFacets($el.parent().find(this.sel.label))
                    }
                    
                }).bind(this))

            }).bind(this), 0)
            
        }).bind(this))
    }

    updateFacets($parent) {
        $parent.find(this.sel.ioText).each(((index, el) => {
            const $el = $(el)
            const key = $el.text()
            let text = this.facets[key] || key
            $el.text(text)
        }).bind(this))
        
    }
}

export default Facets