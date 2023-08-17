import React from 'react';
import DataTable from 'react-data-table-component';
import {getUBKGFullName} from "../../js/functions";
import ClipboardCopy from "../../../ClipboardCopy";

export default class Lineage extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
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
                selector: row => row.entity_type,
                sortable: true,
            },
            {
                name: 'Subtype',
                selector: row => row.display_subtype,
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

        this.data = [];
        {
            this.props.lineage.map((lineage_data, index) => {
                this.data.push({
                    sennet_id: <span><a href={'/' + lineage_data.entity_type.toLowerCase() + '?uuid=' + lineage_data.uuid}
                                        className="icon_inline">{lineage_data.sennet_id}</a><ClipboardCopy text={lineage_data.sennet_id} size={10} title={'Copy SenNet ID {text} to clipboard'} /></span>,
                    entity_type: lineage_data.entity_type,
                    lab_id: lineage_data.lab_tissue_sample_id ? lineage_data.lab_tissue_sample_id
                        : lineage_data.lab_source_id ? lineage_data.lab_source_id
                            : lineage_data.lab_dataset_id ? lineage_data.lab_dataset_id
                                : null,
                    display_subtype: (lineage_data.sample_category ? (
                              lineage_data.sample_category
                            ) : lineage_data.display_subtype),
                    organ: getUBKGFullName(lineage_data?.origin_sample?.organ),
                    group_name: lineage_data.group_name
                });
            })
        }

    }

    render() {
        return (
            <DataTable
                columns={this.columns}
                data={this.data}
                pagination/>
        )
    }
}