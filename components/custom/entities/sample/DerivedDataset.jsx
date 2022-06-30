import React from 'react';
import {Table} from 'react-bootstrap';

export default class DerivedDataset extends React.Component {
    render() {
        return (
            <li className="sui-result">
                <div className="sui-result__header" id="Derived-Datasets">
                    <span className="sui-result__title">Derived Datasets</span>
                    <span>{this.props.data.descendant_counts.entity_type.Dataset} Datset(s)</span>
                </div>
                <div className="card-body">
                    <Table>
                        <thead>
                        <tr>
                            <th>SenNet ID</th>
                            <th>Data Types</th>
                            <th>Status</th>
                            <th>Derived Dataset Count</th>
                            <th>Last Modified</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/*TODO: Need to replace hubmap with sennet, also this might be ancestor instead of descendant*/}
                        {/*TODO: Need to make the id a hyperlink*/}
                        {this.props.data.descendants.map((descendant_data, index) => {
                            if (descendant_data.entity_type == 'Dataset') {
                                return (
                                    <tr key={"descendant_data_" + index}>
                                        <td>{descendant_data.hubmap_id}</td>
                                        <td>
                                            {descendant_data.data_types.map(function (data_type, i) {
                                                return (
                                                    <span key={i}>
                                                                            {data_type}
                                                        {(i > 0) &&
                                                            <span>,</span>
                                                        }
                                                                        </span>
                                                )
                                            })}
                                        </td>
                                        <td>{descendant_data.status}</td>
                                        {/*TODO: Need to figure out where derived dataset count comes from*/}
                                        <td>{this.props.data.descendant_counts?.entity_type?.Dataset || 0}</td>
                                        <td>{new Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        }).format(descendant_data.last_modified_timestamp)}</td>
                                    </tr>
                                )
                            }
                        })}
                        </tbody>
                    </Table>
                </div>
            </li>
        )
    }
}