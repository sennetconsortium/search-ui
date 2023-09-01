import React, {useRef, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {
    autoBlobDownloader,
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
import 'primeicons/primeicons.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {Chip} from "@mui/material";
import SenNetPopover from "../SenNetPopover";
import DataTable from "react-data-table-component";
import AppModal from "../AppModal";
import FileTreeView from "./entities/dataset/FileTreeView";
import {FILE_KEY_SEPARATOR} from "../../config/config";

const downloadSizeAttr = 'data-download-size'
export const clearDownloadSizeLabel = () => {
    getCheckAll().removeAttr(downloadSizeAttr)
    $('.sui-paging-info .download-size').remove()
}

function TableResultsFiles({children, filters, forData = false, rowFn, inModal = false, rawResponse}) {
    const fileTypeField = 'file_extension'
    let hasMultipleFileTypes = checkMultipleFilterType(filters, fileTypeField);
    const currentColumns = useRef([])
    const hasClicked = useRef(false)
    const [showModal, setShowModal] = useState(false)
    const [fileSelection, setFileSelection] = useState(null)
    let dict = {}

    const getBuckets = ()=> rawResponse.aggregations?.["dataset_uuid.keyword"]?.buckets

    //const [modalData, setModalData] = useState([])
    const [treeViewData, setTreeViewData] = useState([])
    const [showModalDownloadBtn, setShowModalDownloadBtn] = useState(false)
    const currentDatasetUuid = useRef(null)
    const selectedFilesModal = useRef({})

    useEffect(()=> {
        $('.sui-paging-info strong').eq(1).text(getBuckets().length)
    })

    const raw = rowFn ? rowFn : ((obj) => obj ? (obj.raw || obj) : null)
    const applyDownloadSizeLabel = (total) => {
        if (total > 0) {
            getCheckAll().attr(downloadSizeAttr, total)
            $('.sui-paging-info').append(`<span class="download-size"> | Estimated download ${formatByteSize(total)}</span>`)
        }
    }

    const transformResults = () => {
        let results = []

        for (let bucket of getBuckets()) {
            let _bucket = []
            let hits = bucket.hits.hits.hits
            let size = 0
            for (let hit of hits) {
                size += hit['_source'].size
                _bucket.push(hit['_source'])
            }
            let id = hits[0]['_source']['dataset_uuid']
            //Store in dict for constant time access. modal feature
            dict[id] = {data: _bucket, select: {}}
            results.push({
                ...hits[0]['_source'],
                id,
                size,
                list: _bucket
            })
        }
        return results
    }

    const onRowClicked = (e, uuid, data, clicked = false) => {
        const sel = `[name="check-${getId(data)}"]`

        if (!clicked) {
            hasClicked.current = true
            document.querySelector(sel).click()
        }
        const isChecked = $(sel).is(':checked')
        const $checkAll = getCheckAll()
        let total = $checkAll.attr(downloadSizeAttr)
        console.log('Total', total, isChecked)
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

    const getId = (column) => column.id || column.dataset_uuid

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

    const hideModal = () => {
        setShowModal(false)
    }

    const getModalColumns = () => {
        let cols = []
        cols.push(
            {
                name: 'File Path',
                width: '30%',
                selector: row => raw(row.size),
                sortable: true,
                format: row => <span data-field='rel_path' className='cell-wrap'>{raw(row.rel_path)}</span>
            }
        )

        cols.push(
            {
                name: 'File Description',
                width: '60%',
                selector: row => raw(row.description),
                sortable: true,
                format: row => <span data-field='description' className='cell-wrap cell-pd'>{raw(row.description)}</span>
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
        return cols
    }

    const downloadManifest = () => {
        let manifestData  = ''

        for (let key in selectedFilesModal.current[currentDatasetUuid.current].selected){
            let keys = key.split(FILE_KEY_SEPARATOR)
            manifestData += `${keys[0]} /${keys[keys.length - 1]}\n`
        }

        autoBlobDownloader([manifestData], 'text/plain', `data-manifest.txt`)
    }

    const filesModal = (row) => {
        setShowModal(true)
        currentDatasetUuid.current = row.dataset_uuid
        console.log('Files, dataset', row.dataset_uuid)
        //setModalData(dict[row.dataset_uuid].data)
        setTreeViewData(row)
    }

    const handleFileSelection = (e, row) => {
        e.originalEvent.preventDefault()
        e.originalEvent.stopPropagation()

        let _dict = JSON.parse(JSON.stringify(e.value))

        selectedFilesModal.current[row.dataset_uuid] = {row, selected: _dict}

        const show = Object.values(selectedFilesModal.current[row.dataset_uuid].selected).length > 0
        setShowModalDownloadBtn( show )
        setFileSelection(e.value)

    }

    const defaultColumns = ({hasMultipleFileTypes = true, columns = [], _isLoggedIn}) => {
        let cols = []
        if (!inModal) {
            cols.push({
                ignoreRowClick: true,
                name: <BulkExport onCheckAll={onCheckAll} data={transformResults()} raw={raw} columns={currentColumns} exportKind={'manifest'} />,
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
                width: '200px',
                selector: row => raw(row.dataset_sennet_id),
                sortable: true,
                format: column => inModal ? raw(column.dataset_sennet_id) : <span data-field='dataset_sennet_id'><a href={getHotLink(column)}>{raw(column.dataset_sennet_id)}</a> <ClipboardCopy text={raw(column.dataset_sennet_id)} title={'Copy SenNet ID {text} to clipboard'} /></span>,
            }
        )

        cols.push(
            {
                name: 'Files',
                minWidth: '50%',
                selector: row => raw(row.description),
                sortable: true,
                format: (row) => {
                    let paths = []
                    let i = 0
                    for (let item of row.list) {
                        paths.push(
                            <span key={`rel_path_${i}`} className={'cell-nowrap'}><span className={'pi pi-fw pi-file'} role={'presentation'}></span><small><a data-field='rel_path' href={'#'}>{raw(item.rel_path)}</a></small><br /></span>
                        )
                        i++
                    }
                    return (<div>{raw(row.description)} {raw(row.description) && <br />}
                        {paths.length > 2 ? paths.slice(0, 2) : paths}
                        {paths.length > 2 && <SenNetPopover text={'View more files details'} className={`popover-${getId(row)}`}>
                            <Chip label={<MoreHorizIcon />} size="small" onClick={()=> filesModal(row)} />
                        </SenNetPopover>}
                    </div>)
                }
            }
        )

        // if (hasMultipleFileTypes) {
        //     cols.push({
        //         name: 'File Type',
        //         selector: row => raw(row.file_extension),
        //         sortable: true,
        //         format: row => <span data-field={fileTypeField}>{raw(row.file_extension)?.toUpperCase()}</span>,
        //     })
        // }

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
            <TableResultsProvider getId={getId} rows={transformResults()} filters={filters} onRowClicked={onRowClicked} forData={forData} raw={raw} inModal={inModal}>
                <SenNetAlert variant={'warning'} className="clt-alert"
                             text=<>In order to download the files that are included in the manifest file,&nbsp;
                    <a href="https://github.com/x-atlas-consortia/clt" target='_blank' className={'lnk--ic'}>install <BoxArrowUpRight/></a> the CLT and <a href="https://docs.sennetconsortium.org/libraries/clt/">follow the instructions</a> for how to use it with the manifest file.
                <br /><small className={'text-muted'}>Note: For transferring data to the local machine, the <a href={'https://www.globus.org/globus-connect-personal'} target='_blank' className={'lnk--ic'}>Globus Connect Personal (GCP)<BoxArrowUpRight/></a> endpoint must also be up and running.</small>
                </> />
                <ResultsBlock
                    tableClassName={'rdt_Results--Files'}
                    getTableColumns={getTableColumns}
                />
                <AppModal
                    className={`modal--filesView`}
                    modalSize={'xl'}
                    showModal={showModal}
                    modalTitle={'Files Details'}
                    //<DataTable columns={getModalColumns()} data={modalData} className={'rdt_Results--Files'} />
                    modalBody={
                        <FileTreeView data={treeViewData}
                        selection={{mode: 'checkbox', value: fileSelection, setValue: handleFileSelection, args: treeViewData }}
                        keys={{files: 'list', uuid: 'dataset_uuid'}}
                        loadDerived={false}
                        treeViewOnly={true}
                        className={'c-treeView__main--inTable'} />
                }
                    handleClose={hideModal}
                    handleHome={downloadManifest}
                    showHomeButton={showModalDownloadBtn}
                    actionButtonLabel={'Download Manifest'}
                    showCloseButton={true}
                    closeButtonLabel={'Close'}
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
