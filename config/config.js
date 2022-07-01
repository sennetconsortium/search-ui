import moment from "moment";
import React from 'react';
import {useRouter} from 'next/router';
import SearchAPIConnector from "../search-ui/packages/search-api-connector";
import cookieCutter from 'cookie-cutter'

//const auth_token = JSON.parse(localStorage.getItem("info")).auth_token
// const ls = window.localStorage
// console.log(ls)
//const auth_token = ""

export const APP_TITLE = "SenNet: Data Sharing Portal"
//export const auth_token = getAuth();


// points to the search-api configured index
const INDEX = "portal"


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
        // result_fields: {
        //   publisher: { raw: {} },
        //   publisher_email: { raw: {} },
        //   title: {
        //     snippet: {
        //       size: 100,
        //       fallback: true
        //     }
        //   },
        //   doi_url: { raw: {} },
        //   globus_url: { raw: {} },
        //   description: {
        //     snippet: {
        //       size: 100,
        //       fallback: true
        //     }
        //   }
        // },
   // disjunctiveFacets: ["entity_type"],
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
        search_fields: {
            title: {type: "value"},
            description: {type: "value"},
            uuid: {type: "value"},
            entity_type: {type: "value"},
            specimen_type: {type: "value"}
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
        name: "Entity Type",
        value: [
            {
                field: "entity_type.keyword",
                direction: "asc"
            }
        ]
    },
    {
        name: "Date Created",
        value: [
            {
                field: "created_timestamp",
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