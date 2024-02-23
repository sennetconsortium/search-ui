import React from 'react';
import {Container, Row,} from 'react-bootstrap'
import {createDownloadUrl, tableDataToTSV} from '../js/functions';
import DataTable from 'react-data-table-component';
import SourceDataTable from './source/SourceDataTable';
import PropTypes from 'prop-types'

class MetadataTable extends React.Component {
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
        let metadataValues = this.props.metadata;
        if (this.props.data.source_type === 'Human') {
            // Human sources metadata needs to be restuctured for TSV file
            metadataValues = Object.values(this.props.metadata).reduce((acc, value) => {
                acc[value.key_display] = value.value_display;
                return acc;
            }, {});
        }

        const tableDataTSV = tableDataToTSV(metadataValues);
        const downloadURL = createDownloadUrl(tableDataTSV, 'text/tab-separated-values')
        return (
            <Container fluid={true}>
                <Row className="mb-2">
                    <div className="col-sm-12">
                        <div className="entity_subtitle icon_inline float-md-end">
                            <a href={downloadURL}
                               download={`${this.props.filename}.tsv`}
                               className="float-end">
                        <span className="btn btn-primary"
                              role='button'
                              aria-label='Download Metadata'
                              title='Download Metadata'>
                            <i className="bi bi-download"></i>
                        </span>
                            </a>
                        </div>
                    </div>
                </Row>
                { this.props.data.source_type === 'Human' ?
                    (
                        <SourceDataTable metadata={this.props.metadata} />
                    ) :
                    (
                        <DataTable columns={this.columns}
                           data={this.data}
                           pagination/>
                    )
                }
            </Container>
        )
    }
}

MetadataTable.propTypes = {
    data: PropTypes.object.isRequired,
    filename: PropTypes.string.isRequired,
    metadata: PropTypes.object.isRequired,
    metadataKey: PropTypes.string.isRequired,
    setHeaderBadges: PropTypes.func.isRequired,
}

export default MetadataTable