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
        excludeFilters: [{
            keyword: "entity_type.keyword",
            value: "Collection"
        }, {
            keyword: "entity_type.keyword",
            value: "Publication"
        }
        ],
        result_fields: {
          path: {raw: {}}
        },
        facets: {
            entity_type: {
                label: 'Entity Type',
                type: 'value',
                field: 'entity_type.keyword',
                filterType: 'any',
                isFilterable: false,
            },
            group_name: {
                label: 'Data Provider Group',
                type: 'value',
                field: 'group_name.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            created_by_user_displayname: {
                label: 'Registered By',
                type: 'value',
                field: 'created_by_user_displayname.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            created_timestamp: {
                label: 'Creation Date',
                type: 'range',
                field: 'created_timestamp',
                isExpanded: false,
                filterType: 'any',
                isFilterable: true,
                uiType: 'daterange',
            },
            last_modified_timestamp: {
                label: 'Modification Date',
                type: 'range',
                field: 'last_modified_timestamp',
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
            path: {type: 'value'},
            description: {type: 'value'},
            group_name: {type: 'value'},
            sennet_id: {type: 'value'},
            created_by_user_displayname: {type: 'value'},
            created_by_user_email: {type: 'value'}
        },
        source_fields: [
            'sennet_id',
            'entity_type',
            'uuid',
            'path',
            'created_by_user_displayname',
            'created_by_user_email',
            'lab_tissue_sample_id',
            'lab_source_id',
            'lab_dataset_id',
            'group_name',
            'last_modified_timestamp'
        ],
    },
    initialState: {
        resultsPerPage: 10000,
        sortList: [{
            field: "last_modified_timestamp",
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