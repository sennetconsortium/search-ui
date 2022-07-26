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


const TableRowDetail = ({result, urlField}) => {
    //Overriding `urlField` to utilize onClick functionality
    var hotlink = "/" + result.entity_type.raw.toLowerCase() + "?uuid=" + result.uuid.raw

    return (
        <tr onClick={urlField!= null ?()=> urlField(this, result.uuid.raw):() => window.location.href = hotlink}>
            <td>{result.created_by_user_displayname.raw}</td>
            <td>{result.hubmap_id.raw}</td>
            <td>
                {result.submission_id ? (
                    <>{result.submission_id.raw}</>
                ) : null
                }

            </td>
            <td>
                {result.lab_tissue_sample_id ? (
                    <>{result.lab_tissue_sample_id.raw}</>
                ) : null
                }
            </td>
            <td>
                {result.mapped_specimen_type ? (
                    <>{result.mapped_specimen_type.raw}</>
                ) : null
                }
            </td>
            <td>{result.group_name.raw}</td>
            <td>{result.created_by_user_email.raw}</td>
        </tr>
    );
};


export {TableResults, TableRowDetail};