import React from 'react'
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component'
import {TableResultsEntities} from "../../TableResultsEntities";
import SenNetAccordion from "../../layout/SenNetAccordion";
import {eq} from "../../js/functions";

function Datasets({ data, label }) {

    const getColumns = () => {
        const hasMultipleEntityTypes = !eq(label, 'Datasets')
        const {datasetColumns, defaultColumns} = TableResultsEntities({forData: true, rowFn: (row) => row ? row : null})
        return defaultColumns({hasMultipleEntityTypes, columns: datasetColumns, _isLoggedIn: true})
    }

    return (
        <SenNetAccordion title={label}>
            <DataTable columns={getColumns()} data={data} pagination />
        </SenNetAccordion>
    )
}

Datasets.defaultProps = {
    label: 'Datasets'
}

Datasets.propTypes = {
    data: PropTypes.array,
    label: PropTypes.string
}

export default Datasets