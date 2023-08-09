import {FilterIsSelected, getAuth, getEntitiesIndex, getSearchEndPoint} from "../config";
import SearchAPIConnector from "search-ui/packages/search-api-connector";

const connector = new SearchAPIConnector({
    indexName: getEntitiesIndex(),
    indexUrl: getSearchEndPoint(),
    accessToken: getAuth(),
})

export const SEARCH_METADATA = {
    alwaysSearchOnInitialLoad: true,
    searchQuery: {
        excludeFilters: [
            {
                keyword: "entity_type.keyword",
                value: "Collection"
            },
            {
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
            source_type: {
                label: 'Source Type',
                type: 'value',
                field: 'source_type.keyword',
                isExpanded: false,
                filterType: 'any',
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
            data_types: {
                label: 'Data Type',
                type: 'value',
                field: 'data_types.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },            
            // Source Human
            "source_mapped_metadata.sex": {
                label: 'Sex',
                type: 'value',
                field: 'source_mapped_metadata.sex.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "source_mapped_metadata.race": {
                label: 'Race',
                type: 'value',
                field: 'source_mapped_metadata.race.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "source_mapped_metadata.age_value": {
                label: 'Age',
                type: 'range',
                field: 'source_mapped_metadata.age_value',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
                uiType: 'numrange',
                uiRange: [0, 100],
            },
            "source_mapped_metadata.body_mass_index_value": {
                label: 'Body Mass Index',
                type: 'range',
                field: 'source_mapped_metadata.body_mass_index_value',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
                uiType: 'numrange',
                uiRange: [0, 50],
            },
            // Source Mouse
            "metadata.strain": {
                label: 'Strain',
                type: 'value',
                field: 'metadata.strain.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "metadata.sex": {
                label: 'Sex',
                type: 'value',
                field: 'metadata.sex.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "metadata.is_embryo": {
                label: 'Is Embryo',
                type: 'value',
                field: 'metadata.is_embryo.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "metadata.is_deceased": {
                label: 'Is Deceased',
                type: 'value',
                field: 'metadata.is_deceased.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "metadata.euthanization_method": {
                label: 'Euthanization Method',
                type: 'value',
                field: 'metadata.euthanization_method.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },

            // Sample Block
            "metadata.weight_value": {
                label: 'Weight',
                type: 'range',
                field: 'metadata.weight_value',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
                uiType: 'numrange',
                uiRange: [0, 100],
            },
            "metadata.weight_value_unit": {
                label: 'Weight Unit',
                type: 'value',
                field: 'metadata.weight_value_unit.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "metadata.volume_value": {
                label: 'Volume',
                type: 'range',
                field: 'metadata.volume_value',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
                uiType: 'numrange',
                uiRange: [0, 100],
            },
            "metadata.volume_value_unit": {
                label: 'Volume Unit',
                type: 'value',
                field: 'metadata.volume_value_unit.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "metadata.pathology_distance_value": {
                label: 'Pathology Distance',
                type: 'range',
                field: 'metadata.pathology_distance_value',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
                uiType: 'numrange',
                uiRange: [0, 100],
            },
            "metadata.pathology_distance_value_unit": {
                label: 'Pathology Distance Unit',
                type: 'value',
                field: 'metadata.pathology_distance_value_unit.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },

            // Sample Section
            "metadata.section_thickness_value": {
                label: 'Section Thickness',
                type: 'range',
                field: 'metadata.section_thickness_value',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
                uiType: 'numrange',
                uiRange: [0, 100],
            },
            "metadata.section_thickness_unit": {
                label: 'Section Thickness Unit',
                type: 'value',
                field: 'metadata.section_thickness_unit.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },

            // Sample Suspension
            "metadata.suspension_entity": {
                label: 'Suspension Entity',
                type: 'value',
                field: 'metadata.suspension_entity.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "metadata.suspension_entity_number": {
                label: 'Suspension Entity Number',
                type: 'range',
                field: 'metadata.suspension_entity_number',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
                uiType: 'numrange',
                uiRange: [0, 100],
            },
            "metadata.suspension_enriched": {
                label: 'Is Suspension Enriched',
                type: 'value',
                field: 'metadata.suspension_enriched.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },

            // Sample General
            "metadata.preparation_media": {
                label: 'Preparation Media',
                type: 'value',
                field: 'metadata.preparation_media.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "metadata.preparation_condition": {
                label: 'Preparation Condition',
                type: 'value',
                field: 'metadata.preparation_condition.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "metadata.storage_media": {
                label: 'Storage Media',
                type: 'value',
                field: 'metadata.storage_media.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "metadata.storage_method": {
                label: 'Storage Method',
                type: 'value',
                field: 'metadata.storage_method.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },

            // Dataset
            "metadata.metadata.assay_category": {
                label: 'Assay Category',
                type: 'value',
                field: 'metadata.metadata.assay_category.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "metadata.metadata.analyte_class": {
                label: 'Analyte Class',
                type: 'value',
                field: 'metadata.metadata.analyte_class.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "metadata.metadata.operator": {
                label: 'Operator',
                type: 'value',
                field: 'metadata.metadata.operator.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "metadata.metadata.acquisition_instrument_model": {
                label: 'Acquisition Instrument Model',
                type: 'value',
                field: 'metadata.metadata.acquisition_instrument_model.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
            "metadata.metadata.acquisition_instrument_vendor": {
                label: 'Acquisition Instrument Vendor',
                type: 'value',
                field: 'metadata.metadata.acquisition_instrument_vendor.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
            },
        },
        disjunctiveFacets: [],
        conditionalFacets: {
            source_type: FilterIsSelected('entity_type', 'Source'),
            sample_category: FilterIsSelected('entity_type', 'Sample'),

            // Source Human
            "source_mapped_metadata.sex": FilterIsSelected('source_type', 'Human'),
            "source_mapped_metadata.race": FilterIsSelected('source_type', 'Human'),
            "source_mapped_metadata.age_value": FilterIsSelected('source_type', 'Human'),
            "source_mapped_metadata.body_mass_index_value": FilterIsSelected('source_type', 'Human'),

            // Source Mouse
            "metadata.strain": FilterIsSelected('source_type', 'Mouse'),
            "metadata.sex": FilterIsSelected('source_type', 'Mouse'),
            "metadata.is_embryo": FilterIsSelected('source_type', 'Mouse'),
            "metadata.is_deceased": FilterIsSelected('source_type', 'Mouse'),
            "metadata.euthanization_method": FilterIsSelected('source_type', 'Mouse'),

            // Sample Block
            "metadata.weight_value": FilterIsSelected('sample_category', 'Block'),
            "metadata.weight_value_unit": FilterIsSelected('sample_category', 'Block'),
            "metadata.volume_value": FilterIsSelected('sample_category', 'Block'),
            "metadata.volume_value_unit": FilterIsSelected('sample_category', 'Block'),
            "metadata.pathology_distance_value": FilterIsSelected('sample_category', 'Block'),
            "metadata.pathology_distance_value_unit": FilterIsSelected('sample_category', 'Block'),

            // Sample Section
            "metadata.section_thickness_value": FilterIsSelected('sample_category', 'Section'),
            "metadata.section_thickness_unit": FilterIsSelected('sample_category', 'Section'),

            // Sample Suspension
            "metadata.suspension_entity": FilterIsSelected('sample_category', 'Suspension'),
            "metadata.suspension_entity_number": FilterIsSelected('sample_category', 'Suspension'),
            "metadata.suspension_enriched": FilterIsSelected('sample_category', 'Suspension'),

            // Sample General
            "metadata.preparation_media": FilterIsSelected('entity_type', 'Sample'),
            "metadata.preparation_condition": FilterIsSelected('entity_type', 'Sample'),
            "metadata.storage_media": FilterIsSelected('entity_type', 'Sample'),
            "metadata.storage_method": FilterIsSelected('entity_type', 'Sample'),

            // Dataset
            "metadata.metadata.assay_category": FilterIsSelected('entity_type', 'Dataset'),
            "metadata.metadata.analyte_class": FilterIsSelected('entity_type', 'Dataset'),
            "metadata.metadata.operator": FilterIsSelected('entity_type', 'Dataset'),
            "metadata.metadata.acquisition_instrument_model": FilterIsSelected('entity_type', 'Dataset'),
            "metadata.metadata.acquisition_instrument_vendor": FilterIsSelected('entity_type', 'Dataset'),
        },
        search_fields: {
            // Do not put any fields that elastic search categorizes as a number. This will cause the search to fail.
            sennet_id: {type: 'value'},
            source_type: {type: 'value'},
            data_types: {type: 'value'},
            "source_mapped_metadata.sex": {type: 'value'},
            "source_mapped_metadata.race": {type: 'value'},

            "metadata.metadata.assay_category": {type: 'value'},
            "metadata.metadata.analyte_class": {type: 'value'},
            "metadata.metadata.operator": {type: 'value'},
            "metadata.metadata.acquisition_instrument_model": {type: 'value'},
            "metadata.metadata.acquisition_instrument_vendor": {type: 'value'},
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
    discover: [
        {
            title: 'All Human Sources',
            description: 'Human sources of all ages and sexes.',
            entityType: 'source',
            filters: {
               Human: { key: 'source_type', selected: true },
               Source: { key: 'entity_type', selected: true },
            }
        },
        {
            title: 'C57BL/6J-Kit<W-39J> Mouse Sources',
            description: 'Mouse sources from the C57BL/6J-Kit<W-39J> strain',
            entityType: 'source',
            filters: {
                Mouse: { key: 'source_type', selected: true },
                Source: { key: 'entity_type', selected: true },
                "C57BL/6J-Kit<W-39J>": { key: 'metadata.strain', selected: true },
            }
        },
        {
            title: 'All Mouse Sources',
            description: 'Mouse sources of all strains, sexes, and embryo statuses.',
            entityType: 'source',
            filters: {
                Mouse: { key: 'source_type', selected: true },
                Source: { key: 'entity_type', selected: true },
            }
        },
        {
            title: 'All Block Samples',
            description: 'Block samples of all weights, volumes, and preparation conditions.',
            entityType: 'sample',
            filters: {
                Block: { key: 'sample_category', selected: true },
                Sample: { key: 'entity_type', selected: true },
            }
        },
        {
            title: 'All Organ Samples',
            description: 'Organ samples of all preparation conditions.',
            entityType: 'sample',
            filters: {
                Organ: { key: 'sample_category', selected: true },
                Sample: { key: 'entity_type', selected: true },
            }
        },
        {
            title: 'All Section Samples',
            description: 'Section samples of all thicknesses and preparation conditions.',
            entityType: 'sample',
            filters: {
                Section: { key: 'sample_category', selected: true },
                Sample: { key: 'entity_type', selected: true },
            }
        },
        {
            title: 'All Suspension Samples',
            description: 'Suspension samples of all entity types, enrichment, and preparation conditions.',
            entityType: 'sample',
            filters: {
                Suspension: { key: 'sample_category', selected: true },
                Sample: { key: 'entity_type', selected: true },
            }
        },
        {
            title: 'All RNA Datasets',
            description: 'Datasets with the RNA analyte class.',
            entityType: 'dataset',
            filters: {
                RNA: { key: 'metadata.metadata.analyte_class', selected: true },
                Dataset: { key: 'entity_type', selected: true },
            }
        },
        {
            title: 'All Protein Datasets',
            description: 'Datasets with the Protein analyte class.',
            entityType: 'dataset',
            filters: {
                protein: { key: 'metadata.metadata.analyte_class', selected: true },
                Dataset: { key: 'entity_type', selected: true },
            }
        },
    ],
}
