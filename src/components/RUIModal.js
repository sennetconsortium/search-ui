import React from "react";
import {Button, Modal} from 'react-bootstrap';
import log from 'loglevel'

const RUIModal = ({hide, show, tissueBlockSpatialData}) => {
    const copy = () => {
        navigator.clipboard.writeText(tissueBlockSpatialData)
            .then(log.info)
            .catch(log.error)
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
                    {tissueBlockSpatialData}
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