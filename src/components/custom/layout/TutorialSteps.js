import React from "react";

function TutorialSteps(loggedIn) {
    const stepsCount = loggedIn ? 7 : 5
    let _steps = [
        {
            target: '#search',
            disableBeacon: true,
            title: <span>Search Entities by Free Text (1/{stepsCount})</span>,
            content: 'To further narrow the relevant entities, type search terms or phrases into the Search bar. Entities containing any of the search terms will be returned.'
        },
        {
            target: '#searchDropdown',
            title: <span>Search Entities or Metadata (2/{stepsCount})</span>,
            content: 'The default option to search by entities allows you to filter results based on the core properties of various entity types. You can also search and filter the metadata that has been submitted to registered entities.',
        },
        {
            target: '.sui-facet',
            title: <span>Filter Your Browsing (3/{stepsCount})</span>,
            content: 'The faceted search options on the left side allows filtering entities by any combination of categories. Search results update automatically as you edit the selection of filters.',
        },
        {
            target: '[data-column-id="2"].rdt_TableCol',
            title: <span>Sort Search Results (4/{stepsCount})</span>,
            content: 'Clicking the header of any column will sort search results. A bolded arrow indicates the current sorting selection. Clicking again will reverse the order.'
        },
        {
            target: '#sui-tbl-checkbox-actions',
            title: <span>Download Search Results (5/{stepsCount})</span>,
            content: <span>Clicking on the checkboxes <input type={'checkbox'} role='presentation' disabled /> on the left side of the search results table allows selecting distinct entities for export. Clicking on the ellipsis <button
                role='presentation'
                className="dropdown-toggle btn btn-secondary-outline border-0">...</button> at the top of the search results table allows for exporting either only the selected entities or all entities in the table to a <code>JSON</code> or <code>TSV</code> format.</span>
        }
    ]
    if (loggedIn){
        _steps.push({
            target: '#nav-dropdown',
            title: <span>Registering entities (5/{stepsCount})</span>,
            content: <span>You may register individual and bulk entities by clicking on this menu. Then selecting under <i>Single</i> for single registration or under <i>Bulk</i> for bulk registration.</span>
        })

        _steps.push({
            target: '#nav-dropdown--bulkMetadata',
            title: <span>Bulk uploading metadata (6/{stepsCount})</span>,
            content: <span>Select this menu to bulk upload metadata. <br /> <small className='text-muted'>Note: You may also upload metadata for a single entity during registration. See previous step for details.</small></span>
        })
    }
    return _steps
}
export default TutorialSteps