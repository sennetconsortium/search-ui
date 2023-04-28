import React, {useContext, useEffect, useState, useRef} from 'react'
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component'
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



function TableResults({ children, filters}) {

    const {isLoggedIn, cache} = useContext(AppContext)
    let hasMultipleEntityTypes = checkMultipleFilterEntityType(filters);
    let pageData = useRef([])


    if (children.length) {
        for (let row of children) {
            pageData.current.push({...row.props.result, id: row.props.result.sennet_id.raw})
        }
    }

    useEffect(() => {
        console.log(children)
    }, [])

    const defaultColumns = ({hasMultipleEntityTypes = true, columns = []}) => {
        let cols = [
            {
                name: 'SenNet ID',
                selector: row => row.sennet_id.raw,
                sortable: true,
                width: '150px',
            },

        ]
        if (hasMultipleEntityTypes) {
            cols.push(
                {
                    name: 'Entity Type',
                    selector: row => row.entity_type.raw,
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
                selector: row => row.group_name.raw,
                sortable: true,
                width: '40%',
            }
        )
        return cols;
    }

    const sourceColumns = [
        {
            name: 'Type',
            selector: row => row.source_type.raw,
            sortable: true,
            width: '100px',
        }
    ]

    const sampleColumns = [
        {
            name: 'Category',
            selector: row => row.sample_category.raw,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Organ',
            selector: row => row.organ.raw,
            sortable: true,
            width: '100px',
        }
    ]

    const datasetColumns = [
        {
            name: 'Data Types',
            selector: row => row.data_types.raw,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Organ',
            selector: row => row?.origin_sample?.raw?.organ,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Status',
            selector: row => {
                return <Badge pill bg={getStatusColor(row.status.raw)}>{row.status.raw}</Badge>
            },
            sortable: true,
            width: '100px',
        }
    ]

    const getTableColumns = () => {
        if (checkFilterEntityType(filters) === false) {
            return defaultColumns({});
        }
        filters.map((filter, index) => {
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
    }

    return (
        <DataTable key={`results-${new Date().getTime()}`}
                   columns={getTableColumns()}
                   data={pageData.current}
                   pagination>
        </DataTable>
    )
}

TableResults.defaultProps = {}

TableResults.propTypes = {
    children: PropTypes.node
}

export {TableResults}