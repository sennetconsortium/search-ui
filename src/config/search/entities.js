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
        excludeFilters: [ {
            keyword: "entity_type.keyword",
            value: "Publication"
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
            rui_location: {
                label: 'Has Location Information',
                type: 'exists',
                field: 'rui_location',
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
            "ancestors.rui_location": {
                label: 'Has Location Information',
                type: 'exists',
                field: 'ancestors.rui_location',
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
            // Only show 'origin_sample.organ' facet if 'Dataset' is selected from the entity type facet
            "origin_sample.organ": FilterIsSelected('entity_type', 'Dataset'),
            // Only show 'organ' facet if 'Sample' is selected from the entity type facet
            organ: FilterIsSelected('entity_type', 'Sample'),

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
            'group_name',
            'source_type',
            'source.source_type',
            'last_modified_timestamp',
            'data_types',
            'status',
            'origin_sample.organ',
            'organ',
            'title',
            'description',
            'group_uuid'
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
