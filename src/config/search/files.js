import {getAuth, getFilesIndex, getSearchEndPoint} from "../config";
import SearchAPIConnector from "search-ui/packages/search-api-connector";


const connector = new SearchAPIConnector({
    indexName: getFilesIndex(),
    indexUrl: getSearchEndPoint(),
    accessToken: getAuth(),
})

const sourceItems = [
    'sennet_id',
    'dataset_sennet_id',
    'checksum',
    'dataset_type',
    'description',
    'dataset_uuid',
    'donors',
    'file_extension',
    'file_info_refresh_timestamp',
    'organs',
    'rel_path',
    'samples',
    'size'
]

export const SEARCH_FILES = {
    alwaysSearchOnInitialLoad: true,
    searchQuery: {
        groupBy: 'dataset_uuid.keyword',
        excludeFilters: [],
        facets: {
            file_extension: {
                label: 'File Type',
                type: 'value',
                field: 'file_extension.keyword',
                filterType: 'any',
                isFilterable: false,
            },
            'organs.type': {
                label: 'Organs',
                type: 'value',
                field: 'organs.type.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            dataset_type: {
                label: 'Dataset Type',
                type: 'value',
                field: 'dataset_type.keyword',
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
            file_extension: {type: 'value'},
            'organs.type': {type: 'value'},
            'samples.type': {type: 'value'},
            dataset_sennet_id: {type: 'value'},
            dataset_type: {type: 'value'}
        },
        source_fields: sourceItems,
        pagination: {
            from: 1,
            size: 20
        }
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