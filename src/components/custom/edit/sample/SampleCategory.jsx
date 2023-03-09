import React from 'react';
import {Col, Form, Row} from 'react-bootstrap';
import {ORGAN_TYPES} from "../../../../config/constants";
import {QuestionCircleFill} from "react-bootstrap-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import SenPopover from "../../../SenPopover";

function SampleCategory({
                            organ_group_hide,
                            set_organ_group_hide,
                            organ_other_hide,
                            set_organ_other_hide,
                            data,
                            onChange,
                            sample_categories
                        }) {

    const handleSampleCategoryChange = (e, onChange) => {
        // If sample category is 'Organ' then display the organ type input group
        if (e.target.value === 'organ') {
            //Organ Type set display and require
            set_organ_group_hide('')
            document.getElementById("organ").setAttribute("required", "")

        } else {
            resetOrganType(e, onChange);
        }
    };

    const handleOrganChange = (e, onChange) => {
        // If organ type is 'Other' then display organ_other group
        if (e.target.value === 'other') {
            set_organ_other_hide('')
            document.getElementById("organ_other").setAttribute("required", "")

        } else {
            resetOrganTypeOther(e, onChange);
        }
    }

    const resetOrganType = (e, onChange) => {
        set_organ_group_hide('none')
        document.getElementById("organ").removeAttribute("required")
        // Empty the value of the fields and trigger onChange
        document.getElementById("organ").value = "";
        onChange(e, "organ", "")

        // Need to also reset organ_other
        resetOrganTypeOther(e, onChange);
    }

    const resetOrganTypeOther = (e, onChange) => {
        set_organ_other_hide('none')
        document.getElementById("organ_other").removeAttribute("required")
        // Empty the value of the fields and trigger onChange
        document.getElementById("organ_other").value = "";
        onChange(e, "organ_other", "")
    }

    return (
        //Sample Category
        <>
            <Form.Group className="mb-3" controlId="sample_category">
                <Form.Label>Sample Category <span
                    className="required">* </span>
                    <SenPopover text={<>
                        The category this <code>Sample</code> belongs to. <br />
                        <small className='popover-note text-muted mt-2'>Note: CCF Registration User Interface (CCF-RUI) tool becomes available for the <code>Block Sample</code> category where the <em>Ancestor</em> <code>Source</code> is of type <code>Human</code> or <code>Human organoid</code>.</small>
                    </>}>
                        <QuestionCircleFill/>
                    </SenPopover>

                </Form.Label>

                <Form.Select required aria-label="Sample Category"
                             onChange={e => {
                                 handleSampleCategoryChange(e, onChange);
                                 onChange(e, e.target.id, e.target.value)
                             }}
                             defaultValue={data.sample_category}>
                    <option value="">----</option>
                    {Object.entries(sample_categories).map(sample_category => {
                        return (
                            <option key={sample_category[0]} value={sample_category[0]}>
                                {sample_category[1]}
                            </option>
                        );

                    })}
                </Form.Select>
            </Form.Group>

            {/*Organ Type*/}
            <Form.Group as={Row} className="mb-3" id="organ_group"
                        style={{display: organ_group_hide}}>
                <Form.Label column sm="2">Organ Type <span
                    className="required">*</span></Form.Label>
                <Col sm="6">
                    <Form.Select aria-label="Organ Type" id="organ" onChange={e => {
                        handleOrganChange(e, onChange);
                        onChange(e, e.target.id, e.target.value)
                    }}
                                 defaultValue={data.organ}>
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
                    <Form.Control style={{display: organ_other_hide}} type="text"
                                  id="organ_other"
                                  defaultValue={data.organ_other}
                                  onChange={e => {
                                      onChange(e, e.target.id, e.target.value)
                                  }}
                                  placeholder="Please specify"/>
                </Col>
            </Form.Group>
        </>
    )

}

export default SampleCategory