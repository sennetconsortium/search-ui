import { useContext, useState, useRef } from 'react'
import {Button, Modal} from 'react-bootstrap'
import AppContext from '../context/AppContext'
import PropTypes from "prop-types"

const AppModal = ({showModal, modalTitle, modalBody, handleClose, handleHome, showCloseButton, closeButtonLabel,
                      showHomeButton, children, modalSize, className, actionBtnClassName, actionButtonLabel}) => {
    const [size, setSize] = useState(modalSize)
    const {_t} = useContext(AppContext)
    return (
        <section data-js-ada='modal' id='js-modal'>
            <Modal
                className={className}
                    show={showModal}
                    size={size}
                    backdrop="static"
                    centered>
                <Modal.Header>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalBody && <div key="modal-body">{modalBody}</div> }
                    {children}
                </Modal.Body>
                {(showCloseButton || showHomeButton) && <Modal.Footer>
                    {showCloseButton &&
                        <Button variant="outline-secondary rounded-0" onClick={handleClose || closeModal}>
                            {_t(closeButtonLabel)}
                        </Button>
                    }
                    {showHomeButton &&
                        <Button variant="outline-primary rounded-0" className={actionBtnClassName} onClick={handleHome}>
                            {_t(actionButtonLabel)}
                        </Button>
                    }
                </Modal.Footer>}
            </Modal>
        </section>
    );
};

AppModal.defaultProps = {
    showModal: false,
    showHomeButton: true,
    closeButtonLabel: 'Close',
    actionButtonClassName: '',
    actionButtonLabel: 'Home page'
}

AppModal.propTypes = {
    showModal: PropTypes.bool,
    showHomeButton: PropTypes.bool,
    closeButtonLabel: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string
}

export default AppModal;