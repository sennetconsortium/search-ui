import React from 'react';
import {Table} from 'react-bootstrap';
import {getStatusColor, getStatusDefinition} from "../../js/functions";
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import {TrashFill} from "react-bootstrap-icons";
import SenNetPopover from "../../../SenNetPopover";
import ClipboardCopy from "../../../ClipboardCopy";
import {getResponseList} from "../AttributesUpload";
import DataTable from "react-data-table-component";

export default function AncestorsTable({formLabel, onChange, deleteAncestor, values, controlId, ancestors}) {
    const _deleteAncestor = async (e, ancestorId) => {
        const old_uuids = [...values[controlId]]
        let updated_uuids = old_uuids.filter(e => e !== ancestorId)
        console.log(updated_uuids)
        onChange(e, controlId, updated_uuids);
        deleteAncestor(ancestorId);
    }

    const tableColumns = () => {
        return [
            {
                name: `${formLabel.upperCaseFirst()} ID`,
                selector: row => row.sennet_id,
                sortable: true,
                format: col => <span>{col.sennet_id}<ClipboardCopy text={col.sennet_id} title={'Copy SenNet ID {text} to clipboard'} /></span>,
            },
            {
                name: 'Entity Type',
                selector: row => row.entity_type,
                sortable: true
            },
            {
                name: 'Subtype',
                selector: row => row?.display_subtype,
                sortable: true
            },
            {
                name: 'Lab ID',
                selector: row => row?.lab_tissue_sample_id || row?.lab_dataset_id,
                sortable: true
            },
            {
                name: 'Group Name',
                selector: row => row.group_name,
                sortable: true
            },
            {
                name: `Status`,
                selector: row => row.status,
                sortable: true,
                format: col => {
                    return <span className={`${getStatusColor(col?.status)} badge`}>
                                <SenNetPopover text={getStatusDefinition(col?.status)} className={`status-info-${col.uuid}`}>{col?.status}</SenNetPopover>
                            </span>
                },
            },
            {
                name: `Action`,
                selector: row => null,
                sortable: false,
                format: col => {
                    return <Button className="pt-0 pb-0" variant="link" onClick={(e) => _deleteAncestor(e, col.uuid)}><TrashFill
                        color="red"/></Button>
                },
            },
        ]
    }


    return (
        <div className={'table--ancestors'}>
            <DataTable
                columns={tableColumns()}
                data={ancestors}
                pagination />
        </div>
    )

}