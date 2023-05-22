import React from "react";
import Badge from 'react-bootstrap/Badge'
import {Button} from 'react-bootstrap';
import AppModal from "../../../AppModal";
import {getStatusColor} from "../../js/functions";

export default class DatasetSubmissionButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    showModal = () => {
        this.setState({showModal: true})
    }
    hideModal = () => {
        this.setState({showModal: false})
    }

    render() {
        return (
            <>
                <Button variant="outline-primary rounded-0" disabled={this.props.disableSubmit}
                        onClick={this.showModal}>
                    Submit
                </Button>

                <AppModal
                    className={`modal--ctaConfirm`}
                    showModal={this.state.showModal}
                    modalTitle={'Confirm Submission'}
                    modalBody={<div>By clicking "Submit" this <code>Dataset</code> will be processed and its status set to <Badge pill bg={getStatusColor('QA')}>QA</Badge>.</div>}
                    handleClose={this.hideModal}
                    handleHome={() => {
                        this.props.onClick();
                        this.hideModal()
                    }}
                    actionButtonLabel={'Submit'}
                    actionBtnClassName={'js-btn--submit'}
                    showCloseButton={true}
                    closeButtonLabel={'Close'}
                />
            </>
        )
    }
}