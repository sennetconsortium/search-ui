import React from 'react';
import {getDatasetTypeDisplay, getStatusColor, getStatusDefinition, getUBKGFullName} from "../../js/functions";
import Button from 'react-bootstrap/Button';
import SenNetPopover from "../../../SenNetPopover";
import ClipboardCopy from "../../../ClipboardCopy";
import DataTable from "react-data-table-component";

export default function AncestorsTable({formLabel, onChange, deleteAncestor, values, controlId, ancestors, disableDelete}) {
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
                format: col => <span className='pt-1 d-block'>{col.sennet_id}<ClipboardCopy text={col.sennet_id} title={'Copy SenNet ID {text} to clipboard'} /></span>,
            },
            {
                name: 'Entity Type',
                selector: row => row.entity_type,
                sortable: true
            },
            {
                name: 'Subtype',
                selector: row => getDatasetTypeDisplay(row),
                sortable: true
            },
            {
                name: 'Organ',
                selector: row => {
                    let organs = []
                    row.origin_samples.forEach((origin_sample) => {
                        organs.push(getUBKGFullName(origin_sample.organ))
                    })
                    if (organs.length > 0) {
                        return organs.join(', ')
                    }
                    return ''
                },
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
                    // Disable this button when the dataset is not 'primary'
                    return <Button className="pt-0 pb-0" variant="link" onClick={(e) => _deleteAncestor(e, col.uuid)} disabled={disableDelete}><i className={'bi bi-trash-fill'}
                        style={{color:"red"}}/></Button>
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