import {FilterIsSelected, getAuth, getFilesIndex, getSearchEndPoint} from "../config";
import SearchAPIConnector from "search-ui/packages/search-api-connector";


const connector = new SearchAPIConnector({
    indexName: getFilesIndex(),
    indexUrl: getSearchEndPoint(),
    accessToken: getAuth(),
})

export const SEARCH_FILES = {
    alwaysSearchOnInitialLoad: true,
    searchQuery: {
        excludeFilters: [],
        facets: {
            file_extension: {
                label: 'File Type',
                type: 'value',
                field: 'file_extension.keyword',
                filterType: 'any',
                isFilterable: false,
            },
            // organs: {
            //     label: 'Organs',
            //     type: 'value',
            //     field: 'organs.keyword',
            //     isExpanded: false,
            //     filterType: 'any',
            //     isFilterable: false,
            // },
            'samples.type': {
                label: 'Sample Category',
                type: 'value',
                field: 'samples.type.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            data_types: {
                label: 'Data Type',
                type: 'value',
                field: 'data_types.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            file_info_refresh_timestamp: {
                label: 'Modification Date',
                type: 'range',
                field: 'file_info_refresh_timestamp',
                isExpanded: false,
                filterType: 'any',
                isFilterable: true,
                uiType: 'daterange',
            },
        },
        disjunctiveFacets: [],
        conditionalFacets: {
        },
        search_fields: {
            rel_path: {type: 'value'},
            'samples.type': {type: 'value'}
        },
        source_fields: [
            'checksum',
            'data_types',
            'donors',
            'file_extension',
            'file_info_refresh_timestamp',
            'organs',
            'rel_path',
            'samples',
            'size'
        ],
    },
    initialState: {
        resultsPerPage: 10000,
        sortList: [{
            field: "source.file_info_refresh_timestamp",
            direction: "desc"
        }]
    },
    trackUrlState: true,
    apiConnector: connector,
    hasA11yNotifications: true,
    a11yNotificationMessages: {
        searchResults: ({start, end, totalResults, searchTerm}) =>
            `Searching for "${searchTerm}". Showing ${start} to ${end} results out of ${totalResults}.`,
    },
}