import React from "react";
import {Button, Modal} from 'react-bootstrap';
import log from 'loglevel'

const RUIModal = ({hide, show, tissueBlockSpatialData}) => {
    const copy = () => {
        navigator.clipboard.writeText(ruiLocation)
            .then(log.info)
            .catch(log.error)
    }
    let ruiLocation
    if (typeof tissueBlockSpatialData === 'string' || tissueBlockSpatialData instanceof String) {
        ruiLocation = tissueBlockSpatialData
    } else {
        ruiLocation = JSON.stringify(tissueBlockSpatialData, null, 2)
    }
    return (
        <Modal
            show={show}
            onHide={hide}
            animation={false}
            size={'xl'}
        >
            <Modal.Header closeButton>
                <Modal.Title>Sample Location Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <pre>
                    {ruiLocation}
                </pre>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={'outline-primary'} className={'rounded-0'} onClick={copy}>Copy</Button>
                <Button variant={'outline-secondary'} className={'rounded-0'} onClick={hide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default RUIModal;