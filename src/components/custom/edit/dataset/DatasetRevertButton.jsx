import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import AppModal from "../../../AppModal";
import {Button, Form, Badge} from 'react-bootstrap'
import {getStatusColor} from "../../js/functions";

function DatasetRevertButton({disableSubmit, onClick, onStatusChange, data}) {
    const [show, setShow] = useState(false)
    useEffect(() => {
    }, [])

    const showModal = () => {
        setShow(true)
    }
    const hideModal = () => {
        setShow(false)
    }

    return (
        <>
            <Button className="me-2" variant="outline-primary rounded-0" disabled={disableSubmit}
                    onClick={showModal}>
                Revert
            </Button>

            <AppModal
                className={`modal--ctaConfirm`}
                showModal={show}
                modalTitle={`Select ${data.entity_type} Status`}
                modalBody={<div>
                    <Form.Group className="mb-3" controlId="status">
                        <Form.Label>Choose a status to revert this <code>{data.entity_type}</code> to, then click [Revert] to apply your changes.
                        </Form.Label>
                        <Form.Select required aria-label="status-select"
                                     onChange={e => onStatusChange(e, e.target.id, e.target.value)}>
                            <option value="">----</option>
                            <option>New</option>
                            <option>Submitted</option>
                        </Form.Select>
                    </Form.Group>
                  </div>}
                handleClose={hideModal}
                handleHome={() => {
                    onClick()
                    hideModal()
                }}
                actionButtonLabel={'Revert'}
                actionBtnClassName={'js-btn--revert'}
                showCloseButton={true}
                closeButtonLabel={'Close'}
            />
        </>
    )
}

DatasetRevertButton.defaultProps = {}

DatasetRevertButton.propTypes = {
    children: PropTypes.node
}

export default DatasetRevertButton