import React, {useContext, useEffect, useState, useRef} from 'react'
import PropTypes from 'prop-types'
import DataTable, { createTheme } from 'react-data-table-component'
import {
    checkFilterEntityType,
    checkMultipleFilterEntityType,
    displayBodyHeader, equals, getEntityViewUrl, getUBKGFullName,
    getStatusColor
} from './js/functions'
import AppContext from "../../context/AppContext"
import log from 'loglevel'
import Badge from 'react-bootstrap/Badge'
import Select from 'react-select'
import {RESULTS_PER_PAGE} from "../../config/config";
import $ from 'jquery'
import {
    PagingInfo
} from "@elastic/react-search-ui";
import ClipboardCopy from "../ClipboardCopy";
import BulkExport, {handleCheckAll, handleCheckbox} from "./BulkExport";


const handlePagingInfo = (page, resultsPerPage, totalRows) => {
    try {
        handleCheckAll()
        const $pgInfo = $('.sui-paging-info')
        let from = (page - 1) * resultsPerPage + 1
        let to = page * resultsPerPage
        to = to > totalRows ? totalRows : to
        let txt = totalRows > 0 ? `${from} - ${to}` : '0 - 0'
        $pgInfo.find('strong').eq(0).html(`${txt}`)
    } catch (e) {
        console.error(e)
    }
}

let opsDict
const getOptions = (totalRows) => {
    let result = []
    opsDict = {}
    for (let x of RESULTS_PER_PAGE) {
        if (x <= totalRows || x - totalRows < 10) {
            opsDict[x] = {value: x, label: x}
            result.push(
                {value: x, label: x}
            )
        }
    }
    return result
}

function ResultsPerPage({resultsPerPage, setResultsPerPage, totalRows}) {
    const getDefaultValue = () => getOptions(totalRows).length > 1 ? getOptions(totalRows)[1] : getOptions(totalRows)[0]

    const [value, setValue] = useState(getDefaultValue())

    const handleChange = (e) => {
        setResultsPerPage(e.value)
        setValue(e)
        handlePagingInfo(1, e.value, totalRows)
    }

    const getCurrentValue = () => {
        const hasValue = value !== undefined
        if (hasValue && resultsPerPage !== value.value) {
            return opsDict[resultsPerPage]
        }
        return hasValue && opsDict[value.value] ? value : getDefaultValue()
    }

    return (
        <div className={'sui-react-select'}>&nbsp; {getOptions(totalRows).length > 0 && <Select blurInputOnSelect={false} options={getOptions(totalRows)} defaultValue={getDefaultValue()} value={getCurrentValue()} onChange={handleChange} name={'resultsPerPage'} />}</div>
    )
}

