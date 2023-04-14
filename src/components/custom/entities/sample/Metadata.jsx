import React from 'react';
import {Button} from 'react-bootstrap';
import {Download} from "react-bootstrap-icons";
import {createDownloadUrl, tableDataToTSV} from "../../js/functions";
import DataTable from "react-data-table-component";

export default class Metadata extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                name: 'Key',
                selector: row => row.key,
                sortable: true,
            },
            {
                name: 'Value',
                selector: row => row.value,
                sortable: true,
            }
        ];

        this.data = [];
        {
            Object.entries(this.props.data).map(([key, value]) => {
                this.data.push({
                    key: this.props.metadataKey + key,
                    value: Array.isArray(value) ? value.join(', ') : value
                })
            })
        }
    }

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
                            <DataTable
                                columns={this.columns}
                                data={this.data}
                                pagination/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}