import React, {useContext} from 'react';
import {QuestionCircleFill} from "react-bootstrap-icons";
import {Form} from 'react-bootstrap';
import SenNetPopover from "../../SenNetPopover";
import AppContext from "../../../context/AppContext";

const GroupSelect = ({groups, onGroupSelectChange, entity_type, plural, popover, value, title = 'Group', controlId='group_uuid', required = true, optionValueProp = 'uuid'}) => {
    const {cache} = useContext(AppContext)
    popover = popover || <>{`You are a member of more than one Globus group and need to pick a group to associate with ${plural ? 'these ' : 'this '}`}
        <code>{cache.entities[entity_type]}</code>.</>
    return (
        <>
            <Form.Group className="mb-3" controlId={controlId}>
                <Form.Label>{title}{required &&<span
                    className="required">*</span>}
                    <SenNetPopover className={'group_uuid'} text={popover}>
                        &nbsp;<QuestionCircleFill/>
                    </SenNetPopover>

                </Form.Label>

                <Form.Select required={required} aria-label="group-select"
                             onChange={e => onGroupSelectChange(e, e.target.id, e.target.value)}>
                    <option value="">----</option>
                    {
                        (groups.sortOnProperty('displayname')).map(group => {
                            return (
                                <option key={group.uuid} value={group[optionValueProp]} selected={group[optionValueProp] === value }>
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