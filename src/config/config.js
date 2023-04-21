import SearchAPIConnector from "search-ui/packages/search-api-connector";
import {getCookie} from 'cookies-next';
import {APP_ROUTES} from './constants'

import _ from 'lodash';

export const APP_TITLE = 'SenNet - Data Sharing Portal'

// Set this to be the time in milliseconds
export const IDLE_TIMEOUT = 1000 * 60 * 60

export function getLogLevel() {
    return process.env.NEXT_PUBLIC_LOG_LEVEL;
}

export function getAuth() {
    if (typeof window !== 'undefined') {
        return getCookie('groups_token')
    }
    return ''
}

// Organs not supported by the CCF-RUI Tool are:
// Adipose, Blood, Breast, Lymph Node, Muscle, and Other
export const nonSupportedRuiOrgans = ['AD', 'BD', 'BS', 'MU', 'OT']
export const supportedRuiSources = ['Human', 'Human Organoid']

export function valuesRuiSupported(values, dict) {
    try {
        if (values.length > 0) {
            const supported = (value) => dict.includes(value);
            return values.some(supported)
        }
    } catch (e) {
        console.error(e)
    }
    return false
}

export function isOrganRuiSupported(organs) {
    return !valuesRuiSupported(organs, nonSupportedRuiOrgans)
}

export function isSampleRuiSupported(samples) {
    return valuesRuiSupported(samples, supportedRuiSources)
}

export function isRuiSupported(organs, sources) {
    return isOrganRuiSupported(organs) && isSampleRuiSupported(sources)
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

export function getUbkgEndPoint() {
    return process.env.NEXT_PUBLIC_UBKG_API_ENDPOINT
}

export function getUbkgValuesetPath() {
    return process.env.NEXT_PUBLIC_UBKG_VALUESET_PATH
}

export function getUbkgCodes() {
    return JSON.parse(process.env.NEXT_PUBLIC_UBKG_CODES)
}

export function getUbkgCodesPath() {
    return JSON.parse(process.env.NEXT_PUBLIC_UBKG_CODES_PATHS)
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

export function getUUIDEndpoint() {
    return process.env.NEXT_PUBLIC_UUID_API_ENDPOINT
}

export function getAssetsEndpoint() {
    return process.env.NEXT_PUBLIC_ASSETS_ENDPOINT
}

export function getRootURL() {
    return process.env.NEXT_PUBLIC_APP_ROOT_URL
}

export function getLogoutURL() {
    return getIngestEndPoint() + APP_ROUTES.logout.slice(1)
}

export function getProtocolsToken() {
    return process.env.NEXT_PUBLIC_PROTOCOLS_TOKEN
}

export function getGoogleTagManagerId() {
    return process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER
}

export function getUIPassword() {
    return process.env.NEXT_PUBLIC_UI_PSWD
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
            // Used for when "Dataset" is selected to show related organs
            "origin_sample.organ": {
                label: 'Organ',
                type: 'value',
                field: 'origin_sample.organ.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            // Used for when "Sample" is selected to show organs
            organ: {
                label: 'Organ',
                type: 'value',
                field: 'organ.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            source_type: {
                label: 'Source Type',
                type: 'value',
                field: 'source_type.keyword',
                filterType: 'any',
                isExpanded: false,
                isFilterable: false,
            },
            // Used for when "Dataset/Sample" is selected to show related sources
            "source.source_type": {
                label: 'Source Type',
                type: 'value',
                field: 'source.source_type.keyword',
                filterType: 'any',
                isExpanded: false,
                isFilterable: false,
            },
            sample_category: {
                label: 'Sample Category',
                type: 'value',
                field: 'sample_category.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "ancestors.sample_category": {
                label: 'Sample Category',
                type: 'value',
                field: 'ancestors.sample_category.keyword',
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
            status: {
                label: 'Status',
                type: 'value',
                field: 'status.keyword',
                isExpanded: false,
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
        },
        disjunctiveFacets: [],
        conditionalFacets: {
            // Only show 'origin_sample.organ' facet if 'Dataset' is selected from the entity type facet
            "origin_sample.organ": FilterIsSelected('entity_type', 'Dataset'),
            // Only show 'organ' facet if 'Sample' is selected from the entity type facet
            organ: FilterIsSelected('entity_type', 'Sample'),

            "ancestors.sample_category": FilterIsSelected('entity_type', 'Dataset'),
            sample_category: FilterIsSelected('entity_type', 'Sample'),

            // Only show 'source.source_type' facet if 'Dataset' or 'Sample' is selected from the entity type facet
            "source.source_type": ({filters}) => {
                return filters.some(
                    (filter) =>
                        filter.field === 'entity_type' &&
                        (filter.values.includes('Sample') || filter.values.includes('Dataset'))
                )
            },
            // Only show 'source' facet if 'Source' is selected from the entity type facet
            source_type: FilterIsSelected('entity_type', 'Source'),
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
            source_type: {type: 'value'},
            data_types: {type: 'value'},
            sample_category: {type: 'value'},
            lab_dataset_id: {type: 'value'},
            created_by_user_displayname: {type: 'value'},
            created_by_user_email: {type: 'value'},
            dataset_info: {type: 'value'},
            status: {type: 'value'},
            'ancestors.title': {type: 'value'},
            organ: {type: 'value'},
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
            'lab_source_id',
            'lab_dataset_id',
            'sample_category',
            'ancestors.sample_category',
            'group_name',
            'source_type',
            'source.source_type',
            'last_modified_timestamp',
            'data_types',
            'status',
            'origin_sample.organ',
            'organ'
        ],
    },
    initialState: {
        resultsPerPage: 20,
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

export const RESULTS_PER_PAGE = [10, 20, 30]

// some sort fields require .keyword in order to sort them
export const SORT_OPTIONS = [
    {
        name: 'Relevance',
        value: [],
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
        name: 'Data Type',
        value: [
            {
                field: 'data_types.keyword',
                direction: 'asc',
            },
        ],
    },
    {
        name: 'Data Provider Group',
        value: [
            {
                field: 'group_name.keyword',
                direction: 'asc',
            },
        ],
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
        name: 'Lab ID',
        value: [
            {
                field: 'lab_tissue_sample_id.keyword',
                direction: 'asc',
            },
        ],
    },
    {
        name: 'Status',
        value: [
            {
                field: 'status.keyword',
                direction: 'asc',
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
export let ancestor_config = _.cloneDeep(config)
ancestor_config['trackUrlState'] = false;

export let valid_dataset_ancestor_config = _.cloneDeep(ancestor_config)

valid_dataset_ancestor_config['searchQuery']['disjunctiveFacets'] = ["group_name", "created_by_user_displayname"]

export let exclude_dataset_config = _.cloneDeep(ancestor_config);
exclude_dataset_config['searchQuery']['excludeFilters'] = [{
    keyword: "entity_type.keyword",
    value: "Dataset"
}];
exclude_dataset_config['searchQuery']['disjunctiveFacets'] = ["group_name", "created_by_user_displayname"]


function FilterIsSelected(fieldName, value) {
    return ({filters}) => {
        return filters.some(
            (f) => f.field === fieldName && (!value || f.values.includes(value))
        );
    };
}