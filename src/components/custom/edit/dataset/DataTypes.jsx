import React from 'react';
import {Col, Form, Row} from 'react-bootstrap';
import {QuestionCircleFill} from "react-bootstrap-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import SenNetPopover from "../../../SenNetPopover";
import {getUBKGFullName} from "../../js/functions";

export default class DataTypes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_types_other_group_hide: 'none',
        };

        // Show data type other input if data type is 'other'
        if (props.data.dataset_type === 'Other') {
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

        //We are removing the ability to specify an "Other" data type

        // // If data type is 'Other' then display the 'data_other' input group
        // if (e.target.value === 'Other') {
        //     //data Type Other set display and require
        //     this.setState({data_types_other_group_hide: ''})
        //     document.getElementById("data_types_other").setAttribute("required", "")
        //
        // } else {
        //     this.resetDataTypesOther(e, onChange);
        //
        // }
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
                        <SenNetPopover className={'data_types'}
                                       text={<>The type of data contained in this <code>Dataset</code>. Choose from one
                                           of the available options.</>}>
                            <QuestionCircleFill/>
                        </SenNetPopover>
                    </Form.Label>

                    {/*Check that there exists a data type for this dataset and if it is not a part of the list of primary assay types*/}
                    {this.props.data?.data_types?.[0] && !this.props.data_types.includes(this.props.data.data_types[0]) ?
                        (
                            <Form.Select required aria-label="Data Types" disabled>
                                <option
                                    value={this.props.data.data_types[0]}>{getUBKGFullName(this.props.data.data_types[0])}</option>
                            </Form.Select>
                        ) : (
                            <Form.Select required aria-label="Data Types"
                                         onChange={e => {
                                             this.handleDataTypeChange(e, this.props.onChange)
                                         }}
                                         defaultValue={this.props.data?.data_types?.[0]}>
                                <option value="">----</option>
                                {this.props.data_types.map(data_type => {
                                    return (
                                        <option key={data_type} value={data_type.trim()}>
                                            {getUBKGFullName(data_type)}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        )}

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