import React from 'react';
import DataTable from 'react-data-table-component';
import {getDatasetTypeDisplay, getUBKGFullName} from "../../js/functions";
import ClipboardCopy from "../../../ClipboardCopy";

const Lineage = ({ lineage }) => {

    const columns = [
        {
            name: 'SenNet ID',
            selector: row => row.sennet_id,
            sortable: false,
        },
        {
            name: 'Entity Type',
            selector: row => row.entity_type,
            sortable: true,
        },
        {
            name: 'Lab ID',
            selector: row => row.lab_id,
            sortable: true,
        },
        {
            name: 'Subtype',
            selector: row => getDatasetTypeDisplay(row),
            sortable: true,
        },
        {
            name: 'Organ',
            selector: row => row.organ,
            sortable: true,
        },
        {
            name: 'Group Name',
            selector: row => row.group_name,
            sortable: true,
        }
    ];

    const data = [];
    {
        lineage.map((lineage_data, index) => {
            data.push({
                sennet_id: <span className={'has-supIcon'}><a href={'/' + lineage_data.entity_type.toLowerCase() + '?uuid=' + lineage_data.uuid}
                                                              className="icon_inline">{lineage_data.sennet_id}</a><ClipboardCopy text={lineage_data.sennet_id} size={10} title={'Copy SenNet ID {text} to clipboard'} /></span>,
                entity_type: lineage_data.entity_type,
                lab_id: lineage_data.lab_tissue_sample_id ? lineage_data.lab_tissue_sample_id
                    : lineage_data.lab_source_id ? lineage_data.lab_source_id
                        : lineage_data.lab_dataset_id ? lineage_data.lab_dataset_id
                            : null,
                display_subtype: (lineage_data.sample_category ? (
                    lineage_data.sample_category
                ) : getDatasetTypeDisplay(lineage_data)),
                organ: getUBKGFullName(lineage_data?.origin_samples?.organ),
                group_name: lineage_data.group_name
            });
        })
    }

    return (
        <DataTable
            columns={columns}
            data={data}
            fixedHeader={true}
            pagination/>
    )
}

export default Lineage