import {useRef, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import $ from 'jquery'


function ColumnsDropdown({ getTableColumns, setHiddenColumns, currentColumns }) {
    const multiVals = useRef(null)

    const colourStyles = {
        multiValueRemove: (styles, { data }) => ({
            ...styles,
            ':hover': {
                backgroundColor: '#0d6efd',
                color: 'white',
            },
        }),
    }

    const handleChange = (e) => {
        multiVals.current = e

        // Prevent user from removing all columns
        if (e.length === (getTableColumns().length - 1)) {
            e.pop()
            return
        }
        let removeColumns = {}
        for (let out of e) {
            removeColumns[out.value] = true
        }

        setHiddenColumns(removeColumns)
    }

    const getColumnOptions = () => {
        if (!currentColumns.current) return []
        let allColumns = Array.from(currentColumns.current)
        allColumns.splice(0, 1)
        let cols = []
        for (let col of allColumns) {
            if (!col.ignoreRowClick) {
                cols.push({ value: col.name, label: col.name })
            }
        }
        return cols
    }

    useEffect(() => {
        // Have to listen to click from here instead of in handleClearFiltersClick
        // to manage value states of this independent component
        $('body').on('click', '.clear-filter-button', () => {
            multiVals.current = null
            setHiddenColumns(null)
        })
    }, [])

    return (

        <Select
            isMulti
            closeMenuOnSelect={false}
            name='hiddenColumns'
            value={multiVals.current}
            options={getColumnOptions()}
            onChange={handleChange}
            classNames={{
                clearIndicator: (state) => 'sui-clear-selection',
            }}
            className='sui-columns-toggle'
            placeholder={`Choose columns to hide`}
            styles={colourStyles}
        />
    )
}

ColumnsDropdown.defaultProps = {}

ColumnsDropdown.propTypes = {
    getTableColumns: PropTypes.func.isRequired,
    setHiddenColumns: PropTypes.func.isRequired,
}

export default ColumnsDropdown