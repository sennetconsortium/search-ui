import {useEffect} from 'react'
import {SEARCH_ENTITIES} from "../../../config/search/entities";
import {SEARCH_FILES} from "../../../config/search/files";
import {SEARCH_METADATA} from '../../../config/search/metadata';
import $ from 'jquery'
import {Chip} from "@mui/material";
import {getUBKGFullName} from "../js/functions";
import { Sui } from 'search-ui/lib/search-tools';

function SelectedFacets({ filters, setFilter, removeFilter }) {
    const exclude = ['name']
    const getSelector = (pre, label, value) => {
        return `sui-${pre}--${formatVal(label)}-${formatVal(value)}`
    }

    const isTimestamp = (val) => (val.indexOf('timestamp') > -1)
    const isNumeric = (val) => (val.endsWith("value" || val.endsWith("number")))

    const convertToVal = (val) => {
        const labels = {from: 'Start Date', to: 'End Date'}
        return (typeof val !== 'string') ? (labels[val.key] || val.key) : val
    }

    const formatVal = (id) => {
        id = convertToVal(id)
        return id.replace(/\W+/g, "")
    }

    const convertToLabel = (filter) => {
        let facets = JSON.parse(JSON.stringify(SEARCH_ENTITIES.searchQuery.facets))
        $.extend(facets, SEARCH_FILES.searchQuery.facets)
        $.extend(facets, SEARCH_METADATA.searchQuery.facets)
        return facets[filter]?.label || filter
    }

    const handleCheckboxDelete = (data) => {
        removeFilter(data.filter.field, data.value, 'any')
        const suis = Sui.getFilters()
        const key = `${data.filter.field}.${data.value}`
        if (suis[key]) {
            delete suis[key]
            Sui.saveFilters(suis)
        }
    }

    const handleNumericOrDateDelete = (data) => {
        const idx = data.filter.values.findIndex(v => v === data.value)
        const removed = data.filter.values.splice(idx, 1)
        const newFilterValue = data.filter.values.reduce((obj, item) => ({...obj, [item.key]: item.value}), {}); 
        if (Object.keys(newFilterValue).length > 0) {
            setFilter(data.filter.field, {...newFilterValue, name: data.filter.field}, 'any')
        } else {
            const removedValue = removed.reduce((obj, item) => ({...obj, [item.key]: item.value}), {name: data.filter.field});
            removeFilter(data.filter.field, removedValue, 'any')
        }
        
        const suis = Sui.getFilters()
        if (suis[data.filter.field]) {
            delete suis[data.filter.field].from
            delete suis[data.filter.field].to
            suis[data.filter.field] = {...suis[data.filter.field], ...newFilterValue}
            Sui.saveFilters(suis)
        }
    }

    const handleDelete = (e, data) => {
        e.stopPropagation()
        if (isTimestamp(data.filter.field) || isNumeric(data.filter.field)) {
            handleNumericOrDateDelete(data)
        } else {
            handleCheckboxDelete(data)
        }
    }

    const formatFilters = () => {
        let _filters = []
        for (let f of filters) {
            let values = []
            for (let value of f.values) {
                if (typeof value !== 'string') {
                    for (let k in value) {
                        if (exclude.indexOf(k) === -1) {
                            values.push({key: k, value: value[k]})
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

    const convertToDisplayVal = (obj) => {
        if (isTimestamp(obj.filter.field)) {
            // Add 24 hours minus 1 ms to the end date so inclusive of the end date
            let val = obj.value.key === 'from' ? (obj.value.value + 24 * 60 * 60 * 1000 - 1) : obj.value.value
            return (new Date(val).toLocaleDateString('en-US'))
        } else if (isNumeric(obj.filter.field)) {
            return obj.value.value
        } else {
            return getUBKGFullName(convertToVal(obj.value))
        }
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
                                       label={<><span className='chip-title'>{convertToLabel(f.field)}</span>: {convertToDisplayVal({filter: f, value})}</>}
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