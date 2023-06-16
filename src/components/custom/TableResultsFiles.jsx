import React, {useContext, useRef} from 'react'
import PropTypes from 'prop-types'
import {
    checkFilterType,
    checkMultipleFilterType,
    getEntityViewUrl, getUBKGFullName,
} from './js/functions'
import AppContext from "../../context/AppContext"
import BulkExport, {handleCheckbox} from "./BulkExport";
import {getOptions} from "./search/ResultsPerPage";
import ResultsBlock from "./search/ResultsBlock";
import {TableResultsProvider} from "../../context/TableResultsContext";

function TableResultsFiles({children, filters, onRowClicked, forData = false, rowFn, inModal = false}) {
    const fileTypeField = 'file_extension'
    let hasMultipleFileTypes = checkMultipleFilterType(filters, fileTypeField);
    const currentColumns = useRef([])

    const raw = rowFn ? rowFn : ((obj) => obj ? obj.raw : null)

    const getHotLink = (row) => getEntityViewUrl(raw(row.entity_type)?.toLowerCase(), raw(row.uuid), {})

    const getId = (column) => column.id || column.sennet_id

    const defaultColumns = ({hasMultipleFileTypes = true, columns = [], _isLoggedIn}) => {
        let cols = []
        if (!inModal) {
            cols.push({
                ignoreRowClick: true,
                name: <BulkExport data={children} raw={raw} columns={currentColumns} exportKind={'manifest'} />,
                width: '100px',
                className: 'text-center',
                selector: row => row.id,
                sortable: false,
                format: column => <input type={'checkbox'} onClick={(e) => handleCheckbox(e)} value={getId(column)} name={`check-${getId(column)}`}/>
            })
        }

        cols.push(
            {
                name: 'Path',
                selector: row => raw(row.rel_path),
                sortable: true,
                format: row => <a data-field='rel_path' href={'#'}>{raw(row.rel_path)}</a>,
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
                format: row => <span>{(raw(row.size)/ 1024).toFixed(2)} mb</span>
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
            <TableResultsProvider getId={getId} getHotLink={getHotLink} rows={children} filters={filters} onRowClicked={onRowClicked} forData={forData} raw={raw} inModal={inModal}>
                <ResultsBlock
                    disableRowClick={true}
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
