import React, {useRef} from 'react'
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component'
import {TableResultsEntities} from "../../TableResultsEntities";
import SenNetAccordion from "../../layout/SenNetAccordion";
import {eq} from "../../js/functions";
import {RESULTS_PER_PAGE} from "@/config/config";

function Datasets({ data, label = 'Datasets' }) {
    const currentColumns = useRef([])
    const getColumns = () => {
        const hasMultipleEntityTypes = !eq(label, 'Datasets')
        const {datasetColumns, defaultColumns} = TableResultsEntities({filters: [{field: 'entity_type', values: ['Dataset']}], currentColumns, children: data, forData: true, rowFn: (row) => row ? row : ''})
        let cols = defaultColumns({hasMultipleEntityTypes, columns: datasetColumns, _isLoggedIn: true})
        currentColumns.current = cols.filter((col) => col.id !== 'origin_samples.organ' && col.id !== 'origin_samples.organ_hierarchy')
        return currentColumns.current
    }

    return (
        <SenNetAccordion title={label}>
            <DataTable columns={getColumns()} data={data} pagination paginationRowsPerPageOptions={RESULTS_PER_PAGE} fixedHeader={true}/>
        </SenNetAccordion>
    )
}

Datasets.propTypes = {
    data: PropTypes.array,
    label: PropTypes.string
}

export default Datasets