import SearchAPIConnector from "../search-ui/packages/search-api-connector";
import {getCookie} from 'cookies-next';
import {APP_ROUTES} from './constants'

import _ from 'lodash';

export const APP_TITLE = 'SenNet - Data Sharing Portal'

// Set this to be the time in milliseconds
export const IDLE_TIMEOUT = 1000 * 60 * 60

export function getAuth() {
    if (typeof window !== 'undefined') {
        return getCookie('groups_token')
    }
    return ''
}

const nonSupportedRuiOrgans = ['AO', 'BD', 'BS', 'MU']

export function isOrganRuiSupported(organ) {
    return !nonSupportedRuiOrgans.includes(organ)
}

export function getUserName() {
    return JSON.parse(getCookie('info')).name
}

export function getIndex() {
    return process.env.NEXT_PUBLIC_INDEX
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

export function getLogoutURL() {
    return getIngestEndPoint() + APP_ROUTES.logout.slice(1)
}

export function getGoogleTagManagerId() {
    return process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER
}

export const connector = new SearchAPIConnector({
    indexName: getIndex(),
    indexUrl: getSearchEndPoint(),
    accessToken: getAuth(),
})

export const config = {
    alwaysSearchOnInitialLoad: true,
    searchQuery: {
        facets: {
            entity_type: {
                label: 'Entity Type',
                type: 'value',
                field: 'entity_type.keyword',
                filterType: 'any',
                isFilterable: false,
            },
            sample_category: {
                label: 'Sample Category',
                type: 'value',
                field: 'sample_category.keyword',
                filterType: 'any',
                isFilterable: false,
            },
            'origin_sample.organ': {
                label: 'Organ',
                type: 'value',
                field: 'origin_sample.organ.keyword',
                filterType: 'any',
                isFilterable: false,
            },
            group_name: {
                label: 'Group Name',
                type: 'value',
                field: 'group_name.keyword',
                filterType: 'any',
                isFilterable: false,
            },
            created_by_user_displayname: {
                label: 'Registered By',
                type: 'value',
                field: 'created_by_user_displayname.keyword',
                filterType: 'any',
                isFilterable: false,
            },
        },
        disjunctiveFacets: [
            'entity_type',
            'group_name',
            'created_by_user_displayname',
        ],
        conditionalFacets: {
            // Only show 'sample_category' facet if 'Sample' is selected from the entity type facet
            sample_category: ({filters}) => {
                return filters.some(
                    (filter) =>
                        filter.field === 'entity_type' &&
                        filter.values.includes('Sample')
                )
            },

            // Only show 'origin_sample' facet if 'Sample' or 'Dataset' is selected from the entity type facet
            'origin_sample.organ': ({filters}) => {
                return filters.some(
                    (filter) =>
                        filter.field === 'entity_type' &&
                        (filter.values.includes('Sample') ||
                            filter.values.includes('Dataset'))
                )
            },
        },
        search_fields: {
            description: {type: 'value'},
            group_name: {type: 'value'},
            sennet_id: {type: 'value'},
            display_doi: {type: 'value'},
            lab_source_id: {type: 'value'},
            display_subtype: {type: 'value'},
            lab_name: {type: 'value'},
            lab_tissue_sample_id: {type: 'value'},
            sample_category: {type: 'value'},
            lab_dataset_id: {type: 'value'},
            created_by_user_displayname: {type: 'value'},
            created_by_user_email: {type: 'value'},
            dataset_info: {type: 'value'},
            source_type: {type: 'value'},
            status: {type: 'value'},
            // "mapped_metadata.race": {type: "value"},
            // "mapped_metadata.sex": {type: "value"},
        },
        source_fields: [
            'sennet_id',
            'entity_type',
            'uuid',
            'created_by_user_displayname',
            'created_by_user_email',
            'lab_tissue_sample_id',
            'sample_category',
            'group_name',
            'source_type',
            'last_modified_timestamp',
            'data_types',
            'status',
            'origin_sample'
        ],
    },
    initialState: {
        resultsPerPage: 20,
        sortList: [{
            field: "last_modified_timestamp",
            direction: "desc"
        }]
    },
    trackUrlState: false,
    apiConnector: connector,
    hasA11yNotifications: true,
    a11yNotificationMessages: {
        searchResults: ({start, end, totalResults, searchTerm}) =>
            `Searching for "${searchTerm}". Showing ${start} to ${end} results out of ${totalResults}.`,
    },
}

export const RESULTS_PER_PAGE = [10, 20, 30]

// some sort fields require .keyword in order to sort them
export const SORT_OPTIONS = [
    {
        name: 'Relevance',
        value: [],
    },
    {
        name: 'Created By',
        value: [
            {
                field: 'created_by_user_displayname.keyword',
                direction: 'asc',
            },
        ],
    },
    {
        name: 'SenNet ID',
        value: [
            {
                field: 'sennet_id.keyword',
                direction: 'asc',
            },
        ],
    },
    {
        name: 'Lab ID',
        value: [
            {
                field: 'lab_tissue_sample_id.keyword',
                direction: 'asc',
            },
        ],
    },
    {
        name: 'Sample Category',
        value: [
            {
                field: 'sample_category.keyword',
                direction: 'asc',
            },
        ],
    },
    {
        name: 'Group Name',
        value: [
            {
                field: 'group_name.keyword',
                direction: 'asc',
            },
        ],
    },
    {
        name: 'Data Types',
        value: [
            {
                field: 'data_types.keyword',
                direction: 'asc',
            },
        ],
    },
    // {
    //     name: "Organ",
    //     value: [
    //         {
    //             field: "origin_sample.organ.keyword",
    //             direction: "asc"
    //         }
    //     ]
    // },
    {
        name: 'Status',
        value: [
            {
                field: 'status.keyword',
                direction: 'asc',
            },
        ],
    },
    {
        name: 'Last Modified',
        value: [
            {
                field: 'last_modified_timestamp',
                direction: 'desc',
            },
        ],
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
]

//Config options to exclude datasets from results
export let exclude_dataset_config = _.cloneDeep(config);
exclude_dataset_config['searchQuery']['excludeFilters'] = [{
    keyword: "entity_type.keyword",
    value: "Dataset"
}];
exclude_dataset_config['searchQuery']['disjunctiveFacets'] = ["group_name", "created_by_user_displayname"]