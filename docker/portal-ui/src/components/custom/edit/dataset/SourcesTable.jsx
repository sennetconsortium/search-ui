import React from 'react';
import {Table} from 'react-bootstrap';
import {getStatusColor} from "../../js/functions";
import Badge from 'react-bootstrap/Badge';
import {TrashFill} from "react-bootstrap-icons";

export default class SourcesTable extends React.Component {
    deleteSource = async (e, sourceId) => {
        const old_uuids = [...this.props.values.direct_ancestor_uuids]
        let updated_uuids = old_uuids.filter(e => e !== sourceId)
        console.log(updated_uuids)
        this.props.onChange(e, 'direct_ancestor_uuids', updated_uuids);
        this.props.deleteSource(sourceId);
    }

    render() {
        return (
            <Table>
                <thead>
                <tr>
                    <th>Source ID</th>
                    <th>Submission ID</th>
                    <th>Subtype</th>
                    <th>Group Name</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {this.props.sources.map((source, index) => {
                    return (
                        <tr key={index}>
                            <td>{source.hubmap_id}</td>
                            <td>{source?.submission_id}</td>
                            <td>{source?.display_subtype}</td>
                            <td>{source.group_name}</td>
                            <td><Badge pill bg={getStatusColor(source?.status)}>{source?.status}</Badge></td>
                            <td><TrashFill color="red" onClick={() => this.deleteSource(this, source.uuid)}/></td>

                        </tr>
                    )
                })}

                </tbody>
            </Table>
        )
    }
}