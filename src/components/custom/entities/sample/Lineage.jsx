import React from 'react';
import {Table} from 'react-bootstrap';
import {getOrganTypeFullName} from "../../js/functions";

export default class Lineage extends React.Component {
    render() {
        return (
            <div className="table-responsive">
                <Table borderless>
                    <thead>
                    <tr>
                        <th>SenNet ID</th>
                        <th>Entity Type</th>
                        <th>Lab ID</th>
                        <th>Subtype</th>
                        <th>Organ</th>
                        <th>Group Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.lineage.map((lineage_data, index) => {
                        return (
                            <tr key={lineage_data.uuid}>
                                <td><a
                                    href={'/' + lineage_data.entity_type.toLowerCase() + '?uuid=' + lineage_data.uuid}
                                    className="link_with_icon">{lineage_data.sennet_id}</a></td>
                                <td>{lineage_data.entity_type}</td>
                                <td> {lineage_data.lab_tissue_sample_id ? <>{lineage_data.lab_tissue_sample_id}</>
                                    : lineage_data.lab_source_id ? <>{lineage_data.lab_source_id}</>
                                        : lineage_data.lab_dataset_id ? <>{lineage_data.lab_dataset_id}</>
                                            : null}
                                </td>
                                <td>{lineage_data?.display_subtype}</td>
                                <td>{getOrganTypeFullName(lineage_data?.origin_sample?.organ)}</td>
                                <td>{lineage_data.group_name}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        )
    }
}