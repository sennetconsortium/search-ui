import moment from "moment";
import React from 'react';
import { useRouter } from 'next/router';
import SearchAPIConnector from "../search-ui/packages/search-api-connector";

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
    //console.log("getAuth()", localStorage.getItem("info"))
    return JSON.parse(localStorage.getItem("info")).groups_token
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
//    disjunctiveFacets: ["experimental_approach", "keyword"],
    facets: {
        entity_type: {
            type: "value",
            field: "entity_type.keyword"
        },
        specimen_type: {
            type: "value",
            field: "specimen_type.keyword"
        },
        organ: {
            type: "value",
            field: "organ.keyword"
        },

    },
    search_fields: {
      title: { type: "value" },
      description: { type: "value" },
      uuid: { type: "value"},
      entity_type: { type: "value"},
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
    searchResults: ({ start, end, totalResults, searchTerm }) =>
      `Searching for "${searchTerm}". Showing ${start} to ${end} results out of ${totalResults}.`
  },
};

// some sort fields require .keyword in order to sort them
export const SORT_OPTIONS = [
  {
    name: "Entity Type",
    value: [
        {
            field: "entity_type",
            direction: "asc"
        }
    ]
  }
//  {
//    name: "Date issued",
//    value: [
//      {
//        field: "issued",
//        direction: "asc"
//      }
//    ]
//  },
//  {
//    name: "Experimental Approach",
//    value: [
//      {
//        field: "experimental_approach.keyword",
//        direction: "asc"
//      }
//    ]
//  }
];

export const ENTITY_TYPES = [
	"Dataset",
	"Sample",
	"Source"
];