import { useContext } from 'react'
import { Chip } from '@mui/material'
import { getUBKGFullName } from '../js/functions'
import SearchUIContext from 'search-ui/components/core/SearchUIContext'

function SelectedFacets() {
    const { filters, setFilter, removeFilter } = useContext(SearchUIContext)

    const getSelector = (pre, label, value) => {
        return `sui-${pre}--${formatVal(label)}-${formatVal(value)}`
    }

    const formatVal = (id) => {
        return `${id}`.replace(/\W+/g, '')
    }

    const convertToDisplayValue = (filter, value, key) => {
        switch (filter.uiType) {
            case 'daterange':
                return new Date(value).toLocaleDateString('en-US', { timeZone: 'UTC' })
            case 'numrange':
                return value
            default:
                return getUBKGFullName(value)
        }
    }

    const handleDelete = (e, filter, value, key) => {
        e.preventDefault()
        if (filter.type === 'range') {
            const newValue = { ...value }
            delete newValue[key]
            if (!newValue.from && !newValue.to) {
                removeFilter(filter.field, value, 'SelectedFacets')
            } else {
                setFilter(filter.field, newValue, 'SelectedFacets')
            }
        } else {
            removeFilter(filter.field, value, 'SelectedFacets')
        }
    }

    const buildRangeFacetChip = (filter, value) => {
        const chips = []
        Array('from', 'to').forEach((key) => {
            if (!value[key]) return
            chips.push(
                <Chip
                    key={`${filter.field}_${key}`}
                    className={`${getSelector('chipToggle', filter.field, key)}`}
                    label={
                        <>
                            {' '}
                            <span className='chip-title'>{filter.label}</span>:{' '}
                            {convertToDisplayValue(filter, value[key])}
                        </>
                    }
                    variant='outlined'
                    onDelete={(e) => handleDelete(e, filter, value, key)}
                />
            )
        })
        return chips
    }

    const buildValueFacetChip = (filter, value) => {
        return (
            <Chip
                key={`${filter.field}_${formatVal(value)}`}
                className={`${getSelector('chipToggle', filter.field, value)}`}
                label={
                    <>
                        <span className='chip-title'>{filter.label}</span>: {convertToDisplayValue(filter, value)}
                    </>
                }
                variant='outlined'
                onDelete={(e) => handleDelete(e, filter, value)}
            />
        )
    }

    return (
        <div className={`c-SelectedFacets`}>
            {filters.reduce((acc, filter) => {
                for (const value of filter.values) {
                    if (filter.type === 'range') {
                        acc.push(...buildRangeFacetChip(filter, value))
                    } else {
                        acc.push(buildValueFacetChip(filter, value))
                    }
                }
                return acc
            }, [])}
        </div>
    )
}

export default SelectedFacets
