import React from 'react';
import {Table} from 'react-bootstrap';
import {getStatusColor, getStatusDefinition} from "../../js/functions";
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import {TrashFill} from "react-bootstrap-icons";
import SenNetPopover from "../../../SenNetPopover";

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
                    <th>Entity Type</th>
                    <th>Subtype</th>
                    <th>Lab ID</th>
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
                            <td>{ancestor.entity_type}</td>
                            <td>{ancestor?.display_subtype}</td>
                            <td>{ancestor?.lab_tissue_sample_id || ancestor?.lab_dataset_id}</td>
                            <td>{ancestor.group_name}</td>
                            <td><Badge pill bg={getStatusColor(ancestor?.status)}>
                                    <SenNetPopover text={getStatusDefinition(ancestor?.status)} className={`status-info-${ancestor.uuid}`}>{ancestor?.status}</SenNetPopover>
                                </Badge>
                            </td>
                            <td><Button className="pt-0 pb-0" variant="link" onClick={() => this.deleteAncestor(this, ancestor.uuid)}><TrashFill
                                color="red"/></Button></td>
                        </tr>
                    )
                })}

                </tbody>
            </Table>
        )
    }
}