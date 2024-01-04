import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {opsDict, ResultsPerPage} from "./ResultsPerPage";
import DataTable from "react-data-table-component";
import {
    PagingInfo
} from "@elastic/react-search-ui";
import TableResultsContext from "../../../context/TableResultsContext";
import ColumnsDropdown from "./ColumnsDropdown";

function ResultsBlock({getTableColumns, disableRowClick, tableClassName, defaultHiddenColumns}) {

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
    } = useContext(TableResultsContext)

    const [hiddenColumns, setHiddenColumns] = useState([])

    useEffect(() => {

    }, [])


    return (
        <>
            <div className='sui-layout-main-header'>
                <div className='sui-layout-main-header__inner'>
                    <PagingInfo />
                    {rows.length > 0 && <ColumnsDropdown filters={filters} defaultHiddenColumns={defaultHiddenColumns} getTableColumns={getTableColumns} setHiddenColumns={setHiddenColumns}
                                      currentColumns={currentColumns.current} />}
                    <ResultsPerPage resultsPerPage={resultsPerPage} setResultsPerPage={setResultsPerPage} totalRows={rows.length}  />
                </div>
            </div>

            {<DataTable key={`results-${new Date().getTime()}`}
                        onColumnOrderChange={cols => {
                            currentColumns.current.current = cols
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
                        pagination/>}
        </>
    )
}

ResultsBlock.defaultProps = {
    tableClassName: ''
}

ResultsBlock.propTypes = {
    tableClassName: PropTypes.string
}

export default ResultsBlock