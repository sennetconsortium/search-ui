import {FilterIsSelected, getAuth, getEntitiesIndex, getSearchEndPoint} from "../config";
import SearchAPIConnector from "search-ui/packages/search-api-connector";

const connector = new SearchAPIConnector({
    indexName: getEntitiesIndex(),
    indexUrl: getSearchEndPoint(),
    accessToken: getAuth(),
})

export const SEARCH_ENTITIES = {
    alwaysSearchOnInitialLoad: true,
    searchQuery: {
        excludeFilters: [
            {
                keyword: "entity_type.keyword",
                value: "Publication"
            },
            {
                keyword: "dataset_category.keyword",
                value: ["codcc-processed", "lab-processed"]
            }
        ],
        facets: {
            entity_type: {
                label: 'Entity Type',
                type: 'value',
                field: 'entity_type.keyword',
                isExpanded: true,
                filterType: 'any',
                isFilterable: false,
            },
            // Used for when "Sample" is selected to show organs
            source_type: {
                label: 'Source Type',
                type: 'value',
                field: 'source_type.keyword',
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
            dataset_type: {
                label: 'Dataset Type',
                type: 'value',
                field: 'dataset_type.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            organ: {
                label: 'Organ',
                type: 'value',
                field: 'organ.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            // Used for when "Dataset" or Sample Block/Section/Suspension is selected to show related organs
            "origin_sample.organ": {
                label: 'Organ',
                type: 'value',
                field: 'origin_sample.organ.keyword',
                isExpanded: false,
                filterType: 'any',
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
            has_rui_information: {
                label: 'Is Spatially Registered',
                type: 'value',
                field: 'has_rui_information.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            'rui_location_anatomical_locations.label': {
                label: 'Anatomical Locations',
                type: 'value',
                field: 'rui_location_anatomical_locations.label.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            metadata: {
                label: 'Has Metadata',
                type: 'exists',
                field: 'metadata',
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
            // Show 'origin_sample.organ' facet if 'Dataset' or Sample Block/Section/Suspension is selected
            "origin_sample.organ": ({filters}) => {
                 return filters.some(
                    (filter) =>
                        (filter.field === 'entity_type' && filter.values.includes('Dataset')) ||
                        (filter.field === 'sample_category' && (filter.values.includes('Block') ||
                                filter.values.includes('Section') || filter.values.includes('Suspension')))
                )
            },
            // Only show 'organ' facet if 'Sample' is selected from the entity type facet
            organ: FilterIsSelected('entity_type', 'Sample'),
            'rui_location_anatomical_locations.label': FilterIsSelected('entity_type', 'Sample'),

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
            "sennet_id^4": {type: 'value'},
            "group_name^3": {type: 'value'},
            "dataset_type^2": {type: 'value'},
            "sample_category^2": {type: 'value'},
            "entity_type^2": {type: 'value'},
            "status^2": {type: 'value'},
            all_text: {type: 'value'},
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
            'group_name',
            'source_type',
            'source.source_type',
            'last_modified_timestamp',
            'dataset_type',
            'dataset_category',
            'status',
            'origin_sample.organ',
            'organ',
            'title',
            'description',
            'group_uuid',
            'rui_location_anatomical_locations.label'
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
