import React from "react";
import { withSearch } from "@elastic/react-search-ui";

function SelectedFilters({ filters, removeFilter }) {
    // Detects if a user has selected an entity type and an organ facet then removed the entity type facet
    let hasEntityFilter = false
    let hasOrganFilter = false
    filters.map((filter, index) => {
        if (filter.field === 'entity_type') {
            hasEntityFilter = true
        }

        if(filter.field === 'organ' || filter.field === 'origin_sample.organ') {
            hasOrganFilter = true;
        }
    });

   if(!hasEntityFilter && hasOrganFilter) {
       removeFilter('organ')
       removeFilter('origin_sample.organ')
   }
}

export default withSearch(({ filters, removeFilter }) => ({
  filters, removeFilter
}))(SelectedFilters);