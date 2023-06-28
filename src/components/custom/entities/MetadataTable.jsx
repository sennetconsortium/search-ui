import React from 'react';
import {Container, Row,} from 'react-bootstrap'
import {Download} from "react-bootstrap-icons";
import {createDownloadUrl, tableDataToTSV} from "../js/functions";
import DataTable from "react-data-table-component";
import {ViewHeaderBadges} from "../layout/entity/ViewHeaderBadges";

export default class MetadataTable extends React.Component {
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
            Object.entries(this.props.metadata).map(([key, value]) => {
                this.data.push({
                    key: this.props.metadataKey + key,
                    value: Array.isArray(value) ? value.join(', ') : value
                })
            })
        }
    }

    render() {
        const tableDataTSV = tableDataToTSV(this.props.metadata);
        const downloadURL = createDownloadUrl(tableDataTSV, 'text/tab-separated-values')
        return (
            <Container fluid={true}>
                <Row className="mb-2">
                    <div className="col-md-6 col-sm-12 entity_subtitle icon_inline">
                        {this.props.data &&
                            <ViewHeaderBadges data={this.props.data} isMetadataHeader={true}/>
                        }
                    </div>

                    <div className="col-md-6 col-sm-12">
                        <div className="entity_subtitle icon_inline float-md-end">
                            <a href={downloadURL}
                               download={`${this.props.filename}.tsv`}
                               className="float-end">
                        <span className="btn btn-primary"
                              role='button'
                              aria-label='Download Metadata'
                              title='Download Metadata'>
                            <Download/>
                        </span>
                            </a>
                        </div>
                    </div>
                </Row>
                <DataTable columns={this.columns}
                           data={this.data}
                           pagination/>
            </Container>
        )
    }
}
