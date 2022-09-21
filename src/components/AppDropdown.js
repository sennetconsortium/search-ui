import React from 'react';
import {Dropdown} from 'react-bootstrap'

const AppDropdown = ({isHidden, groups}) => {
    return (
        <>
            <Dropdown
                hidden={isHidden}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Groups
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                        groups.map(
                            (group) => {
                                <Dropdown.Item href="#/action-1">{group.name}</Dropdown.Item>
                            })
                    }
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export default AppDropdown;