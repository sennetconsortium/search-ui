import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {opsDict, ResultsPerPage} from "./ResultsPerPage";
import DataTable from "react-data-table-component";
import {
    PagingInfo
} from "@elastic/react-search-ui";
import TableResultsContext from "../../../context/TableResultsContext";
import SelectedFacets from "./SelectedFacets";

function ResultsBlock({getTableColumns, disableRowClick, tableClassName}) {

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

    useEffect(() => {
    }, [])

    return (
        <>
            <div className='sui-layout-main-header'>
                <div className='sui-layout-main-header__inner'>
                    <PagingInfo />
                    <ResultsPerPage resultsPerPage={resultsPerPage} setResultsPerPage={setResultsPerPage} totalRows={rows.length}  />
                </div>
            </div>

            {<DataTable key={`results-${new Date().getTime()}`}
                        className={`rdt_Results ${!inModal ? 'rdt_Results--hascheckboxes' : ''} ${tableClassName}`}
                        columns={getTableColumns()}
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