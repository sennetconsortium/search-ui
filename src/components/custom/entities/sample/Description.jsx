import React from 'react';
import {Table} from 'react-bootstrap';

export default class Description extends React.Component {
    render() {
        return (
            <li className="sui-result" id="Summary">
                <div className="card-body">
                    {this.props.data.description &&
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
                    }
                    <Table borderless>
                        <thead>
                        <tr>
                            {this.props.primaryDate &&
                                <th>{this.props.primaryDateTitle}</th>
                            }
                            {this.props.secondaryDate &&
                                <th>{this.props.secondaryDateTitle}</th>
                            }
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            {this.props.primaryDate &&
                                <td>{new Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }).format(this.props.primaryDate)}</td>
                            }
                            {this.props.secondaryDate &&
                                <td>{new Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }).format(this.props.secondaryDate)}</td>
                            }
                        </tr>
                        </tbody>
                    </Table>
                </div>
            </li>
        )
    }
}