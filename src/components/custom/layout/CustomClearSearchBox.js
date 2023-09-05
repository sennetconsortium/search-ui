import React, { useContext } from "react";
import {withSearch} from "@elastic/react-search-ui";
import SearchUIContext from "search-ui/components/core/SearchUIContext";

function CustomClearSearchBox({shouldClearFilters = true}) {
    const { clearSearchTerm } = useContext(SearchUIContext)

    function handleClearFiltersClick() {
        clearSearchTerm(shouldClearFilters)
    }

    return (
        <div className="clear-filter-div">
            <button className="btn btn-outline-primary rounded-0 clear-filter-button"
                    onClick={handleClearFiltersClick}>Clear filters
            </button>
        </div>
    );
}

export default withSearch(({setSearchTerm, shouldClearFilters}) => ({
    setSearchTerm, shouldClearFilters
}))(CustomClearSearchBox);