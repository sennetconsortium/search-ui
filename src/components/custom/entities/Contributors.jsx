import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import DataTable, { createTheme } from 'react-data-table-component'
import {BoxArrowUpRight} from "react-bootstrap-icons";
import SenNetAccordion from "../layout/SenNetAccordion";

function Contributors({data, title}) {
    const getColumns = () => {
        return [
            {
                name: 'Name',
                selector: row => row.name ? row.name : (row.first_name +' '+row.last_name),
                sortable: true
            },
            {
                name: 'Affiliation',
                selector: row => row.affiliation,
                sortable: true
            },
            {
                name: 'ORCID',
                selector: row => row.orcid_id,
                sortable: true,
                format: column => <a className='lnk--ic' href={`https://orcid.org/${column.orcid_id}`}>{column.orcid_id} <BoxArrowUpRight/></a>,
            }
        ]
    }

    return (
        <SenNetAccordion title={title}>
            <DataTable columns={getColumns()} data={data} pagination />
        </SenNetAccordion>

    )
}

Contributors.defaultProps = {}

Contributors.propTypes = {
    data: PropTypes.array
}

export default Contributors