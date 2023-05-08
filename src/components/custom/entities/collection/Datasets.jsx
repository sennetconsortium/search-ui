import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import DataTable, { createTheme } from 'react-data-table-component'
import {BoxArrowUpRight} from "react-bootstrap-icons";
import {TableResults} from "../../TableResults";
import SenNetAccordion from "../../layout/SeNetAccordion";

function Datasets({ data }) {

    useEffect(() => {
        console.log('All co', data)
    }, [])

    const getColumns = () => {
        const {datasetColumns, defaultColumns} = TableResults({forData: true, rowFn: (row) => row ? row : null})
        return defaultColumns({hasMultipleEntityTypes: false, columns: datasetColumns, _isLoggedIn: true})
    }

    return (
        <SenNetAccordion title={'Datasets'}>
            <DataTable columns={getColumns()} data={data} pagination />
        </SenNetAccordion>
    )
}

Datasets.defaultProps = {}

Datasets.propTypes = {
    data: PropTypes.array
}

export default Datasets