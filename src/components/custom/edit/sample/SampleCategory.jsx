import React from 'react';
import {Col, Form, Row} from 'react-bootstrap';
import {ORGAN_TYPES, SAMPLE_CATEGORY} from "../../../../config/constants";
import {QuestionCircleFill} from "react-bootstrap-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

export default class SampleCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            organ_group_hide: 'none',
            organ_other_hide: 'none',
        };

        // Show organ input group if sample category is 'organ'
        if (props.data.sample_category === 'organ') {
            this.state.organ_group_hide = '';
        }
    }

    handleSampleCategoryChange = (e, onChange) => {
        // If sample category is 'Organ' then display the organ type input group
        if (e.target.value === 'organ') {
            //Organ Type set display and require
            this.setState({organ_group_hide: ''})
            document.getElementById("organ").setAttribute("required", "")

        } else {
            this.resetOrganType(e, onChange);
        }
    };

    handleOrganChange = (e, onChange) => {
        // If organ type is 'Other' then display organ_other group
        if (e.target.value === 'other') {
            this.setState({organ_other_hide: ''})
            document.getElementById("organ_other").setAttribute("required", "")

        } else {
            this.resetOrganTypeOther(e, onChange);
        }
    }

    resetOrganType = (e, onChange) => {
        this.setState({organ_group_hide: 'none'})
        document.getElementById("organ").removeAttribute("required")
        // Empty the value of the fields and trigger onChange
        document.getElementById("organ").value = "";
        onChange(e, "organ", "")

        // Need to also reset organ_other
        this.resetOrganTypeOther(e, onChange);
    }

    resetOrganTypeOther = (e, onChange) => {
        this.setState({organ_other_hide: 'none'})
        document.getElementById("organ_other").removeAttribute("required")
        // Empty the value of the fields and trigger onChange
        document.getElementById("organ_other").value = "";
        onChange(e, "organ_other", "")
    }

    render() {
        return (
            //Sample Category
            <>
                <Form.Group className="mb-3" controlId="sample_category">
                    <Form.Label>Sample Category <span
                        className="required">* </span>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Popover>
                                    <Popover.Body>
                                        The category this sample belongs to.
                                    </Popover.Body>
                                </Popover>
                            }
                        >
                            <QuestionCircleFill/>
                        </OverlayTrigger>
                    </Form.Label>

                    <Form.Select required aria-label="Sample Category"
                                 onChange={e => {
                                     this.handleSampleCategoryChange(e, this.props.onChange);
                                     this.props.onChange(e, e.target.id, e.target.value)
                                 }}
                                 defaultValue={this.props.data.sample_category}>
                        <option value="">----</option>
                        {Object.entries(SAMPLE_CATEGORY).map(op => {
                            return (
                                <option key={op[0]} value={op[0]}>
                                    {op[1]}
                                </option>
                            );

                        })}
                    </Form.Select>
                </Form.Group>

                {/*Organ Type*/}
                <Form.Group as={Row} className="mb-3" id="organ_group"
                            style={{display: this.state.organ_group_hide}}>
                    <Form.Label column sm="2">Organ Type <span
                        className="required">*</span></Form.Label>
                    <Col sm="6">
                        <Form.Select aria-label="Organ Type" id="organ" onChange={e => {
                            this.handleOrganChange(e, this.props.onChange);
                            this.props.onChange(e, e.target.id, e.target.value)
                        }}
                                     defaultValue={this.props.data.organ}>
                            <option value="">----</option>
                            {Object.entries(ORGAN_TYPES).map(op => {
                                return (
                                    <option key={op[0]} value={op[0]}>
                                        {op[1]}
                                    </option>
                                );

                            })}
                        </Form.Select>
                    </Col>
                    {/*Organ Type Other*/}
                    <Col sm="4">
                        <Form.Control style={{display: this.state.organ_other_hide}} type="text"
                                      id="organ_other"
                                      defaultValue={this.props.data.organ_other}
                                      onChange={e => {
                                          this.props.onChange(e, e.target.id, e.target.value)
                                      }}
                                      placeholder="Please specify"/>
                    </Col>
                </Form.Group>
            </>
        )
    }
}