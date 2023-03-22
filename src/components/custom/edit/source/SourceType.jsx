import React from 'react';
import {Form} from 'react-bootstrap';
import {QuestionCircleFill} from "react-bootstrap-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {SOURCE_TYPE} from "../../../../config/constants";
import SenNetPopover from "../../../SenNetPopover";

export default class SourceType extends React.Component {
    render() {
        return (
            //Source Type
            <>
                <Form.Group className="mb-3" controlId="source_type">
                    <Form.Label>Source Type <span
                        className="required">* </span>
                        <SenNetPopover className={'source_type'} text={<>
                            <code>Source</code> type <br />
                            <small className='popover-note text-muted'>Note: CCF Registration User Interface (CCF-RUI) tool is only available for <code>Human</code> and <code>Human organoid</code> types.</small>
                        </>}>
                            <QuestionCircleFill/>
                        </SenNetPopover>
                    </Form.Label>

                    <Form.Select required aria-label="Source Type"
                                 onChange={e => {
                                     this.props.onChange(e, e.target.id, e.target.value)

                                 }}
                                 defaultValue={this.props.data?.source_type}>
                        <option value="">----</option>
                        {Object.entries(SOURCE_TYPE).map(op => {
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