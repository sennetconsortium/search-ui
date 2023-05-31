import React, {useContext, useEffect, useState} from 'react'
import $ from "jquery";
import Dropdown from 'react-bootstrap/Dropdown'

const getCheckboxes = () => $('.rdt_TableBody [type=checkbox]')

const getCheckAll = () => {
    const $headers = $('.rdt_TableHeadRow .rdt_TableCol')
    const $checkAllHeader = $headers.eq(0)
    return $checkAllHeader.find('[role="columnheader"] > div')
}

const handleDropdownView = ($el, total) => {
    const action = total > 0 ? 'addClass' : 'removeClass'
    $el.parent()[action]('is-active')
}

const handleCheckAllTotal = ($el, total) => {
    $el.attr('data-total', total)
    handleDropdownView($el, total)
}

export const clearCheckAll = () => {
    const $el = getCheckAll()
    $el.find('span').html('')
    $el.find('[type=checkbox]').removeAttr('checked')
    $el.removeClass('is-all')
    handleCheckAllTotal($el,0)
}
export const handleCheckAll = () => {
    const $checkAll = getCheckAll()
    $checkAll.attr('role', 'button')
    $checkAll.parent().addClass('sui-tbl-actions-wrapper')
    $('#sui-tbl-checkbox-actions').detach().appendTo($checkAll.parent())

    let checkAllHtml = `<input type="checkbox" name="toggle-checkall" />`
    $checkAll.html(checkAllHtml)

    $checkAll.on('click', (e) => {
        const $el = $(e.currentTarget)
        $el.toggleClass('is-all')
        const checkAll = $el.hasClass('is-all')
        const txt = checkAll ? checkAllHtml.replace('/>', `checked />`) : checkAllHtml
        const total = checkAll ? getCheckboxes().length : 0
        handleCheckAllTotal($el, total)
        const counter = total ? `(${total})` : ''
        $el.html(txt + `<span>${counter}</span>`)
        getCheckboxes().prop('checked', checkAll)
    })

    $('.rdt_TableBody').on('click', '[type=checkbox]', (e) => {
        const $el = $(e.currentTarget)
        const isChecked = $el.is(':checked')
        let total = $checkAll.attr('data-total')
        total = total ? Number(total) : 0
        total = isChecked ? ++total : --total
        $checkAll.attr('data-total', total)
        const $span = $checkAll.find('span')
        handleDropdownView($checkAll, total)
        if (!$span.length) {
            $checkAll.append('<span>')
        }
        $checkAll.find('span').html(` (${total})`)
    })

}
function BulkExport({ data, raw, columns, replaceFirst = 'uuid' }) {

    const generateTSVData = (selected) => {
        let _columns = columns.current
        if (replaceFirst) {
            _columns[0] = {
                name: replaceFirst.upperCaseFirst(),
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
                if (selected[id]) {
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
    const downloadData = (e, kind) => {
        console.log(data)
        const $checkboxes = getCheckboxes()
        let selected = {}
        let results = []
        let fileName = ''
        let lastSelected, val
        $checkboxes.each((i, el) => {
            if ($(el).is(':checked')) {
                val = $(el).val()
                if (!Object.values(selected).length) {
                    fileName += val
                }
                selected[val] = true
                lastSelected = val
            }
        })

        fileName += ` - ${lastSelected}`

        for (let item of data) {
            let id = raw(item.props.result.sennet_id)

            if (selected[id]) {
                results.push(item.props.result)
            }
        }


        const isJson =  kind === 'json'
        const a = document.createElement('a')
        const type = isJson ? 'application/json' : 'text/tab-separated-values'
        const blob = isJson ? [JSON.stringify(results, null, 2)] : [generateTSVData(selected)]

        const url = window.URL.createObjectURL(new Blob(blob, {type}))
        a.href = url
        a.download = `${fileName}.${kind}`
        document.body.append(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
    }

    return (
        <div id='sui-tbl-checkbox-actions'>
            <Dropdown>
                <Dropdown.Toggle  id="dropdown-basic" variant={'secondary-outline'}>
                    ...
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item key={`export-to-tsv`} onClick={(e) => downloadData(e, 'tsv')}>Export selected to TSV</Dropdown.Item>
                    <Dropdown.Item key={`export-to-json`} onClick={(e) => downloadData(e, 'json')}>Export selected to JSON</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default BulkExport