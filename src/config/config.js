import React from 'react';
import SearchAPIConnector from "../search-ui/packages/search-api-connector";
import cookieCutter from 'cookie-cutter'

export const APP_TITLE = "SenNet: Data Sharing Portal"

export function getAuth() {
    if (typeof window !== "undefined") {
        return cookieCutter.get("groups_token")
    }
    return ""
}

export function getIndex() {
    return process.env.NEXT_PUBLIC_INDEX;
}

// points to the search-api endpoint
export function getSearchEndPoint() {
    return process.env.NEXT_PUBLIC_SEARCH_API_ENDPOINT
}

export function getEntityEndPoint() {
    return process.env.NEXT_PUBLIC_ENTITY_API_ENDPOINT
}

export function getIngestEndPoint() {
    return process.env.NEXT_PUBLIC_INGEST_API_ENDPOINT
}


export function getIngestLogin() {
    return process.env.NEXT_PUBLIC_INGEST_LOGIN
}

export function getRootURL() {
    return process.env.NEXT_PUBLIC_APP_ROOT_URL
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
            sample_category: {
                label: "Sample Category",
                type: "value",
                field: "sample_category.keyword",
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
            group_name: {
                label: "Group Name",
                type: "value",
                field: "group_name.keyword",
                filterType: "any",
                isFilterable: false
            },
            created_by_user_displayname: {
                label: "Registered By",
                type: "value",
                field: "created_by_user_displayname.keyword",
                filterType: "anty",
                isFilterable: false
            }

        },
        disjunctiveFacets: ["entity_type", "group_name", "created_by_user_displayname"],
        conditionalFacets: {
            // Only show 'sample_category' facet if 'Sample' is selected from the entity type facet
            'sample_category': ({filters}) => {
                return filters.some(filter => filter.field === 'entity_type' && filter.values.includes('Sample'));
            },

            // Only show 'origin_sample' facet if 'Sample' or 'Dataset' is selected from the entity type facet
            'origin_sample.mapped_organ': ({filters}) => {
                return filters.some(filter => filter.field === 'entity_type' && (filter.values.includes('Sample')
                    || filter.values.includes("Dataset")));
            },
        },
        search_fields: {
            description: {type: "value"},
            group_name: {type: "value"},
            sennet_id: {type: "value"},
            display_doi: {type: "value"},
            lab_source_id: {type: "value"},
            display_subtype: {type: "value"},
            lab_name: {type: "value"},
            lab_tissue_sample_id: {type: "value"},
            lab_dataset_id: {type: "value"},
            created_by_user_displayname: {type: "value"},
            created_by_user_email: {type: "value"},
            dataset_info: {type: "value"},
            "mapped_metadata.race": {type: "value"},
            "mapped_metadata.sex": {type: "value"},
        }
    },
    initialState: {
        resultsPerPage: 10
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

export const RESULTS_PER_PAGE = [
    10, 20, 30
]

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
                field: "sennet_id.keyword",
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
        name: "Sample Category",
        value: [
            {
                field: "sample_category.keyword",
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
    },
    {
        name: "Data Types",
        value: [
            {
                field: "data_types.keyword",
                direction: "asc"
            }
        ]
    },
    // {
    //     name: "Organ",
    //     value: [
    //         {
    //             field: "origin_sample.mapped_organ.keyword",
    //             direction: "asc"
    //         }
    //     ]
    // },
    {
        name: "Status",
        value: [
            {
                field: "status.keyword",
                direction: "asc"
            }
        ]
    },
    {
        name: "Last Modified",
        value: [
            {
                field: "last_modified_timestamp",
                direction: "asc"
            }
        ]
    },
    // {
    //     name: "Age",
    //     value: [
    //         {
    //             field: "mapped_metadata.age_value",
    //             direction: "asc"
    //         }
    //     ]
    // },
    // {
    //     name: "BMI",
    //     value: [
    //         {
    //             field: "mapped_metadata.body_mass_index_value",
    //             direction: "asc"
    //         }
    //     ]
    // },
    // {
    //     name: "Sex",
    //     value: [
    //         {
    //             field: "mapped_metadata.sex.keyword",
    //             direction: "asc"
    //         }
    //     ]
    // },
    // {
    //     name: "Race",
    //     value: [
    //         {
    //             field: "mapped_metadata.race.keyword",
    //             direction: "asc"
    //         }
    //     ]
    // }
];

export const ENTITY_TYPES = [
    "Dataset",
    "Sample",
    "Source"
];