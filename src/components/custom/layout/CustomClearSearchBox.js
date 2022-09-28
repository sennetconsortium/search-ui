import React from "react";
import {withSearch} from "@elastic/react-search-ui";

function CustomClearSearchBox({setSearchTerm}, shouldClearFilters) {
    return (
        <div className="clear-filter-div">
            <button className="btn btn-outline-primary rounded-0 clear-filter-button"
                    onClick={() => setSearchTerm("", {shouldClearFilters: true})}>Clear filters
            </button>
        </div>
    );
}

export default withSearch(({setSearchTerm, shouldClearFilters}) => ({
    setSearchTerm, shouldClearFilters
}))(CustomClearSearchBox);