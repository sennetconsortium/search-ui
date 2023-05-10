import React from 'react';
import {Table} from 'react-bootstrap';
import {EnvelopeFill} from "react-bootstrap-icons";
import SenNetAccordion from "../../layout/SenNetAccordion";

export default class Attribution extends React.Component {
    render() {
        return (
            <SenNetAccordion title={'Attribution'}>
                <Table borderless>
                    <thead>
                    <tr>
                        <th>Group</th>
                        <th>Registered by</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{this.props.data.group_name}</td>
                        <td>
                            {this.props.data.created_by_user_displayname}
                            <br></br>
                            <a href={`mailto:${this.props.data.created_by_user_email}`}
                               className="icon_inline"><span
                                className="me-1">{this.props.data.created_by_user_email}</span>
                                <EnvelopeFill/></a>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </SenNetAccordion>
        )
    }
}