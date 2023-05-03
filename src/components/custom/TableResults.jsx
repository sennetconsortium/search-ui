import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import DataTable, { createTheme } from 'react-data-table-component'
import {
    checkFilterEntityType,
    checkMultipleFilterEntityType,
    displayBodyHeader, equals,
    getUBKGFullName,
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


const handlePagingInfo = (page, resultsPerPage, totalRows) => {
    try {
        const $pgInfo = $('.sui-paging-info')
        setTimeout(()=> {
            let txt = $('.rdt_Pagination span').eq(1).text()
            txt = totalRows > 0 ? txt.split('of')[0] : '0 - 0'
            $pgInfo.find('strong').eq(0).html(`${txt}`)
        }, 100)
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

function TableResults({children, filters, onRowClicked}) {

    const {isLoggedIn, cache} = useContext(AppContext)
    let hasMultipleEntityTypes = checkMultipleFilterEntityType(filters);
    let pageData = []
    const [resultsPerPage, setResultsPerPage] = useState(RESULTS_PER_PAGE[1])

    createTheme('plain', {
        background: {
            default: 'transparent',
        }})

    const getHotLink = (row) => "/" + row.entity_type?.raw.toLowerCase() + "?uuid=" + row.uuid?.raw

    const handleOnRowClicked = (row, event) => {
        event.stopPropagation()
        if (onRowClicked === undefined) {
            window.location = getHotLink(row)
        } else {
            onRowClicked(event, row.uuid?.raw)
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
        log.debug('Results', children)
        handlePageChange(1, children.length)
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

    const defaultColumns = ({hasMultipleEntityTypes = true, columns = []}) => {
        let cols = [
            {
                name: 'SenNet ID',
                selector: row => row.sennet_id?.raw,
                sortable: true,
                format: column => <a href={getHotLink(column)}>{column.id}</a>,
                maxWidth: '20%'
            },
        ]
        if (hasMultipleEntityTypes) {
            cols.push({
                name: 'Entity Type',
                selector: row => row.entity_type?.raw,
                sortable: true,
                maxWidth: '17%'
            })
        }
        if (isLoggedIn) {
            cols.push({
                name: 'Lab ID',
                selector: row => {
                    const raw = (obj) => obj ? obj.raw : null
                    return raw(row.lab_tissue_sample_id) || raw(row.lab_source_id) || raw(row.lab_dataset_id)
                },
                sortable: true,
                width: hasMultipleEntityTypes ? '25%' : '20%'
            })
        }
        cols = cols.concat(columns)
        cols.push({
                name: 'Group',
                selector: row => row.group_name?.raw,
                sortable: true,

            })
        return cols;
    }

    const sourceColumns = [
        {
            name: 'Type',
            selector: row => row.source_type?.raw,
            sortable: true,
            width: '15%',
        }
    ]

    const sampleColumns = [
        {
            name: 'Category',
            selector: row => displayBodyHeader(row.sample_category?.raw),
            sortable: true,
            width: '15%',
        },
        {
            name: 'Organ',
            selector: row => getUBKGFullName(row.origin_sample?.raw.organ),
            sortable: true,
            width: '15%',
        }
    ]

    const datasetColumns = [
        {
            name: 'Data Types',
            selector: row => getUBKGFullName(row.data_types?.raw[0]),
            sortable: true,
            width: '17%'
        },
        {
            name: 'Organ',
            selector: row => getUBKGFullName(row?.origin_sample?.raw?.organ),
            sortable: true,
            width: '15%'
        },
        {
            name: 'Status',
            selector: row => {
                return <Badge pill bg={getStatusColor(row.status?.raw)}>{row.status?.raw}</Badge>
            },
            sortable: true,
            sortFunction: (rowA, rowB) => {
                const a = rowA.status?.raw.toLowerCase();
                const b = rowB.status?.raw.toLowerCase();
                if (a > b) {
                    return 1;
                }
                if (b > a) {
                    return -1;
                }
                return 0;
            },
            width: hasMultipleEntityTypes ? '10%' : '12%',
        }
    ]

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

        return cols;
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
                                               noDataComponent={<div style={{padding: '24px'}}>There are currently no published entities available to view. Please sign in to view non-published data.</div>}
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