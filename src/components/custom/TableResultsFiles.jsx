import React, {useRef} from 'react'
import PropTypes from 'prop-types'
import {
    checkFilterType,
    checkMultipleFilterType, formatByteSize, getEntityViewUrl,
    getUBKGFullName,
} from './js/functions'
import BulkExport, {getCheckAll, getCheckboxes, handleCheckbox} from "./BulkExport";
import {getOptions} from "./search/ResultsPerPage";
import ResultsBlock from "./search/ResultsBlock";
import {TableResultsProvider} from "../../context/TableResultsContext";
import $ from 'jquery'
import SenNetAlert from "../SenNetAlert";
import {BoxArrowUpRight} from "react-bootstrap-icons";
import ClipboardCopy from "../ClipboardCopy";

const downloadSizeAttr = 'data-download-size'
export const clearDownloadSizeLabel = () => {
    getCheckAll().removeAttr(downloadSizeAttr)
    $('.sui-paging-info .download-size').remove()
}

function TableResultsFiles({children, filters, forData = false, rowFn, inModal = false}) {
    const fileTypeField = 'file_extension'
    let hasMultipleFileTypes = checkMultipleFilterType(filters, fileTypeField);
    const currentColumns = useRef([])
    const hasClicked = useRef(false)

    const raw = rowFn ? rowFn : ((obj) => obj ? obj.raw : null)
    const applyDownloadSizeLabel = (total) => {
        if (total > 0) {
            getCheckAll().attr(downloadSizeAttr, total)
            $('.sui-paging-info').append(`<span class="download-size"> | Estimated download ${formatByteSize(total)}</span>`)
        }
    }

    const onRowClicked = (e, uuid, data, clicked = false) => {
        const sel = `[name="check-${data.id}"]`

        if (!clicked) {
            hasClicked.current = true
            document.querySelector(sel).click()
        }
        const isChecked = $(sel).is(':checked')
        const $checkAll = getCheckAll()
        let total = $checkAll.attr(downloadSizeAttr)
        total = total ? Number(total) : 0
        total = isChecked ? total + raw(data.size) : total - raw(data.size)
        clearDownloadSizeLabel()
        applyDownloadSizeLabel(total)
        hasClicked.current = false
    }

    const getHotLink = (row) => getEntityViewUrl('dataset', raw(row.dataset_uuid), {})

    const handleFileCheckbox = (e, data) => {
        handleCheckbox(e)
        if (!hasClicked.current) {
            onRowClicked(e, data.id, data, true)
        }
    }

    const getId = (column) => column.id || column.sennet_id

    const onCheckAll = (e, checkAll) => {
        let total = 0
        if (checkAll) {
            getCheckboxes().each((i, el) => {
                if ($(el).is(':checked')) {
                    total += Number($(el).attr('data-size'))
                }
            })
        }
        clearDownloadSizeLabel()
        applyDownloadSizeLabel(total)
    }

    const defaultColumns = ({hasMultipleFileTypes = true, columns = [], _isLoggedIn}) => {
        let cols = []
        if (!inModal) {
            cols.push({
                ignoreRowClick: true,
                name: <BulkExport onCheckAll={onCheckAll} data={children} raw={raw} columns={currentColumns} exportKind={'manifest'} />,
                width: '100px',
                className: 'text-center',
                selector: row => row.id,
                sortable: false,
                format: column => <input type={'checkbox'} data-size={raw(column.size)} onClick={(e) => handleFileCheckbox(e, column)} value={getId(column)} name={`check-${getId(column)}`}/>
            })
        }

        cols.push(
            {
                name: 'Dataset SenNet ID',
                selector: row => raw(row.dataset_sennet_id),
                sortable: true,
                format: column => inModal ? raw(column.dataset_sennet_id) : <span data-field='dataset_sennet_id'><a href={getHotLink(column)}>{raw(column.dataset_sennet_id)}</a> <ClipboardCopy text={raw(column.dataset_sennet_id)} title={'Copy SenNet ID {text} to clipboard'} /></span>,
            }
        )

        cols.push(
            {
                name: 'File Type Description',
                selector: row => raw(row.description),
                sortable: true,
                format: row => <p>{raw(row.description)} {raw(row.description) && <br />} <small><a data-field='rel_path' href={'#'}>{raw(row.rel_path)}</a></small></p>
            }
        )

        if (hasMultipleFileTypes) {
            cols.push({
                name: 'File Type',
                selector: row => raw(row.file_extension),
                sortable: true,
                format: row => <span data-field={fileTypeField}>{raw(row.file_extension)?.toUpperCase()}</span>,
            })
        }

        cols.push(
            {
                name: 'Sample Type',
                selector: row => {
                    let val = raw(row.samples)
                    if (val) {
                        return Array.isArray(val) ? val[0].type : val.type
                    }
                },
                sortable: true,
            }
        )


        cols.push(
            {
                name: 'Data Types',
                selector: row => {
                    let val = raw(row.data_types)
                    if (val) {
                        return Array.isArray(val) ? getUBKGFullName(val[0]) : val
                    }
                },
                sortable: true,
            }
        )

        cols.push(
            {
                name: 'Size',
                selector: row => raw(row.size),
                sortable: true,
                format: row => <span>{formatByteSize(raw(row.size))}</span>
            }
        )

        cols = cols.concat(columns)

        return cols;
    }


    const getTableColumns = () => {
        let cols;
        if (checkFilterType(filters, fileTypeField) === false) {
            cols = defaultColumns({});
        } else {
            let typeIndex = 0;
            cols = filters.map((filter, index) => {
                let columns = []
                if (filter.field === fileTypeField) {
                    typeIndex = index

                    return defaultColumns({hasMultipleFileTypes: hasMultipleFileTypes, columns});
                }
            })
            cols = cols[typeIndex]
        }
        currentColumns.current = cols;
        return cols;
    }

    if (forData) {
        return {defaultColumns}
    }

    // Prepare opsDict
    getOptions(children.length)

    return (
        <>
            <TableResultsProvider getId={getId} rows={children} filters={filters} onRowClicked={onRowClicked} forData={forData} raw={raw} inModal={inModal}>
                <SenNetAlert variant={'warning'} className="clt-alert"
                             text=<>In order to download the files that are included in the manifest file,&nbsp;
                    <a href="https://github.com/x-atlas-consortia/clt" target='_blank' className={'lnk--ic'}>install <BoxArrowUpRight/></a> the CLT and <a href="https://docs.sennetconsortium.org/libraries/clt/">follow the instructions</a> for how to use it with the manifest file.
                <br /><small className={'text-muted'}>Note: For transferring data to the local machine, the <a href={'https://www.globus.org/globus-connect-personal'} target='_blank' className={'lnk--ic'}>Globus Connect Personal (GCP)<BoxArrowUpRight/></a> endpoint must also be up and running.</small>
                </> />
                <ResultsBlock

                    getTableColumns={getTableColumns}
                />
            </TableResultsProvider>
        </>
    )
}

TableResultsFiles.defaultProps = {}

TableResultsFiles.propTypes = {
    children: PropTypes.node,
    onRowClicked: PropTypes.func
}

export {TableResultsFiles}
