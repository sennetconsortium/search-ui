import React, {useEffect, useState} from 'react';
import {Col, Form, Row} from 'react-bootstrap';
import {QuestionCircleFill} from "react-bootstrap-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import SenNetPopover from "../../../SenNetPopover";
import {getUBKGFullName} from "../../js/functions";

export default function DatasetType({datasetTypes, values, data, onChange}) {
    const [datasetTypeOtherHide, setDatasetTypeOtherHide] = useState('none')

    useEffect(() => {
        // Show data type other input if data type is 'other'
        if (data.dataset_type === 'Other') {
            setDatasetTypeOtherHide('')
        }
    }, [])


    const handleDataTypeChange = (e, onChange) => {
        // We may want to support setting multiple data types

        // let old_data_types = [];
        // if (this.props.values.data_types !== undefined) {
        //     old_data_types = [...this.props.values.data_types]
        // }
        // old_data_types.push(e.target.value);
        this.props.onChange(e, 'dataset_type', e.target.value);

        //We are removing the ability to specify an "Other" data type

        // // If data type is 'Other' then display the 'data_other' input group
        // if (e.target.value === 'Other') {
        //     //data Type Other set display and require
        //     this.setState({datasetTypeOtherHide: ''})
        //     document.getElementById("data_types_other").setAttribute("required", "")
        //
        // } else {
        //     this.resetDataTypesOther(e, onChange);
        //
        // }
    }

    // Reset forms fields
    const resetDataTypesOther = (e, onChange) => {
        this.setState({datasetTypeOtherHide: 'none'})
        document.getElementById("data_types_other").removeAttribute("required")
        // Empty the value of the fields and trigger onChange
        document.getElementById("data_types_other").value = "";
        onChange(e, "data_types_other", "")
    }


    return (
        //Data Types
        <>
            <Form.Group className="mb-3" controlId="dataset_type">
                <Form.Label>Dataset Type <span
                    className="required">* </span>
                    <SenNetPopover className={'data_types'}
                                   text={<>The type of data contained in this <code>Dataset</code>. Choose from one
                                       of the available options.</>}>
                        <QuestionCircleFill/>
                    </SenNetPopover>
                </Form.Label>

                {/*Check that there exists a data type for this dataset and if it is not a part of the list of primary assay types*/}
                {data?.dataset_type && !datasetTypes.includes(data.dataset_type) ?
                    (
                        <Form.Select required aria-label="Dataset Type" disabled>
                            <option
                                value={data.dataset_type}>{getUBKGFullName(data.dataset_type)}</option>
                        </Form.Select>
                    ) : (
                        <Form.Select required aria-label="Dataset Type"
                                     onChange={onChange}
                                     defaultValue={data?.dataset_type}>
                            <option value="">----</option>
                            {datasetTypes.map(data_type => {
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
                        style={{display: datasetTypeOtherHide}}>
                <Form.Label column sm="2">Dataset Type Other <span
                    className="required">*</span></Form.Label>
                <Col sm="4">
                    <Form.Control type="text" id="dataset_type_other"
                                  onChange={e => {
                                      onChange(e, e.target.id, e.target.value)
                                  }}
                                  defaultValue={data.data_types_other}
                                  placeholder="Please specify"/>
                </Col>
            </Form.Group>
        </>
    )

}