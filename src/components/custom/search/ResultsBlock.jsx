import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {opsDict, ResultsPerPage} from "./ResultsPerPage";
import DataTable from "react-data-table-component";
import {
    PagingInfo
} from "@elastic/react-search-ui";
import TableResultsContext from "../../../context/TableResultsContext";
import ColumnsDropdown from "./ColumnsDropdown";
import {eq} from '../js/functions'
import {COLS_ORDER_KEY} from "../../../config/config";
import Spinner from '../Spinner';

function ResultsBlock({getTableColumns, disableRowClick, tableClassName, defaultHiddenColumns, searchContext}) {

    const {
        getTableData,
        noResultsMessage,
        hasSearch,
        inModal,
        raw,
        rows,
        hasLoaded,
        pageData,
        resultsPerPage,
        setResultsPerPage,
        currentColumns,
        getId,
        filters,
        handleRowsPerPageChange,
        handleOnRowClicked,
        handlePageChange,
        isLoading,
    } = useContext(TableResultsContext)

    const [hiddenColumns, setHiddenColumns] = useState(null)

    useEffect(() => {

    }, [])


    return (
        <>
            <div className='sui-layout-main-header'>
                <div className='sui-layout-main-header__inner'>
                    <PagingInfo />
                    {rows.length > 0 && <ColumnsDropdown searchContext={searchContext} filters={filters} defaultHiddenColumns={defaultHiddenColumns} getTableColumns={getTableColumns} setHiddenColumns={setHiddenColumns}
                                      currentColumns={currentColumns.current} />}
                    <ResultsPerPage resultsPerPage={resultsPerPage} setResultsPerPage={setResultsPerPage} totalRows={rows.length}  />
                </div>
            </div>

            {<DataTable key={`results-${new Date().getTime()}`}
                        onColumnOrderChange={cols => {
                            currentColumns.current.current = cols
                            const headers = cols.map((col) => eq(typeof col.name, 'string') ? col.name : col.id)
                            localStorage.setItem(COLS_ORDER_KEY(searchContext()), JSON.stringify(headers))
                        }}
                        className={`rdt_Results ${!inModal ? 'rdt_Results--hascheckboxes' : ''} ${tableClassName}`}
                        columns={getTableColumns(hiddenColumns)}
                        data={getTableData()}
                        theme={'plain'}
                        defaultSortAsc={false}
                        pointerOnHover={true}
                        highlightOnHover={true}
                        noDataComponent={noResultsMessage}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleRowsPerPageChange}
                        onRowClicked={!disableRowClick ? handleOnRowClicked : undefined}
                        paginationPerPage={resultsPerPage}
                        paginationRowsPerPageOptions={Object.keys(opsDict)}
                        pagination
                        progressPending={isLoading}
                        progressComponent={<Spinner />}
                />}
        </>
    )
}

ResultsBlock.defaultProps = {
    tableClassName: '',
    defaultHiddenColumns: []
}

ResultsBlock.propTypes = {
    getTableColumns: PropTypes.func.isRequired,
    disableRowClick: PropTypes.bool,
    tableClassName: PropTypes.string,
    defaultHiddenColumns: PropTypes.array,
    searchContext: PropTypes.func
}

export default ResultsBlock
