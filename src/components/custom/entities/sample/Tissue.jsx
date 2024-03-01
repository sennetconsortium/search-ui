import React from 'react';
import {Table, Card} from 'react-bootstrap';
import SenNetAccordion from "../../layout/SenNetAccordion";
import {displayBodyHeader, getUBKGFullName} from "../../js/functions";
import DataTable from "react-data-table-component";

export default function Tissue({ data }) {

    const columns = [
        {
            name: 'Organ',
            selector: row => getUBKGFullName(row.origin_sample?.organ),
            width: '120px',
            format: row => <a href={`/organs/${getUBKGFullName(row.origin_sample?.organ).toLowerCase()}`}>{getUBKGFullName(row.origin_sample?.organ)}</a>,
        },
        {
            name: 'Category',
            selector: row => row.sample_category,
            width: '200px',
            format: row => {
                return <span>{row.sample_category ? displayBodyHeader(row.sample_category) : ''}</span>
            }
        },
        {
            name: 'Tissue Location',
            selector: row => row.rui_location,
            omit: data.rui_location.length <= 0,
            format: row => {
                return <div>The <a href={`/api/json?view=${btoa(row.rui_location)}`} target={'_blank'}>spatial coordinates of this sample</a> have been registered and it can be found in the <a target={'_blank'} href={'/ccf-eui'}>Common Coordinate Framework Exploration User Interface</a>.</div>
            }
        }
    ]

        return (
            <SenNetAccordion title={'Tissue'}>
                <Card border='0' className='mb-2 pb-2'>
                    <DataTable columns={columns} data={[data]} />
                </Card>
            </SenNetAccordion>
        )

}