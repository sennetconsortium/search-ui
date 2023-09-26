import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import SenNetAccordion from "../../layout/SenNetAccordion";
import Card from 'react-bootstrap/Card';
import ClipboardCopy from "../../../ClipboardCopy";
import {getEntityViewUrl} from "../../js/functions";

function Upload({ data }) {
    useEffect(() => {
    }, [])

    return (
        <>
            <SenNetAccordion title={'Associated Upload'}>
                <Card border={'0'}>
                    <Card.Body>
                    <p className='fw-light fs-6'>This <code>Dataset</code> is contained in the data <code>Upload</code>
                        &nbsp;<a href={getEntityViewUrl('Upload', data.uuid, {})}>{data.sennet_id}<ClipboardCopy text={data.sennet_id}/></a></p>
                    </Card.Body>
                </Card>
            </SenNetAccordion>
        </>
    )
}

export default Upload