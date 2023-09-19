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
                <Button className="me-2" variant="outline-primary rounded-0" disabled={this.props.disableSubmit}
                        onClick={this.showModal}>
                    {this.props.btnLabel}
                </Button>

                <AppModal
                    className={`modal--ctaConfirm`}
                    showModal={this.state.showModal}
                    modalTitle={'Confirm Submission'}
                    modalBody={this.props.modalBody}
                    handleClose={this.hideModal}
                    handleHome={() => {
                        this.props.onClick();
                        this.hideModal()
                    }}
                    actionButtonLabel={this.props.btnLabel}
                    actionBtnClassName={this.props.actionBtnClassName || 'js-btn--submit'}
                    showCloseButton={true}
                    closeButtonLabel={'Close'}
                />
            </>
        )
    }
}