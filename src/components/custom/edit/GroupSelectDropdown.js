import React from 'react';
import {Dropdown} from 'react-bootstrap'

const GroupSelectDropdown = ({isHidden, groups, onSelectGroup}) => {
    return (
        <Dropdown
            onSelect={(e)=>onSelectGroup(e)}
            hidden={isHidden}>
            <Dropdown.Toggle
                variant="outline-success rounded-0"
                id="group-uuid-select">
                Groups
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {
                    groups.map(
                        (group) => {
                            return <Dropdown.Item
                                key={group.uuid}
                                eventKey={group.uuid}>
                                {group.displayname}
                            </Dropdown.Item>
                        })
                }
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default GroupSelectDropdown;