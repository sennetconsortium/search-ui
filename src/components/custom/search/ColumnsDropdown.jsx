import {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'


function ColumnsDropdown({ getTableColumns, setHiddenColumns, setTableColumns, currentColumns }) {
    const handleChange = (e) => {
        if (e.length === (getTableColumns().length - 1)) {
            e.pop()
            return
        }
        let removeColumns = {}
        for (let out of e) {
            removeColumns[out.value] = true
        }
        let cols = getTableColumns()
        let filteredColumns = [cols[0]]
        console.log('omit', cols, removeColumns)
        for (let col of cols) {
            if (!removeColumns[col.name] || col.ignoreRowClick) {
                filteredColumns.push(col)
            }
        }
        console.log('omit', filteredColumns)
        setHiddenColumns(e)
        setTableColumns(filteredColumns)
    }

    const getColumnOptions = () => {
        let allColumns = currentColumns.current
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

    }, [])

    return (

        <Select
            isMulti
            name='hiddenColumns'
            options={getColumnOptions()}
            onChange={handleChange}
            className='sui-columns-toggle'
            placeholder={`Choose columns to hide`}
        />
    )
}

ColumnsDropdown.defaultProps = {}

ColumnsDropdown.propTypes = {
    getTableColumns: PropTypes.func.isRequired,
    setTableColumns: PropTypes.func.isRequired,
}

export default ColumnsDropdown