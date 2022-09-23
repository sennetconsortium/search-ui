import React from 'react';
import {QuestionCircleFill} from "react-bootstrap-icons";
import {Form} from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const GroupSelect = ({groups, onGroupSelectChange, entity_type}) => {
    return (
        <>
            <Form.Group className="mb-3" controlId="group_uuid">
                <Form.Label>Group<span
                    className="required">* </span>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Popover>
                                <Popover.Body>
                                    You are a member of more than one Globus group and need to pick a group to associate with this <strong>{entity_type}</strong>
                                </Popover.Body>
                            </Popover>
                        }
                    >
                        <QuestionCircleFill/>
                    </OverlayTrigger>
                </Form.Label>

                <Form.Select required aria-label="group-select"
                             onChange={e => onGroupSelectChange(e, e.target.id, e.target.value)}>
                    <option value="">----</option>
                    {
                        groups.map(group => {
                        return (
                            <option key={group.uuid} value={group.uuid}>
                                {group.displayname}
                            </option>
                        )
                    })}
                </Form.Select>
            </Form.Group>
        </>
    );
};

export default GroupSelect;