function TableResults({children, filters, onRowClicked, forData = false, rowFn, inModal = false}) {

    const {isLoggedIn, cache} = useContext(AppContext)
    let hasMultipleEntityTypes = checkMultipleFilterEntityType(filters);
    const hasLoaded = useRef(false)
    let pageData = []
    const [resultsPerPage, setResultsPerPage] = useState(RESULTS_PER_PAGE[1])
    const currentColumns = useRef([])

    createTheme('plain', {
        background: {
            default: 'transparent',
        }})

    const raw = rowFn ? rowFn : ((obj) => obj ? obj.raw : null)

    const getHotLink = (row) => getEntityViewUrl(raw(row.entity_type)?.toLowerCase(), raw(row.uuid), {})


    const handleOnRowClicked = (row, e) => {
        e.stopPropagation()
        if (onRowClicked === undefined) {
            window.location = getHotLink(row)
        } else {
            onRowClicked(e, row.uuid?.raw)
        }
    }

    const handlePageChange = (page, totalRows) => {
        handlePagingInfo(page, resultsPerPage, totalRows)
    }
    const handleRowsPerPageChange = (currentRowsPerPage, currentPage) => {
        handlePagingInfo(currentPage, currentRowsPerPage, children.length)
        setResultsPerPage(currentRowsPerPage)
    }

    useEffect(() => {
        hasLoaded.current = true
        if (!forData) {
            log.debug('Results', children)
            handlePageChange(1, children.length)
        }
    }, [])


    const getTableData = () => {
        pageData = []
        handlePageChange(1, children.length)
        if (children.length) {
            for (let row of children) {
                pageData.push({...row.props.result, id: row.props.result.sennet_id.raw})
            }
        }
        return pageData;
    }
    const getId = (column) => column.id || column.sennet_id

    const defaultColumns = ({hasMultipleEntityTypes = true, columns = [], _isLoggedIn}) => {
        let cols = []
        if (!inModal) {
            cols.push({
                ignoreRowClick: true,
                name: <BulkExport data={children} raw={raw} columns={currentColumns} />,
                width: '100px',
                className: 'text-center',
                selector: row => raw(row.sennet_id),
                sortable: false,
                format: column => <input type={'checkbox'} onClick={(e) => handleCheckbox(e)} value={getId(column)} name={`check-${getId(column)}`}/>
            })
        }

        cols.push(
            {
                name: 'SenNet ID',
                selector: row => raw(row.sennet_id),
                sortable: true,
                format: column => inModal ? getId(column) : <span><a href={getHotLink(column)}>{getId(column)}</a> <ClipboardCopy text={getId(column)} title={'Copy SenNet ID {text} to clipboard'} /></span>,
            },
        )
        if (hasMultipleEntityTypes) {
            cols.push({
                name: 'Entity Type',
                selector: row => raw(row.entity_type),
                sortable: true,
            })
        }
        if (isLoggedIn || _isLoggedIn) {
            cols.push({
                name: 'Lab ID',
                selector: row => {
                    return raw(row.lab_tissue_sample_id) || raw(row.lab_source_id) || raw(row.lab_dataset_id)
                },
                sortable: true,
            })
        }
        cols = cols.concat(columns)
        cols.push({
                name: 'Group',
                selector: row => raw(row.group_name),
                sortable: true,
            })
        return cols;
    }

    const sourceColumns = [
        {
            name: 'Type',
            selector: row => raw(row.source_type),
            sortable: true,
        }
    ]

    const sampleColumns = [
        {
            name: 'Category',
            selector: row => raw(row.sample_category) ? displayBodyHeader(raw(row.sample_category)) : null,
            sortable: true,
        },
        {
            name: 'Organ',
            selector: row => getUBKGFullName(raw(row.origin_sample)?.organ),
            sortable: true,
        }
    ]

    const datasetColumns = [
        {
            name: 'Data Types',
            selector: row => {
                let val = raw(row.data_types)
                if (val) {
                    return Array.isArray(val) ? getUBKGFullName(val[0]) : val
                }
            },
            sortable: true,
        },
        {
            name: 'Organ',
            selector: row => getUBKGFullName(raw(row.origin_sample)?.organ),
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => raw(row.status),
            format: (row) => <Badge pill bg={getStatusColor(raw(row.status))}>{raw(row.status)}</Badge>,
            sortable: true,
            //width: hasMultipleEntityTypes ? '10%' : '12%',
        }
    ]

    const hasSearch = () => {
        return filters.length > 0 || $('#search').val()?.length > 0
    }

    const getNoDataMessage = () => {
        if (!hasLoaded.current) return (<></>)
        return (
            <div className={'alert alert-warning text-center'} style={{padding: '24px'}}>
                {hasSearch() && <span>No results to show. Please check search filters/keywords and try again.</span>}
                {!isLoggedIn() && !hasSearch() && <span>There are currently no published entities available to view.</span>}
                {!isLoggedIn() && <span><br /> To view non-published data, please <a href={'/login'}>sign-in</a>.</span>}
            </div>
        )
    }

    const getTableColumns = () => {
        let cols;
        if (checkFilterEntityType(filters) === false) {
            cols = defaultColumns({});
        } else {
            let typeIndex = 0;
            cols = filters.map((filter, index) => {
                let columns = []
                if (filter.field === 'entity_type') {
                    typeIndex = index
                    const hasOneEntity = filter.values.length === 1
                    const entityType = filter.values[0]
                    if (hasOneEntity && equals(entityType, cache.entities.source)) {
                        columns = sourceColumns
                    } else if (hasOneEntity && equals(entityType, cache.entities.sample)) {
                        columns = sampleColumns
                    } else if (hasOneEntity && equals(entityType, cache.entities.dataset)) {
                        columns = datasetColumns
                    } else {
                        log.debug('Table Results', hasMultipleEntityTypes)
                    }
                    return defaultColumns({hasMultipleEntityTypes, columns});
                }
            })
            cols = cols[typeIndex]
        }
        currentColumns.current = cols;
        return cols;
    }

    if (forData) {
        return {sourceColumns, sampleColumns, datasetColumns, defaultColumns}
    }

    // Prepare opsDict
    getOptions(children.length)

    return (
        <>

            <div className='sui-layout-main-header'>
                <div className='sui-layout-main-header__inner'>
                    <PagingInfo />
                    <ResultsPerPage resultsPerPage={resultsPerPage} setResultsPerPage={setResultsPerPage} totalRows={children.length}  />
                </div>
            </div>

            {<DataTable key={`results-${new Date().getTime()}`}
                                               className='rdt_Results'
                                               columns={getTableColumns()}
                                               data={getTableData()}
                                               theme={'plain'}
                                               defaultSortAsc={false}
                                               pointerOnHover={true}
                                               highlightOnHover={true}
                                               noDataComponent={getNoDataMessage()}
                                               onChangePage={handlePageChange}
                                               onChangeRowsPerPage={handleRowsPerPageChange}
                                               onRowClicked={handleOnRowClicked}
                                               paginationPerPage={resultsPerPage}
                                               paginationRowsPerPageOptions={Object.keys(opsDict)}
                                               pagination/>}
        </>
    )
}

TableResults.defaultProps = {}

TableResults.propTypes = {
    children: PropTypes.node,
    onRowClicked: PropTypes.func
}

export {TableResults, ResultsPerPage}