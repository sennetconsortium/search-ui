import { useContext } from 'react'
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import AppContext from '../../context/AppContext'

function AppModal({
    modalTitle,
    modalBody,
    showModal,
    showHideModal,
    handleClose,
    handleHome,
}) {
    const { _t } = useContext(AppContext)
    return (
        <section data-js-modal id='js-modal'>
            <Modal show={showModal}>
                <Modal.Header>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalBody}</p>
                </Modal.Body>
                <Modal.Footer>
                    {showHideModal && (
                        <Button
                            variant="outline-secondary rounded-0"
                            onClick={handleClose}
                        >
                            {_t('Close')}
                        </Button>
                    )}
                    <Button
                        variant="outline-primary rounded-0"
                        onClick={handleHome}
                    >
                        {_t('Home page')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    )
}

export default AppModal
