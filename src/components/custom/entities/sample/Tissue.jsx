import React, {useContext} from 'react';
import {Table, Card} from 'react-bootstrap';
import SenNetAccordion from "../../layout/SenNetAccordion";
import {displayBodyHeader, getUBKGFullName} from "../../js/functions";
import DataTable from "react-data-table-component";
import {Chip, Avatar, Stack} from "@mui/material";
import {organDetails} from "../../../../config/organs";
import AppContext from "../../../../context/AppContext";

export default function Tissue({ data }) {
    const {cache} = useContext(AppContext)

    const columns = [
        {
            name: 'Organ',
            selector: row => getUBKGFullName(row.origin_sample?.organ),
            width: '120px',
            format: row => {
                const name = getUBKGFullName(row.origin_sample?.organ)
                const code = cache.organTypesCodes[name]
                const icon = organDetails[code].icon || organDetails.OT.icon
                return <Chip className={'no-focus bg--none lnk--txt'} avatar={<Avatar alt={name} src={icon} />} label={name} onClick={()=> window.location = `/organs/${name.toLowerCase()}`} />
            },
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

    const anatomicalLocations = () => {
        let result = []
        for (let r of data.rui_location_anatomical_locations) {
            result.push(<span key={r}><Chip label={r} size='small'  /></span>)
        }
        return result;
    }

    return (
        <>
            <SenNetAccordion title={'Tissue'}>
                <Card border='0' className='mb-2 pb-2'>
                    <DataTable columns={columns} data={[data]} />
                </Card>
            </SenNetAccordion>

            <SenNetAccordion title={'Anatomical Locations'} id={'anatomical-locations'}>
                <Card border='0' className='mb-2 pb-2'>
                    <Stack direction="row" spacing={1}>
                    {anatomicalLocations()}
                    </Stack>
                </Card>
            </SenNetAccordion>
        </>
    )

}