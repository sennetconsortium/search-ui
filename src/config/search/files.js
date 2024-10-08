import SearchAPIConnector from 'search-ui/packages/search-api-connector';
import {
    doesAggregationHaveBuckets,
    getAuth,
    getFilesIndex,
    getSearchEndPoint,
    isDateFacetVisible
} from '../config';

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
        excludeFilters: [
            {
                type: 'exists',
                field: 'next_revision_uuid',
            }
        ],
        facets: {
            file_extension: {
                label: 'File Type',
                type: 'value',
                field: 'file_extension.keyword',
                filterType: 'any',
                isFilterable: false,
                facetType: 'term',
                isAggregationActive: true,
                isFacetVisible: doesAggregationHaveBuckets('file_extension')
            },
            'organs.type': {
                label: 'Organs',
                type: 'value',
                field: 'organs.type.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
                facetType: 'term',
                isAggregationActive: true,
                isFacetVisible: doesAggregationHaveBuckets('organs.type')
            },
            dataset_type: {
                label: 'Dataset Type',
                type: 'value',
                field: 'dataset_type.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
                facetType: 'term',
                isAggregationActive: true,
                isFacetVisible: doesAggregationHaveBuckets('dataset_type')
            },
            file_info_refresh_timestamp: {
                label: 'Modification Date',
                type: 'range',
                field: 'file_info_refresh_timestamp',
                isExpanded: false,
                filterType: 'any',
                isFilterable: true,
                facetType: 'daterange',
                isFacetVisible: isDateFacetVisible
            },
        },
        disjunctiveFacets: [],
        conditionalFacets: {},
        search_fields: {
            rel_path: {type: 'value'},
            file_extension: {type: 'value'},
            'organs.type': {type: 'value'},
            'samples.type': {type: 'value'},
            dataset_sennet_id: {type: 'value'},
            dataset_type: {type: 'value'}
        },
        source_fields: sourceItems
    },
    initialState: {
        current: 1,
        resultsPerPage: 20,
        sortList: [{
            field: 'source.file_info_refresh_timestamp',
            direction: 'desc'
        }]
    },
    urlPushDebounceLength: 100,
    trackTotalHits: true,
    trackUrlState: true,
    apiConnector: connector,
    hasA11yNotifications: true,
    a11yNotificationMessages: {
        searchResults: ({start, end, totalResults, searchTerm}) =>
            `Searching for "${searchTerm}". Showing ${start} to ${end} results out of ${totalResults}.`,
    },
}