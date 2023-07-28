import {FilterIsSelected, getAuth, getFilesIndex, getSearchEndPoint} from "../config";
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
    'data_types',
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
        raw: {
            key: 'aggs',
            subKey: 'group_by_dataset_uuid',
            query: {
                terms: {
                    field: "dataset_uuid.keyword"
                },
                aggs:{
                    hits: {
                        top_hits: {
                            _source: sourceItems,
                            size: 100
                        }
                    }
                }
            }
        },
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
        source_fields: sourceItems,
    },
    initialState: {
        resultsPerPage: 0,
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