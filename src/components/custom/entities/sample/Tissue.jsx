import React from 'react';
import {Table} from 'react-bootstrap';

export default class Tissue extends React.Component {
    render() {
        return (
            <li className="sui-result" id="Tissue">
                <div className="sui-result__header">
                    <span className="sui-result__title">Tissue</span>
                </div>
                <div className="card-body">
                    <Table borderless>
                        <thead>
                        <tr>
                            <th>Organ Type</th>
                            <th>Sample Category</th>
                            {this.props.data.rui_location &&
                                <th>Tissue Location</th>
                            }
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                {/*Have to do this due to how react processes embedded objects*/}
                                {this.props.data.origin_sample &&
                                    <span>
                                        {this.props.data.origin_sample.mapped_organ}
                                    </span>
                                }
                            </td>
                            <td>{this.props.data.sample_category}</td>
                            {this.props.data.rui_location &&
                                <td>{this.props.data.rui_location}</td>
                            }
                        </tr>
                        </tbody>
                    </Table>
                </div>
            </li>
        )
    }
}