import React from "react";
import {withSearch} from "@elastic/react-search-ui";

function CustomClearSearchBox({setSearchTerm, clearFiltersClick}, shouldClearFilters) {

    function handleClearFiltersClick() {
        setSearchTerm("", {shouldClearFilters: true})
        clearFiltersClick()
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