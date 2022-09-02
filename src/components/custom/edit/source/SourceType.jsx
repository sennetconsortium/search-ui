import React from 'react';
import {Col, Form, Row} from 'react-bootstrap';
import {SOURCE_TYPES} from "../../../../config/constants";
import {QuestionCircleFill} from "react-bootstrap-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

export default class SourceType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            specimen_type_other_group_hide: 'none',
            organ_group_hide: 'none',
            organ_other_hide: 'none'
        };

        // Show specimen type other input if specimen type is 'other'
        if (props.data.specimen_type === 'other') {
            this.state.specimen_type_other_group_hide = '';
        }
        // Show organ input group if specimen type is 'organ'
        if (props.data.specimen_type === 'organ') {
            this.state.organ_group_hide = '';
        }
    }

    handleSourceChange = (e, onChange) => {
        // Source Type Adjustments based on selected Value
    };


    // Reset forms fields
    resetSourceType = (e, onChange) => {
        this.setState({source_type: 'none'})
        // Empty the value of the fields and trigger onChange
        document.getElementById("source_type").value = "";
        onChange(e, "source_type", "")
    }



    render() {
        return (
            //Specimen Type
            <>
                <Form.Group className="mb-3" controlId="source_type">
                    <Form.Label>Source Type <span
                        className="required">* </span>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Popover>
                                    <Popover.Body>
                                        The type of Source.
                                    </Popover.Body>
                                </Popover>
                            }
                        >
                            <QuestionCircleFill/>
                        </OverlayTrigger>
                    </Form.Label>

                    <Form.Select required aria-label="Source Type"
                                 onChange={e => {
                                     this.handleSourceChange(e, this.props.onChange);
                                     this.props.onChange(e, e.target.id, e.target.value)
                                 }}
                                 defaultValue={this.props.data.specimen_type}>
                        <option value="">----</option>
                        {Object.entries(SOURCE_TYPES).map(op => {
                            return (
                                <option key={op[0]} value={op[0]}>
                                    {op[1]}
                                </option>
                            );

                        })}

                      

                       

                    </Form.Select>
                </Form.Group>



            </>
        )
    }
}