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

function TableResultsFiles({children, filters, onRowClicked, forData = false, rowFn, inModal = false}) {

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
                selector: row => row.id,
                sortable: false,
                format: column => <input type={'checkbox'} onClick={(e) => handleCheckbox(e)} value={getId(column)} name={`check-${getId(column)}`}/>
            })
        }

        cols.push(
            {
                name: 'ID',
                selector: row => {
                    return row.id
                },
                sortable: true,
            },
        )

        cols.push(
            {
                name: 'Path',
                selector: row => raw(row.path),
                sortable: true,
                format: column => <span data-field='path'>{column.path}</span>,
            },
        )


        cols = cols.concat(columns)

        return cols;
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

                    return defaultColumns({hasMultipleEntityTypes, columns});
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
            <TableResultsProvider getId={getId} getHotLink={getHotLink} rows={children} filters={filters} onRowClicked={onRowClicked} forData={forData} raw={raw} inModal={inModal}>
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
