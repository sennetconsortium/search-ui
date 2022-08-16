//
// Form definition to define each field type per page.  see Form.jsx and components/
// component types available: text, options, multiselection, singleselection, anchor
//

// *********************
// Set the attribute 'entity_type' to be the entity types the field applies to. Is used for the dropdown menu to show
// or hide input options
// *********************

export const FORM_FIELD_DEF = [
	{
		component: "page",
	    label: "BCRF form",
	    _uid: "0c946643-5a83-4545-baea-055b27b51e8a",
	    fields: [
			{
		        component: "singleselection",
		        label: "Entity Type",
		        type: "text",
		        field: "entity_type",
		        _uid: "entity_type",
		        required: true,
		        facet: {
			          active: true,
			          filterType: "any",
			          isFilterable: false
		        },
		        options: [
		            {
			            value: "Dataset",
			            label: "Dataset"
			        },
			        {
			            value: "Sample",
			            label: "Sample"
			        },
			        {
			            value: "Source",
			            label: "Source"
			        }
		        ],
		    },
		    {
		        component: "text",
		        entity_type: "Dataset Sample Source",
		        label: "Title",
		        type: "text",
		        field: "title",
		        _uid: "title",
		        required: true,
		        facet: {
		            active: false,
		            filterType: "any",
		            isFilterable: false
		        }
		    },
		    {
		        component: "text",
		        entity_type: "Dataset Sample Source",
		        label: "Description",
		        type: "text",
		        field: "description",
		        _uid: "description",
		        required: true,
		        facet: {
			          active: false,
			          filterType: "any",
			          isFilterable: false
		        }
		    },
		    {
		        component: "text",
		        entity_type: "Sample",
		        label: "Specimen Type",
		        type: "text",
		        field: "specimen_type",
		        _uid: "specimen_type",
		        required: false,
		        facet: {
			          active: true,
			          filterType: "any",
			          isFilterable: false
		        }
		    },
		    {
		        component: "text",
		        entity_type: "Sample",
		        label: "Organ",
		        type: "text",
		        field: "organ",
		        _uid: "organ",
		        required: false,
		        facet: {
			          active: true,
			          filterType: "any",
			          isFilterable: false
		        }
		    }
	    ]
    }
];
