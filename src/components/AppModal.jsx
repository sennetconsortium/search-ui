import { useContext } from 'react'
import {Button, Modal} from 'react-bootstrap'
import AppContext from '../context/AppContext'

const AppModal = ({showModal, modalTitle, modalBody, handleClose, handleHome, showCloseButton}) => {
    const {_t} = useContext(AppContext)
    return (
        <section data-js-modal id='js-modal'>
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
                            {_t('Edit form')}
                        </Button>
                    }
                    <Button variant="outline-primary rounded-0" onClick={handleHome}>
                            {_t('Home page')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
};

export default AppModal;