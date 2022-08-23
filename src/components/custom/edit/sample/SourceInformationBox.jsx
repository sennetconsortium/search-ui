import React from 'react';
import {Table} from 'react-bootstrap';


export default class SourceInformationBox extends React.Component {
    render() {
        return (
            <li className="sui-result">
                <div className="sui-result__header" id="SourceInformationBox">
                    <span className="sui-result__title">Ancestor</span>
                </div>

                <div className="card-body">
                    <Table borderless>
                        <thead>
                        <tr>
                            <th>Ancestor Type</th>
                            {this.props.source.mapped_organ &&
                                <th>Organ Type</th>
                            }
                            {this.props.source.submission_id &&
                                <th>Submission ID</th>
                            }
                            {this.props.source.lab_donor_id &&
                                <th>Lab ID</th>
                            }
                            {this.props.source.group_name &&
                                <th>Group Name</th>
                            }
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{this.props.source.entity_type}</td>
                            {this.props.source.mapped_organ &&
                                <td>{this.props.source.mapped_organ}</td>
                            }
                            {this.props.source.submission_id &&
                                <td>{this.props.source.submission_id}</td>
                            }
                            {this.props.source.lab_donor_id &&
                                <td>{this.props.source.lab_donor_id}</td>
                            }
                            {this.props.source.group_name &&
                                <td>{this.props.source.group_name}</td>
                            }
                        </tr>
                        </tbody>
                    </Table>

                    {this.props.source.description &&
                        <Table borderless>
                            <thead>
                            <tr>
                                <th>Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{this.props.source.description}</td>
                            </tr>
                            </tbody>
                        </Table>
                    }
                </div>
            </li>
        )
    }
}