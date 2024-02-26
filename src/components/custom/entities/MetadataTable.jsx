import React from 'react';
import {Container, Row} from 'react-bootstrap'
import {createDownloadUrl, tableDataToTSV} from "../js/functions";
import DataTable from "react-data-table-component";
import useDataTableSearch from "../../../hooks/useDataTableSearch";

export default function MetadataTable({metadata, metadataKey, filename}) {
    let columns = [
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

    let data = [];
    Object.entries(metadata).map(([key, value]) => {
        data.push({
            key: metadataKey + key,
            value: Array.isArray(value) ? value.join(', ') : value
        })
    })

    const tableDataTSV = tableDataToTSV(metadata);
    const downloadURL = createDownloadUrl(tableDataTSV, 'text/tab-separated-values')
    const {filteredItems, filterText, searchBarComponent} = useDataTableSearch(data, null, ['value', 'key'])
    return (
        <Container fluid={true} className={'rdt-container-wrap'}>
            <Row className="mb-2">
                <div className="col-sm-12">
                    <div className="entity_subtitle icon_inline float-md-end">
                        <a href={downloadURL}
                           download={`${filename}.tsv`}
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
            <DataTable columns={columns}
                       data={filteredItems}
                       subHeader
                       subHeaderComponent={searchBarComponent}
                       pagination/>
        </Container>
    )
}
