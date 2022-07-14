import React from 'react';
import styles from './style.module.css'
import {Table} from 'react-bootstrap';

const TableResults = ({children}) => (
    <div className={styles.search_table_wrapper}>
        <Table responsive hover>
            <thead>
            <tr>
                <th>Created By</th>
                <th>SenNet ID</th>
                <th>Submisson ID</th>
                <th>Lab ID</th>
                <th>Type</th>
                <th>Group Name</th>
                <th>Created By</th>
            </tr>
            </thead>
            <tbody>
            {children}
            </tbody>
        </Table>
    </div>
);


const TableRowDetail = ({result: record}) => {
    var hotlink = "/" + record.entity_type.raw.toLowerCase() + "?uuid=" + record.uuid.raw

    return (
        <tr onClick={event =>  window.location.href=hotlink}>
            <td>{record.created_by_user_displayname.raw}</td>
            <td>{record.hubmap_id.raw}</td>
            <td>
                {record.submission_id ? (
                    <>{record.submission_id.raw}</>
                ) : null
                }

            </td>
            <td>
                {record.lab_tissue_sample_id ? (
                    <>{record.lab_tissue_sample_id.raw}</>
                ) : null
                }
            </td>
            <td>
                {record.mapped_specimen_type ? (
                    <>{record.mapped_specimen_type.raw}</>
                ) : null
                }
            </td>
            <td>{record.group_name.raw}</td>
            <td>{record.created_by_user_email.raw}</td>
        </tr>
    );
};


export {TableResults, TableRowDetail};