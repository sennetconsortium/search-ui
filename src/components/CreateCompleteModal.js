import React from 'react';
import {Button, Modal} from 'react-bootstrap'

const CreateCompleteModal = ({showModal, modalTitle, modalBody, handleClose, handleHome, showCloseButton}) => {
    return (
        <Modal show={showModal}
               backdrop="static"
               centered>
            <Modal.Header>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body><p>{modalBody}</p></Modal.Body>
            <Modal.Footer>
                {showCloseButton &&
                    <Button variant="outline-secondary rounded-0" onClick={handleClose}>
                        Close
                    </Button>
                }
                <Button variant="outline-primary rounded-0" onClick={handleHome}>
                    Home page
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateCompleteModal;