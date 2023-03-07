import React from 'react';
import {Table} from 'react-bootstrap';
import {EnvelopeFill} from "react-bootstrap-icons";

export default class Attribution extends React.Component {
    render() {
        return (
            <div className="accordion accordion-flush sui-result" id="Attribution">
                <div className="accordion-item ">
                    <div className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#attribution-collapse" aria-expanded="true"
                                aria-controls="attribution-collapse">Attribution

                        </button>
                    </div>
                    <div id="attribution-collapse" className="accordion-collapse collapse show">
                        <div className="accordion-body">
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
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}