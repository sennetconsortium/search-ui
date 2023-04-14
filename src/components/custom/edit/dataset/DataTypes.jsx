import React from 'react';
import {Col, Form, Row} from 'react-bootstrap';
import {QuestionCircleFill} from "react-bootstrap-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

export default class DataTypes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_types_other_group_hide: 'none',
        };

        // Show data type other input if data type is 'other'
        if (props.data.data_types?.[0] === 'Other') {
            this.state.data_types_other_group_hide = '';
        }
    }

    handleDataTypeChange = (e, onChange) => {
        // We may want to support setting multiple data types

        // let old_data_types = [];
        // if (this.props.values.data_types !== undefined) {
        //     old_data_types = [...this.props.values.data_types]
        // }
        // old_data_types.push(e.target.value);
        this.props.onChange(e, 'data_types', [e.target.value]);

        // If data type is 'Other' then display the 'data_other' input group
        if (e.target.value === 'Other') {
            //data Type Other set display and require
            this.setState({data_types_other_group_hide: ''})
            document.getElementById("data_types_other").setAttribute("required", "")

        } else {
            this.resetDataTypesOther(e, onChange);

        }
    }

    // Reset forms fields
    resetDataTypesOther = (e, onChange) => {
        this.setState({data_types_other_group_hide: 'none'})
        document.getElementById("data_types_other").removeAttribute("required")
        // Empty the value of the fields and trigger onChange
        document.getElementById("data_types_other").value = "";
        onChange(e, "data_types_other", "")
    }

    render() {
        return (
            //Data Types
            <>
                <Form.Group className="mb-3" controlId="data_types">
                    <Form.Label>Data Types <span
                        className="required">* </span>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Popover>
                                    <Popover.Body>
                                        Data type
                                    </Popover.Body>
                                </Popover>
                            }
                        >
                            <QuestionCircleFill/>
                        </OverlayTrigger>
                    </Form.Label>

                    <Form.Select required aria-label="Data Types"
                                 onChange={e => {
                                     this.handleDataTypeChange(e, this.props.onChange)
                                 }}
                                 defaultValue={this.props.data?.data_types?.[0]}>
                        <option value="">----</option>
                        {Object.entries(this.props.data_types).map(op => {
                            return (
                                <option key={op[0]} value={op[0]}>
                                    {op[1]}
                                </option>
                            );

                        })}
                    </Form.Select>
                </Form.Group>

                {/*Data Types Other*/}
                <Form.Group as={Row} className="mb-3" id="data_types_other_group"
                            style={{display: this.state.data_types_other_group_hide}}>
                    <Form.Label column sm="2">Data Types Other <span
                        className="required">*</span></Form.Label>
                    <Col sm="4">
                        <Form.Control type="text" id="data_types_other"
                                      onChange={e => {
                                          this.props.onChange(e, e.target.id, e.target.value)
                                      }}
                                      defaultValue={this.props.data.data_types_other}
                                      placeholder="Please specify"/>
                    </Col>
                </Form.Group>
            </>
        )
    }
}