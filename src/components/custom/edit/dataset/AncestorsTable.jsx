import React from 'react';
import {Table} from 'react-bootstrap';
import {getStatusColor} from "../../js/functions";
import Badge from 'react-bootstrap/Badge';
import {TrashFill} from "react-bootstrap-icons";

export default class AncestorsTable extends React.Component {
    deleteAncestor = async (e, ancestorId) => {
        const old_uuids = [...this.props.values.direct_ancestor_uuids]
        let updated_uuids = old_uuids.filter(e => e !== ancestorId)
        console.log(updated_uuids)
        this.props.onChange(e, 'direct_ancestor_uuids', updated_uuids);
        this.props.deleteAncestor(ancestorId);
    }

    render() {
        return (
            <Table className={'table--ancestors'}>
                <thead>
                <tr>
                    <th>Ancestor ID</th>
                    <th>Subtype</th>
                    <th>Group Name</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {this.props.ancestors.map((ancestor, index) => {
                    return (
                        <tr key={index}>
                            <td>{ancestor.sennet_id}</td>
                            <td>{ancestor?.display_subtype}</td>
                            <td>{ancestor.group_name}</td>
                            <td><Badge pill bg={getStatusColor(ancestor?.status)}>{ancestor?.status}</Badge></td>
                            <td><TrashFill role="button" color="red" onClick={() => this.deleteAncestor(this, ancestor.uuid)}/></td>

                        </tr>
                    )
                })}

                </tbody>
            </Table>
        )
    }
}