import React from 'react';
import {Form, Row, Col} from 'react-bootstrap';
import {TISSUE_TYPES, ORGAN_TYPES} from "../../../../config/constants";
import {QuestionCircleFill} from "react-bootstrap-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const handleTissueChange = (e, onChange) => {
    // If specimen type is 'Other' then display the 'specimen_other' input group
    if (e.target.value === 'other') {
        //Specimen Type Other set display and require
        document.getElementById("specimen_type_other_group").style.display = "";
        document.getElementById("specimen_type_other").setAttribute("required", "")

        //Organ Type set display hidden and remove required
        resetOrganType(e, onChange);
    }
    // If specimen type is 'Organ' then display the organ type input group
    else if (e.target.value === 'organ') {
        //Organ Type set display and require
        document.getElementById("organ_group").style.display = "";
        document.getElementById("organ").setAttribute("required", "")

        //Specimen Type Other set display hidden and remove required
        resetSpecimenTypeOther(e, onChange);

    } else {
        //Specimen Type Other/Organ Type set display hidden and remove required
        resetSpecimenTypeOther(e, onChange);

        resetOrganType(e, onChange);
    }
};

const handleOrganChange = (e, onChange) => {
    // If organ type is 'Other' then display organ_other group
    if (e.target.value === 'OT') {
        document.getElementById("organ_other").style.display = "";
        document.getElementById("organ_other").setAttribute("required", "")

    } else {
        resetOrganTypeOther(e, onChange);
    }
}

// Reset forms fields
const resetSpecimenTypeOther = (e, onChange) => {
    document.getElementById("specimen_type_other_group").style.display = "none";
    document.getElementById("specimen_type_other").removeAttribute("required")
    // Empty the value of the fields and trigger onChange
    document.getElementById("specimen_type_other").value = "";
    onChange(e, "specimen_type_other", null)
}

const resetOrganType = (e, onChange) => {
    document.getElementById("organ_group").style.display = "none";
    document.getElementById("organ").removeAttribute("required")
    // Empty the value of the fields and trigger onChange
    document.getElementById("organ").value = "";
    onChange(e, "organ", null)

    // Need to also reset organ_other
    resetOrganTypeOther(e, onChange);
}

const resetOrganTypeOther = (e, onChange) => {
    document.getElementById("organ_other").style.display = "none";
    document.getElementById("organ_other").removeAttribute("required")
    // Empty the value of the fields and trigger onChange
    document.getElementById("organ_other").value = "";
    onChange(e, "organ_other", null)
}

export default class Tissue extends React.Component {
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

    render() {
        return (
            //Specimen Type
            <>
                <Form.Group className="mb-3" controlId="specimen_type">
                    <Form.Label>Tissue Sample Type <span
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

                    <Form.Select required aria-label="Tissue Sample Type"
                                 onChange={e => {
                                     handleTissueChange(e, this.props.onChange);
                                     this.props.onChange(e, e.target.id, e.target.value)
                                 }}
                                 defaultValue={this.props.data.specimen_type}>
                        <option value="">----</option>
                        {this.props.editMode === 'edit' && this.props.data.specimen_type != 'organ' ? (
                            TISSUE_TYPES[this.props.data.entity_type].map((optgs, index) => {
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
                            handleOrganChange(e, this.props.onChange);
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