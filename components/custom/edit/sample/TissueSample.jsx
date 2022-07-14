import React, {useState} from 'react';
import {Form, Row, Col} from 'react-bootstrap';
import {TISSUE_TYPES, ORGAN_TYPES} from "../../../../config/constants";

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
        document.getElementById("organ_type_group").style.display = "";
        document.getElementById("organ_type").setAttribute("required", "")

        //Specimen Type Other set display hidden and remove required
        resetSpecimenTypeOther(e, onChange);

    } else {
        //Specimen Type Other/Organ Type set display hidden and remove required
        resetSpecimenTypeOther(e, onChange);

        resetOrganType(e, onChange);
    }
};

const handleOrganChange = (e, onChange) => {
    // If organ type is 'Other' then display organ_type_other group
    if (e.target.value === 'OT') {
        document.getElementById("organ_type_other").style.display = "";
        document.getElementById("organ_type_other").setAttribute("required", "")

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
    document.getElementById("organ_type_group").style.display = "none";
    document.getElementById("organ_type").removeAttribute("required")
    // Empty the value of the fields and trigger onChange
    document.getElementById("organ_type").value = "";
    onChange(e, "organ_type", null)

    // Need to also reset organ_type_other
    resetOrganTypeOther(e, onChange);
}

const resetOrganTypeOther = (e, onChange) => {
    document.getElementById("organ_type_other").style.display = "none";
    document.getElementById("organ_type_other").removeAttribute("required")
    // Empty the value of the fields and trigger onChange
    document.getElementById("organ_type_other").value = "";
    onChange(e, "organ_type_other", null)
}

export default class Tissue extends React.Component {
    render() {
        return (
            //Specimen Type
            <>
                <Form.Group className="mb-3" controlId="specimen_type">
                    <Form.Label>Tissue Sample Type <span
                        className="required">*</span></Form.Label>
                    <Form.Select required aria-label="Tissue Sample Type"
                                 onChange={e => {
                                     handleTissueChange(e, this.props.onChange);
                                     this.props.onChange(e, e.target.id, e.target.value)
                                 }}
                                 defaultValue={this.props.data.specimen_type}>
                        <option value="">----</option>
                        {this.props.editMode === 'edit' ? (
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
                            style={{display: 'none'}}>
                    <Form.Label column sm="2">Tissue Type Other <span
                        className="required">*</span></Form.Label>
                    <Col sm="4">
                        <Form.Control type="text" id="specimen_type_other"
                                      onChange={e => {
                                          this.props.onChange(e, e.target.id, e.target.value)
                                      }}
                                      placeholder="Please specify"/>
                    </Col>
                </Form.Group>

                {/*Organ Type*/}
                <Form.Group as={Row} className="mb-3" id="organ_type_group"
                            style={{display: 'none'}}>
                    <Form.Label column sm="2">Organ Type <span
                        className="required">*</span></Form.Label>
                    <Col sm="6">
                        <Form.Select aria-label="Organ Type" id="organ_type" onChange={e => {
                            handleOrganChange(e, this.props.onChange);
                            this.props.onChange(e, e.target.id, e.target.value)
                        }}>
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
                        <Form.Control style={{display: 'none'}} type="text" id="organ_type_other"
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