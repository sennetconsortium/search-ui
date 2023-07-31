import React, {useContext, useEffect, useState} from 'react'
import $ from "jquery";
import Dropdown from 'react-bootstrap/Dropdown'
import PropTypes from "prop-types";
import SenNetPopover, {SenPopoverOptions} from "../SenNetPopover";
import {equals} from "./js/functions";

export const getCheckboxes = () => $('.rdt_TableBody [type=checkbox]')

export const getCheckAll = () => {
    const $headers = $('.rdt_TableHeadRow .rdt_TableCol')
    const $checkAllHeader = $headers.eq(0)
    return $checkAllHeader.find('.sui-check-all input')
}

const $span = ($el) => {
    $el = $el || getCheckAll()
    return $el.parent().find('span')
}

const handleCheckAllTotal = ($el, total) => {
    $el.attr('data-total', total)
    const counter = total ? ` (${total})` : ''
    $span($el).html(counter)
}

const getTotal = () => {
    let total = 0
    getCheckboxes().each((i, el) => {
        if ($(el).is(':checked')) {
            total++
        }
    })
    return total
}

export const handleCheckbox = (e) => {
    e.stopPropagation()
    const $el = $(e.currentTarget)
    const isChecked = $el.is(':checked')
    let total = getCheckAll().attr('data-total')
    total = total ? Number(total) : 0
    total = isChecked ? ++total : --total
    getCheckAll().prop('checked', total === getCheckboxes().length)
    handleCheckAllTotal(getCheckAll(), total)
}

export const handleCheckAll = (setTotalSelected) => {
    getCheckAll().parent().parent().addClass('sui-tbl-actions-wrapper')
    handleCheckAllTotal(getCheckAll(), 0)
    getCheckAll().prop('checked', false)
}

