import React from "react";
import Modal from 'react-bootstrap/Modal';
import {Button} from 'react-bootstrap';

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
                <Modal show={this.state.showModal} onHide={this.hideModal} keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Submission</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        By clicking "Submit" this dataset will be processed and its status set to "QA".
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-primary rounded-0 js-btn--submit" onClick={() => {
                            this.props.onClick();
                            this.hideModal()
                        }}>
                            Submit
                        </Button>
                        <Button variant="outline-secondary rounded-0" onClick={this.hideModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}