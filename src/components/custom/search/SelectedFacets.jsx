import {useEffect, useRef, useState} from 'react'
import {SEARCH_ENTITIES} from "../../../config/search/entities";
import {SEARCH_FILES} from "../../../config/search/files";
import $ from 'jquery'
import {Chip} from "@mui/material";

function SelectedFacets({ filters }) {
    const exclude = ['name']
    const getSelector = (pre, label, value) => {
        return `sui-${pre}--${formatVal(label)}-${formatVal(value)}`
    }

    const isTimestamp = (val) => (val.indexOf('timestamp') > -1)
    const convertToVal = (val) => {
        const labels = {from: 'Start Date', to: 'End Date'}
        return labels[val] || val
    }

    const formatVal = (id) => {
        id = convertToVal(id)
        return id.replace(/\W+/g, "")
    }

    const convertToLabel = (filter) => {
        let facets = JSON.parse(JSON.stringify(SEARCH_ENTITIES.searchQuery.facets))
        $.extend(facets, SEARCH_FILES.searchQuery.facets)
        return facets[filter]?.label || filter
    }

    const handleDelete = (e, data) => {
        e.stopPropagation()
        const label = convertToLabel(data.filter.field)
        const value = convertToVal(data.value)
        let id = getSelector('facet', label, value)
        if (isTimestamp(data.filter.field)) {
            let targetName = value.toLowerCase().replaceAll(' ', '')
            id = `sui-facet--${formatVal(label)}-${targetName}`
            const $date = document.getElementById(id)
            if ($date) {
                $date.valueAsDate = null
                const event = new Event('change', { bubbles: true });
                $date.dispatchEvent(event);
            }
             //.showPicker()
        } else {
            $(`[for="${id}"]`).trigger('click')
        }
    }

    const formatFilters = () => {
        let _filters = []
        for (let f of filters) {
            let values = []
            for (let value of f.values) {
                if (typeof value !== 'string') {
                    for (let item in value) {
                        if (exclude.indexOf(item) === -1) {
                            values.push(item)
                        }
                    }
                } else {
                    values.push(value)
                }
            }
            _filters.push({_filters: f, field: f.field, values})
        }
        return _filters
    }


    const buildFilters = () => {
        let dict = {}
        let results = []
        let key
        let val
        let _filters = formatFilters()
        for (let f of _filters) {
            for (let value of f.values) {
                val = convertToVal(value)
                key = `${f.field}${formatVal(val)}`
                if (dict[key] === undefined) {
                    dict[key] = true
                    results.push(<Chip key={key} className={`${getSelector('chipToggle', f.field, val)}`}
                                       label={`${convertToLabel(f.field)}: ${val}`}
                                       variant="outlined" onDelete={(e) => handleDelete(e, {filter: f, value})} />)
                }

            }
        }
        return results
    }
    useEffect(() => {

    }, [])

    return (
        <div className={`c-SelectedFacets`}>
            {buildFilters()}
        </div>
    )
}


export default SelectedFacets