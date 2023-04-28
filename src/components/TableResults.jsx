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
import Spinner from "./custom/Spinner";



function TableResults({ children, filters, onRowClicked}) {

    const {isLoggedIn, cache} = useContext(AppContext)
    let hasMultipleEntityTypes = checkMultipleFilterEntityType(filters);
    let pageData = []
    const [rowsPerPage, setRowsPerPage] = useState(10)

    createTheme('plain', {
        background: {
            default: 'transparent',
        }})

    useEffect(() => {
        console.log('Results', children)
    }, [])

    const handleOnRowClicked = (row, event) => {
        if (onRowClicked === undefined) {
            window.location = "/" + row.entity_type?.raw.toLowerCase() + "?uuid=" + row.uuid?.raw
        }
    }

    const getTableData = () => {
        pageData = []
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
        cols.push.apply(cols, columns);
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
                if (filter.field === 'entity_type') {
                    const hasOneEntity = filter.values.length === 1
                    const entityType = filter.values[0]
                    let columns = []
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
            cols = cols[0]
        }

        return cols;
    }

    if (!getTableData().length) {
        return <Spinner />
    }

    return (
        <DataTable key={`results-${new Date().getTime()}`}
                   columns={getTableColumns()}
                   data={getTableData()}
                   theme={'plain'}
                   defaultSortAsc={false}
                   pointerOnHover={true}
                   highlightOnHover={true}
                   onRowClicked={handleOnRowClicked}
                   paginationPerPage={rowsPerPage}
                   paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100]}
                   pagination />
    )
}

TableResults.defaultProps = {}

TableResults.propTypes = {
    children: PropTypes.node
}

export {TableResults}