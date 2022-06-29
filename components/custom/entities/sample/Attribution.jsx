import React from 'react';
import {Table} from 'react-bootstrap';
import {EnvelopeFill} from "react-bootstrap-icons";

export default class Attribution extends React.Component {
    render() {
        return (
            <li className="sui-result">
                <div className="sui-result__header" id="Attribution">
                    <span className="sui-result__title">Attribution</span>
                </div>
                <div className="card-body">
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
                                <a href={`mailto:${this.props.data.created_by_user_email}`}>{this.props.data.created_by_user_email} <EnvelopeFill/></a>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
            </li>
        )
    }
}