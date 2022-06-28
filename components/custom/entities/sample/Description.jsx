import React from 'react';
import {Table} from 'react-bootstrap';

export default class Description extends React.Component {
    render() {
        return (
            <li className="sui-result">
                <div className="card-body">
                    <Table borderless>
                        <thead>
                        <tr>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{this.props.data.description}</td>
                        </tr>
                        </tbody>
                    </Table>
                    <Table borderless>
                        <thead>
                        <tr>
                            <th>Creation Date</th>
                            <th>Modification Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).format(this.props.data.created_timestamp)}</td>
                            <td>{new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).format(this.props.data.last_modified_timestamp)}</td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
            </li>
        )
    }
}