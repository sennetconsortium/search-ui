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
            <div className="accordion accordion-flush sui-result" id="Metadata">
                <div className="accordion-item ">
                    <div className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#metadata-collapse" aria-expanded="true"
                                aria-controls="metadata-collapse">Metadata
                            <div className="w-100 pe-4">
                                <a href={downloadURL} download={`${this.props.filename}.tsv`}
                                   className="float-end"><Button
                                    variant="primary"><Download/></Button></a>
                            </div>

                        </button>
                    </div>
                    <div id="metadata-collapse" className="accordion-collapse collapse show">
                        <div className="accordion-body">
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
                    </div>
                </div>
            </div>
        )
    }
}