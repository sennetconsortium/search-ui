import React, {useState} from 'react';
import {Check2Circle, QuestionCircleFill} from "react-bootstrap-icons";
import RUIModal from "./RUIModal";
import {Button, Form, OverlayTrigger, Popover} from 'react-bootstrap';


const RuiButton = ({showRegisterLocationButton, ruiLocation, setShowRui}) => {
    const [showRuiLocationModal, setShowRuiLocationModal] = useState(false)

    const handleRegisterLocationClick = () => {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        setShowRui(true)
    }

    return (
        <>
            {/*  RUI Tissue Block Registration  */}
            {
                (showRegisterLocationButton || ruiLocation) &&
                <>
                <Form.Label column sm="2">Sample location<span>{' '}</span>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Popover>
                                <Popover.Body>
                                    Provide location information of the tissue sample.
                                </Popover.Body>
                            </Popover>}
                    >
                        <QuestionCircleFill/>
                    </OverlayTrigger>
                    {
                        ruiLocation &&
                        <>
                            <span>{' '}</span>
                            <Check2Circle color={'green'}/>
                        </>
                    }


                </Form.Label>
                <div className="mb-2 text-muted">
                CCF Registration User Interface (CCF-RUI) tool is only available for <code>Human</code> and <code>Human organoid</code> <em>Ancestor</em> source types and sample category <code>Block</code>.
                </div>
                </>
            }
            <div>
                {
                    showRegisterLocationButton &&
                    <Button variant={'outline-primary'}
                            className={'rounded-0 mb-2'}
                            onClick={handleRegisterLocationClick}>
                        Register location
                    </Button>
                }
                {
                    ruiLocation &&
                    <>
                        <Button variant={'outline-success'} className={'rounded-0 mb-2 ms-2'}
                                onClick={() => setShowRuiLocationModal(true)}>
                            View JSON
                        </Button>
                        <RUIModal
                            tissueBlockSpatialData={ruiLocation}
                            show={showRuiLocationModal}
                            hide={() => setShowRuiLocationModal(false)}
                        />
                    </>
                }
            </div>
        </>
    );
};

export default RuiButton;