function BulkExport({ data, raw, columns, exportKind, onCheckAll, replaceFirst = 'uuid' }) {

    const [totalSelected, setTotalSelected] = useState(0)

    useEffect(() => {
        $('.clear-filter-button').on('click', ()=>{
            setTotalSelected(0)
        })

        $('.sui-check-all').on('DOMSubtreeModified', (e) =>{
            setTotalSelected(getTotal())
        })
    })

    const toggleCheckAll = (e, setTotalSelected) => {
        const $el = $(e.currentTarget)
        const checkAll = $el.is(':checked')
        const total = checkAll ? getCheckboxes().length : 0
        handleCheckAllTotal($el, total)
        getCheckboxes().prop('checked', checkAll)
        setTotalSelected(getTotal())
        if (onCheckAll) {
            onCheckAll(e, checkAll)
        }
    }

    const generateTSVData = (selected, isAll) => {
        let _columns = columns.current
        if (replaceFirst) {
            _columns[0] = {
                name: replaceFirst.toUpperCase(),
                selector: row => raw(row[replaceFirst]),
                sortable: true,
            }
        }
        
        let tableDataTSV = ''
        let _colName
        for (let col of _columns) {
            tableDataTSV += `${col.name}\t`
        }
        tableDataTSV += "\n"
        let colVal;
        try {
            if (!Array.isArray(data)) {
                data = Object.values(data)
            }
            let row
            for (let item of data) {
                let id = raw(item.props.result.sennet_id)
                if (isAll || selected[id]) {
                    for (let col of _columns) {
                        row = item.props.result
                        _colName = col.name
                        colVal = col.selector(row) ? col.selector(row) : ''
                        tableDataTSV += `${colVal}\t`
                    }
                    tableDataTSV += "\n"
                }
            }
        } catch (e) {
            console.error(e);
        }

        return tableDataTSV
    }

    const generateManifestData = (selected, isAll) => {
        let manifestData  = ''
        try {
            if (!Array.isArray(data)) {
                data = Object.values(data)
            }
            debugger
            for (let item of data) {
                let id = raw(item.id)
                if (isAll || selected[id]) {
                    debugger
                    for (let subItem of item.list) {
                        manifestData += `${raw(subItem.dataset_uuid)} /${raw(subItem.rel_path)}\n`
                    }

                }
            }
        } catch (e) {
            console.error(e);
        }

        return manifestData
    }

    const atIndex = (index) => {
        return (data[index].props)  ? data[index].props.result : data[index]
    }

    const downloadData = (e, fileType, isAll) => {
        const $checkboxes = getCheckboxes()
        let selected = {}
        let results = []
        let fileName = raw(atIndex(0).id) + ' - ' + raw(atIndex(data.length - 1).id)
        let lastSelected, val

        if (!isAll) {
            $checkboxes.each((i, el) => {
                if ($(el).is(':checked')) {
                    val = $(el).val()
                    if (!Object.values(selected).length) {
                        fileName = val
                    }
                    selected[val] = true
                    lastSelected = val
                }
            })
            if (fileName !== lastSelected) {
                fileName += ` - ${lastSelected}`
            }
        }

        for (let i = 0; i < data.length; i++) {
            let id = raw(atIndex(i).id)

            if (isAll || selected[id]) {
                results.push(atIndex(i))
            }
        }

        let type = 'text/tab-separated-values'
        let blob = [generateTSVData(selected, isAll)]
        switch(fileType) {
            case 'json':
                type = 'application/json'
                blob = [JSON.stringify(results, null, 2)]
                break;
            case 'manifest':
                type = 'text/plain'
                fileName = 'data-manifest'
                fileType = 'txt'
                blob = [generateManifestData(selected, isAll)]
                break;
            default:
            // code block
        }

        const a = document.createElement('a')

        const url = window.URL.createObjectURL(new Blob(blob, {type}))
        a.href = url
        a.download = `${fileName}.${fileType}`
        document.body.append(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
    }

    const getActions = () => {
        let actions = {
            json: 'JSON',
            tsv: 'TSV'
        }
        if (equals(exportKind, 'manifest')) {
            actions = {
                manifest: 'Manifest TXT'
            }
        }

        return actions
    }

    const popoverText = (fileType) => {
        if (equals(fileType, 'json')) {
            return <>Exports all properties associated with selected entities in JSON format.</>
        } else if (equals(fileType, 'tsv')) {
            return <>Exports search result table information for selected entities in tab-separated values format.</>
        } else {
            return <>Exports to HuBMAP CLT manifest format.</>
        }
    }

    const getMenuItems = (range) => {
        let results = []
        const isAll = range === 'all'
        const exportActions = getActions()
        let i = 1

        for (let action in exportActions) {
            results.push(
                <SenNetPopover key={`${range}-${action}`} text={popoverText(action)} className={`${range}-${action}`}>
                    <a onClick={(e) => downloadData(e, action, isAll)}><code>{exportActions[action]}</code></a>
                </SenNetPopover>
            )
            if (i !== Object.keys(exportActions).length) {
                results.push(<span key={`${range}-${action}-sep`}>&nbsp;|&nbsp;</span>)
            }
            i++
        }
        return results
    }

    return (
        <>
            <div className='sui-check-all'><input type="checkbox" name="toggle-check-all" onClick={(e) => toggleCheckAll(e, setTotalSelected)} /><span></span></div>
            <div id='sui-tbl-checkbox-actions'>
                <Dropdown>
                    <Dropdown.Toggle  id="dropdown-basic" variant={'secondary-outline'}>
                        ...
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <div className={'dropdown-item'} key={`export-all`}>Export all to&nbsp;
                            {getMenuItems('all')}
                            </div>
                        {totalSelected > 0 && <div className={'dropdown-item'}  key={`export-selected`} >Export selected to&nbsp;
                            {getMenuItems()}
                        </div>}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </>
    )
}

BulkExport.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.object.isRequired,
    exportKind: PropTypes.string
}

export default BulkExport