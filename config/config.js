import React from 'react';
import SearchAPIConnector from "../search-ui/packages/search-api-connector";
import cookieCutter from 'cookie-cutter'

//const auth_token = JSON.parse(localStorage.getItem("info")).auth_token
// const ls = window.localStorage
//const auth_token = ""

export const APP_TITLE = "SenNet: Data Sharing Portal"
//export const auth_token = getAuth();


// points to the search-api configured index
const INDEX = "portal"


export function getFilters() {
    return cookieCutter.get("filters")
}

export function getAuth() {
    if (typeof window !== "undefined") {
        return cookieCutter.get("groups_token")
    }
    return ""
}

export function getIndex() {
    return INDEX;
}

// points to the search-api endpoint
export function getSearchEndPoint() {
    return "http://localhost:4444/"
}

export function getRootURL() {
    return "http://localhost:3000/"
}

export const connector = new SearchAPIConnector({
    indexName: getIndex(),
    indexUrl: getSearchEndPoint(),
    accessToken: getAuth()
});

export const config = {
    alwaysSearchOnInitialLoad: true,
    searchQuery: {
        facets: {
            entity_type: {
                label: "Entity Type",
                type: "value",
                field: "entity_type.keyword",
                filterType: "any",
                isFilterable: false
            },
            mapped_specimen_type: {
                label: "Specimen Type",
                type: "value",
                field: "mapped_specimen_type.keyword",
                filterType: "any",
                isFilterable: false
            },
            "origin_sample.mapped_organ": {
                label: "Organ",
                type: "value",
                field: "origin_sample.mapped_organ.keyword",
                filterType: "any",
                isFilterable: false
            },

        },
        disjunctiveFacets: ["entity_type"],
        // conditionalFacets: {
        //
        // },
        search_fields: {
            description: {type: "value"},
            hubmap_id: {type: "value"},
            submission_id: {type: "value"},
            display_doi: {type: "value"},
            lab_donor_id: {type: "value"},
            display_subtype: {type: "value"},
            lab_name: {type: "value"},
            lab_tissue_sample_id: {type: "value"},
            lab_dataset_id: {type: "value"},
            created_by_user_displayname: {type: "value"},
            created_by_user_email: {type: "value"},
            dataset_info: {type: "value"}
        }
    },

    // autocompleteQuery: {
    //   results: {
    //     resultsPerPage: 5,
    //     result_fields: {
    //       title: {
    //         snippet: {
    //           size: 100,
    //           fallback: true
    //         }
    //       }
    //     }
    //   },
    // suggestions: {
    //   types: {
    //     documents: {
    //       fields: ["title"]
    //     }
    //   },
    //   size: 4
    // }
    //},
    // Setting trackUrlState disables the URL from updating the query parameters on filters/serach
    trackUrlState: false,
    apiConnector: connector,
    hasA11yNotifications: true,
    a11yNotificationMessages: {
        searchResults: ({start, end, totalResults, searchTerm}) =>
            `Searching for "${searchTerm}". Showing ${start} to ${end} results out of ${totalResults}.`
    },
};

// some sort fields require .keyword in order to sort them
export const SORT_OPTIONS = [
    {
        name: "Relevance",
        value: []
    },
    {
        name: "Created By",
        value: [
            {
                field: "created_by_user_displayname.keyword",
                direction: "asc"
            }
        ]
    },
    {
        name: "SenNet ID",
        value: [
            {
                field: "hubmap_id.keyword",
                direction: "asc"
            }
        ]
    },
    {
        name: "Submission ID",
        value: [
            {
                field: "submission_id.keyword",
                direction: "asc"
            }
        ]
    },
    {
        name: "Lab ID",
        value: [
            {
                field: "lab_tissue_sample_id.keyword",
                direction: "asc"
            }
        ]
    },
    {
        name: "Type",
        value: [
            {
                field: "mapped_specimen_type.keyword",
                direction: "asc"
            }
        ]
    },
    {
        name: "Group Name",
        value: [
            {
                field: "group_name.keyword",
                direction: "asc"
            }
        ]
    }
];

export const ENTITY_TYPES = [
    "Dataset",
    "Sample",
    "Source"
];