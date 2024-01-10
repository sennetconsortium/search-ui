import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import $ from "jquery";
import AppContext from "./AppContext";
import {RESULTS_PER_PAGE} from "../config/config";
import {createTheme} from "react-data-table-component";
import {handlePagingInfo} from "../components/custom/search/ResultsPerPage";
import log from 'loglevel'
import SearchUIContext from "search-ui/components/core/SearchUIContext";
const TableResultsContext = createContext({})

export const TableResultsProvider = ({ columnsRef, children, getHotLink, rows, filters, onRowClicked, forData = false, raw, getId, inModal = false }) => {

    const {isLoggedIn} = useContext(AppContext)
    const {isLoading} = useContext(SearchUIContext)
    const hasLoaded = useRef(false)
    let pageData = []
    const [resultsPerPage, setResultsPerPage] = useState(RESULTS_PER_PAGE[1])
    const currentColumns = useRef(columnsRef)

    const hasSearch = () => {
        return filters.length > 0 || $('#search').val()?.length > 0
    }

    const getNoDataMessage = () => {
        if (!hasLoaded.current) return (<></>)
        return (
            <div className={'alert alert-warning text-center'} style={{padding: '24px'}}>
                {isLoggedIn() && !hasSearch() && <span>No results to show.</span>}
                {hasSearch() && <span>No results to show. Please check search filters/keywords and try again.</span>}
                {!isLoggedIn() && !hasSearch() && <span>There are currently no published entities available to view.</span>}
                {!isLoggedIn() && <span><br /> To view non-published data, please <a href={'/login'}>log in</a>.</span>}
            </div>
        )
    }

    const [noResultsMessage, setNoResultsMessage] = useState(getNoDataMessage())


    createTheme('plain', {
        background: {
            default: 'transparent',
        }})

    const handleOnRowClicked = (row, e) => {
        e.stopPropagation()
        if (onRowClicked === undefined) {
            window.location = getHotLink(row)
        } else {
            onRowClicked(e, row.uuid?.raw, row)
        }
    }

    const handlePageChange = (page, totalRows) => {
        handlePagingInfo(page, resultsPerPage, totalRows)
    }
    const handleRowsPerPageChange = (currentRowsPerPage, currentPage) => {
        handlePagingInfo(currentPage, currentRowsPerPage, rows.length)
        setResultsPerPage(currentRowsPerPage)
    }

    useEffect(() => {
        hasLoaded.current = true
        setNoResultsMessage(getNoDataMessage())
        if (!forData) {
            log.debug('Results', rows)
            handlePageChange(1, rows.length)
        }
    }, [])

    useEffect(() => {
        setNoResultsMessage(getNoDataMessage())
    }, [filters])

    const getTableData = () => {
        pageData = []
        handlePageChange(1, rows.length)
        if (rows.length) {
            for (let row of rows) {
                let _row = row.props ? row.props.result : row
                pageData.push({..._row, id: raw(_row.id || _row.sennet_id)})
            }
        }
        return pageData;
    }


    return <TableResultsContext.Provider value={{
        getTableData,
        hasSearch,
        inModal,
        raw,
        hasLoaded,
        pageData,
        resultsPerPage,
        setResultsPerPage,
        currentColumns,
        getId,
        rows,
        filters,
        handleRowsPerPageChange,
        handleOnRowClicked,
        handlePageChange,
        noResultsMessage,
        isLoading,
    }}>
        { children }
    </TableResultsContext.Provider>
}

export default TableResultsContext
