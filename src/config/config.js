import {getCookie} from 'cookies-next';
import {APP_ROUTES} from './constants'

import _ from 'lodash';
import {SEARCH_ENTITIES} from "./search/entities";

export const APP_TITLE = 'Data Sharing Portal'
export const NAVBAR_TITLE = 'SenNet'

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
// Adipose, Blood, Breast, Muscle, and Other
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
    const info = atob(getCookie('info'))
    return JSON.parse(info).name
}

export function getEntitiesIndex() {
    return process.env.NEXT_PUBLIC_ENTITIES_INDEX
}

export function getFilesIndex() {
    return process.env.NEXT_PUBLIC_FILES_INDEX
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

export function getDocsRootURL() {
    return process.env.NEXT_PUBLIC_DOCS_ROOT_URL
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

export function getCookieDomain() {
    return process.env.NEXT_PUBLIC_COOKIE_DOMAIN
}

export const RESULTS_PER_PAGE = [10, 20, 30, 50, 100]

//Config options to exclude datasets from results
export let ancestor_config = _.cloneDeep(SEARCH_ENTITIES)
ancestor_config['trackUrlState'] = false;

export let valid_dataset_ancestor_config = _.cloneDeep(ancestor_config)

valid_dataset_ancestor_config['searchQuery']['disjunctiveFacets'] = ["group_name", "created_by_user_displayname"]

export let exclude_dataset_config = _.cloneDeep(ancestor_config);
exclude_dataset_config['searchQuery']['excludeFilters'].push(
    {
        keyword: "entity_type.keyword",
        value: "Dataset"
    },
    {
        keyword: "entity_type.keyword",
        value: "Upload"
    },
);
exclude_dataset_config['searchQuery']['disjunctiveFacets'] = ["group_name", "created_by_user_displayname"]


export function FilterIsSelected(fieldName, value) {
    return ({filters}) => {
        return filters.some(
            (f) => f.field === fieldName && (!value || f.values.includes(value))
        );
    };
}