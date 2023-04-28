import React, {useContext, useEffect, useState, useRef} from 'react'
import PropTypes from 'prop-types'
import DataTable, { createTheme } from 'react-data-table-component'
import {
    checkFilterEntityType,
    checkMultipleFilterEntityType,
    displayBodyHeader, equals,
    getOrganTypeFullName,
    getStatusColor
} from './custom/js/functions'
import AppContext from "../context/AppContext"
import log from 'loglevel'
import Badge from 'react-bootstrap/Badge'
import Select from 'react-select'
import {RESULTS_PER_PAGE} from "../config/config";
import $ from 'jquery'
import {
    PagingInfo
} from "@elastic/react-search-ui";


const handlePagingInfo = (page, resultsPerPage, totalRows) => {
    const $pgInfo = $('.sui-paging-info')
    let upTo = resultsPerPage * page
    upTo = upTo > totalRows ? totalRows : upTo
    $pgInfo.find('strong').eq(0).html(`${((page - 1) * resultsPerPage) + 1} - ${upTo}`)
}

function ResultsPerPage({resultsPerPage, setResultsPerPage, totalRows}) {

    const getOptions = () => {
        let result = []
        for (let x of RESULTS_PER_PAGE) {
            if (x <= totalRows || x - totalRows < 10) {
                result.push(
                    {value: x, label: x}
                )
            }
        }
        return result
    }

    const handleChange = (e) => {
        setResultsPerPage(e.value)
        handlePagingInfo(1, e.value, totalRows)
    }

    const getDefaultValue = () => getOptions().length > 1 ? getOptions()[1] : getOptions()[0]

    return (
        <div className={'sui-react-select'}>&nbsp; {getOptions().length && <Select blurInputOnSelect={false} options={getOptions()} value={getDefaultValue()} onChange={handleChange} name={'resultsPerPage'} />}</div>
    )
}

function TableResults({ children, filters, onRowClicked}) {

    const {isLoggedIn, cache} = useContext(AppContext)
    let hasMultipleEntityTypes = checkMultipleFilterEntityType(filters);
    let pageData = []
    const [resultsPerPage, setResultsPerPage] = useState(RESULTS_PER_PAGE[1])

    createTheme('plain', {
        background: {
            default: 'transparent',
        }})

    const handleOnRowClicked = (row, event) => {
        event.stopPropagation()
        if (onRowClicked === undefined) {
            window.location = "/" + row.entity_type?.raw.toLowerCase() + "?uuid=" + row.uuid?.raw
        } else {
            onRowClicked(event, row.uuid?.raw)
        }
    }

    const handlePageChange = (page, totalRows) => {
        handlePagingInfo(page, resultsPerPage, totalRows)
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
                width: '150px',
            },

        ]
        if (hasMultipleEntityTypes) {
            cols.push(
                {
                    name: 'Entity Type',
                    selector: row => row.entity_type?.raw,
                    sortable: true,
                    width: '150px',
                }
            )
        }
        if (isLoggedIn) {
            cols.push(
                {
                    name: 'Lab ID',
                    selector: row => {
                        const raw = (obj) => obj ? obj.raw : null
                        return raw(row.lab_tissue_sample_id) || raw(row.lab_source_id) || raw(row.lab_dataset_id)
                    },
                    sortable: true,
                    width: '150px',
                }
            )
        }
        cols = cols.concat(columns)
        cols.push(
            {
                name: 'Group',
                selector: row => row.group_name?.raw,
                sortable: true,
                width: '20%',
            }
        )
        return cols;
    }

    const sourceColumns = [
        {
            name: 'Type',
            selector: row => {
                return row.source_type?.raw
            },
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
            selector: row => getOrganTypeFullName(row.organ?.raw),
            sortable: true,
            width: '15%',
        }
    ]

    const datasetColumns = [
        {
            name: 'Data Types',
            selector: row => row.data_types?.raw,
            sortable: true,
            width: '20%',
        },
        {
            name: 'Organ',
            selector: row => getOrganTypeFullName(row?.origin_sample?.raw?.organ),
            sortable: true,
            width: '15%',
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
            width: '100px',
        }
    ]

    const getTableColumns = () => {
        let cols;
        if (checkFilterEntityType(filters) === false) {
            cols = defaultColumns({});
        } else {
            cols = filters.map((filter, index) => {
                let columns = []
                if (filter.field === 'entity_type') {
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
                }
                return defaultColumns({hasMultipleEntityTypes, columns});
            })
            cols = cols[cols.length - 1]
        }

        return cols;
    }

    return (
        <>
            <div className='sui-layout-main-header'>
                <div className='sui-layout-main-header__inner'>
                    <PagingInfo />
                    <ResultsPerPage setResultsPerPage={setResultsPerPage} totalRows={children.length} />
                </div>
            </div>

            <DataTable key={`results-${new Date().getTime()}`}
                       columns={getTableColumns()}
                       data={getTableData()}
                       theme={'plain'}
                       defaultSortAsc={false}
                       pointerOnHover={true}
                       highlightOnHover={true}
                       onChangePage={handlePageChange}
                       onRowClicked={handleOnRowClicked}
                       paginationPerPage={resultsPerPage}
                       paginationRowsPerPageOptions={RESULTS_PER_PAGE}
                       pagination />
        </>

    )
}

TableResults.defaultProps = {}

TableResults.propTypes = {
    children: PropTypes.node
}

export {TableResults, ResultsPerPage}