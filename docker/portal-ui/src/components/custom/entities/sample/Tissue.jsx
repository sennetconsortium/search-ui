import React from 'react';
import {Table} from 'react-bootstrap';

export default class Tissue extends React.Component {
    render() {
        return (
            <li className="sui-result">
                <div className="sui-result__header" id="Tissue">
                    <span className="sui-result__title">Tissue</span>
                </div>
                <div className="card-body">
                    <Table borderless>
                        <thead>
                        <tr>
                            <th>Organ Type</th>
                            <th>Specimen Type</th>
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
                            <td>{this.props.data.mapped_specimen_type}</td>
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