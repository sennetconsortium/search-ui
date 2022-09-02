import React from 'react';
import {Col, Form, Row} from 'react-bootstrap';
import {ORGAN_TYPES, SAMPLE_TYPES} from "../../../../config/constants";
import {QuestionCircleFill} from "react-bootstrap-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

export default class SampleCategory extends React.Component {
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

    handleTissueChange = (e, onChange) => {
        // If specimen type is 'Other' then display the 'specimen_other' input group
        if (e.target.value === 'other') {
            //Specimen Type Other set display and require
            this.setState({specimen_type_other_group_hide: ''})
            document.getElementById("specimen_type_other").setAttribute("required", "")

            //Organ Type set display hidden and remove required
            this.resetOrganType(e, onChange);
        }
        // If specimen type is 'Organ' then display the organ type input group
        else if (e.target.value === 'organ') {
            //Organ Type set display and require
            this.setState({organ_group_hide: ''})
            document.getElementById("organ").setAttribute("required", "")

            //Specimen Type Other set display hidden and remove required
            this.resetSpecimenTypeOther(e, onChange);

        } else {
            //Specimen Type Other/Organ Type set display hidden and remove required
            this.resetSpecimenTypeOther(e, onChange);

            this.resetOrganType(e, onChange);
        }
    };

    handleOrganChange = (e, onChange) => {
        // If organ type is 'Other' then display organ_other group
        if (e.target.value === 'OT') {
            this.setState({organ_other_hide: ''})
            document.getElementById("organ_other").setAttribute("required", "")

        } else {
            this.resetOrganTypeOther(e, onChange);
        }
    }

    // Reset forms fields
    resetSpecimenTypeOther = (e, onChange) => {
        this.setState({specimen_type_other_group_hide: 'none'})
        document.getElementById("specimen_type_other").removeAttribute("required")
        // Empty the value of the fields and trigger onChange
        document.getElementById("specimen_type_other").value = "";
        onChange(e, "specimen_type_other", "")
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
            //Specimen Type
            <>
                <Form.Group className="mb-3" controlId="specimen_type">
                    <Form.Label>Sample Type <span
                        className="required">* </span>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Popover>
                                    <Popover.Body>
                                        The type of specimen.
                                    </Popover.Body>
                                </Popover>
                            }
                        >
                            <QuestionCircleFill/>
                        </OverlayTrigger>
                    </Form.Label>

                    <Form.Select required aria-label="Sample Type"
                                 onChange={e => {
                                     this.handleTissueChange(e, this.props.onChange);
                                     this.props.onChange(e, e.target.id, e.target.value)
                                 }}
                                 defaultValue={this.props.data.specimen_type}>
                        <option value="">----</option>
                        {this.props.source ? (
                            SAMPLE_TYPES[this.props.source.entity_type].map((optgs, index) => {
                                return (
                                    <optgroup
                                        key={index}
                                        label="____________________________________________________________"
                                    >
                                        {Object.entries(optgs).map(op => {
                                            return (
                                                <option key={op[0]} value={op[0]}>
                                                    {op[1]}
                                                </option>
                                            );

                                        })}
                                    </optgroup>
                                );
                            })
                        ) : (
                            <optgroup
                                label="____________________________________________________________">
                                <option value="organ">
                                    Organ
                                </option>
                            </optgroup>
                        )
                        }
                    </Form.Select>
                </Form.Group>

                {/*TODO: Need to remove all instances of "specimen_type_other" as it won't be needed after the rework of this component*/}
                {/*Specimen Type Other*/}
                <Form.Group as={Row} className="mb-3" id="specimen_type_other_group"
                            style={{display: this.state.specimen_type_other_group_hide}}>
                    <Form.Label column sm="2">Tissue Type Other <span
                        className="required">*</span></Form.Label>
                    <Col sm="4">
                        <Form.Control type="text" id="specimen_type_other"
                                      onChange={e => {
                                          this.props.onChange(e, e.target.id, e.target.value)
                                      }}
                                      defaultValue={this.props.data.specimen_type_other}
                                      placeholder="Please specify"/>
                    </Col>
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
                                     defaultValue={this.props.data.organ}>>
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