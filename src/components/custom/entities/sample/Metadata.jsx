import React from 'react';
import {Button, Table} from 'react-bootstrap';
import styles from '../../style.module.css'
import {Download} from "react-bootstrap-icons";
import {createDownloadUrl, tableDataToTSV} from "../../js/functions";

export default class Metadata extends React.Component {
    render() {
        const tableDataTSV = tableDataToTSV(this.props.data);
        const downloadURL = createDownloadUrl(tableDataTSV, 'text/tab-separated-values')
        return (
            <li className="sui-result" id="Metadata">
                <div className="sui-result__header">
                    <span className="sui-result__title">Metadata</span>
                    <div className="d-flex justify-content-between mb-2" style={{display: 'inline-block'}}>
                        <a href={downloadURL} download={`${this.props.filename}.tsv`}><Button
                            variant="primary"><Download/></Button></a>
                    </div>
                </div>
                <div className="card-body">
                    <div className={styles.table_wrapper}>
                        <Table>
                            <thead>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(this.props.data).map(([key, value]) => {
                                return (
                                    <tr key={"metadata_" + key}>
                                        <td>{this.props.metadataKey}{key}</td>
                                        <td>{Array.isArray(value) ? value.join(', ') : value}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </li>
        )
    }
}