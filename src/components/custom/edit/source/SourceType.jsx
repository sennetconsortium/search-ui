import React from 'react';
import {Form} from 'react-bootstrap';
import {QuestionCircleFill} from "react-bootstrap-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {SOURCE_TYPE} from "../../../../config/constants";

export default class SourceType extends React.Component {
    render() {
        return (
            //Source Type
            <>
                <Form.Group className="mb-3" controlId="source_type">
                    <Form.Label>Source Type <span
                        className="required">* </span>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Popover>
                                    <Popover.Body>
                                        Source type
                                    </Popover.Body>
                                </Popover>
                            }
                        >
                            <QuestionCircleFill/>
                        </OverlayTrigger>
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