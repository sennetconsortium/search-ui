import React, {useState} from 'react';
import {Dropdown} from 'react-bootstrap'

const AppDropdown = ({isHidden, groups}) => {
    const [group, setGroup] = useState('')
    return (
        <>
            <Dropdown
                onSelect={(e) => setGroup(e)}
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
                                    eventKey={group.name}>
                                    {group.name}
                                </Dropdown.Item>
                            })
                    }
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export default AppDropdown;