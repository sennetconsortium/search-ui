import React, {useState} from "react";
import Badge from 'react-bootstrap/Badge'
import {Button} from 'react-bootstrap';
import AppModal from "../../../AppModal";
import {getStatusColor} from "../../js/functions";

const DatasetSubmissionButton = ({onClick, btnLabel, actionBtnClassName, modalBody, modalTitle, disableSubmit}) => {
    const [showModal, setShowModal] = useState(false)


    const displayModal = () => {
        setShowModal(true)
    }

    const hideModal = () => {
        setShowModal(false)
    }


        return (
            <>
                <Button className="me-2" variant="outline-primary rounded-0" disabled={disableSubmit}
                        onClick={displayModal}>
                    {btnLabel}
                </Button>

                <AppModal
                    className={`modal--ctaConfirm`}
                    showModal={showModal}
                    modalTitle={`Confirm ${modalTitle || 'Submission'}`}
                    modalBody={modalBody}
                    handleClose={hideModal}
                    handleHome={() => {
                        onClick()
                        hideModal()
                    }}
                    actionButtonLabel={btnLabel}
                    actionBtnClassName={actionBtnClassName || 'js-btn--submit'}
                    showCloseButton={true}
                    closeButtonLabel={'Close'}
                />
            </>
        )

}

export default DatasetSubmissionButton