import React, {useContext, useRef} from 'react'
import PropTypes from 'prop-types'
import {
    checkFilterEntityType,
    checkMultipleFilterEntityType,
    displayBodyHeader, equals, getEntityViewUrl, getUBKGFullName,
    getStatusColor
} from './js/functions'
import AppContext from "../../context/AppContext"
import log from 'loglevel'
import Badge from 'react-bootstrap/Badge'
import ClipboardCopy from "../ClipboardCopy";
import BulkExport, {handleCheckbox} from "./BulkExport";
import {getOptions} from "./search/ResultsPerPage";
import ResultsBlock from "./search/ResultsBlock";
import {TableResultsProvider} from "../../context/TableResultsContext";

function TableResultsEntities({children, filters, onRowClicked, forData = false, rowFn, inModal = false}) {

    let hasMultipleEntityTypes = checkMultipleFilterEntityType(filters);
    const {isLoggedIn, cache} = useContext(AppContext)
    const currentColumns = useRef([])

    const raw = rowFn ? rowFn : ((obj) => obj ? obj.raw : null)

    const getHotLink = (row) => getEntityViewUrl(raw(row.entity_type)?.toLowerCase(), raw(row.uuid), {})

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
                format: column => inModal ? raw(column.sennet_id) : <span data-field='sennet_id'><a href={getHotLink(column)}>{raw(column.sennet_id)}</a> <ClipboardCopy text={raw(column.sennet_id)} title={'Copy SenNet ID {text} to clipboard'} /></span>,
            },
        )
        if (hasMultipleEntityTypes) {
            cols.push({
                name: 'Entity Type',
                selector: row => raw(row.entity_type),
                sortable: true,
                format: row => <span data-field='entity_type'>{raw(row.entity_type)}</span>,
            })
        }
        if (isLoggedIn || _isLoggedIn) {
            cols.push({
                name: 'Lab ID',
                selector: row => {
                    return raw(row.lab_tissue_sample_id) || raw(row.lab_source_id) || raw(row.lab_dataset_id)
                },
                format: row => <span data-field='lab_id'>{raw(row.lab_tissue_sample_id) || raw(row.lab_source_id) || raw(row.lab_dataset_id)}</span>,
                sortable: true,
            })
        }
        cols = cols.concat(columns)
        cols.push({
                name: 'Group',
                selector: row => raw(row.group_name),
                sortable: true,
                format: row => <span data-field='group_name'>{raw(row.group_name)}</span>,
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
            sortable: true
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
            <TableResultsProvider getId={getId} getHotLink={getHotLink} rows={children} filters={filters} onRowClicked={onRowClicked} forData={forData} raw={raw} inModal={inModal}>
                <ResultsBlock
                    getTableColumns={getTableColumns}
                />
            </TableResultsProvider>
        </>
    )
}

TableResultsEntities.defaultProps = {}

TableResultsEntities.propTypes = {
    children: PropTypes.node,
    onRowClicked: PropTypes.func
}

export {TableResultsEntities}
