import React from 'react';
import {Table} from 'react-bootstrap';

export default class AncestorInformationBox extends React.Component {
    render() {
        return (
            <li className="sui-result mb-3 has-table" id="Ancestor">
                <div className="sui-result__header">
                    <span className="sui-result__title">Ancestor</span>
                </div>
                <div className="card-body">
                    <Table borderless>
                        <thead>
                        <tr>
                            <th><a
                                href={'/' + this.props.ancestor.entity_type.toLowerCase() + '?uuid=' + this.props.ancestor.uuid}
                                className="icon_inline">{this.props.ancestor.sennet_id}</a></th>
                        </tr>
                        <tr>
                            <th>Ancestor Type</th>
                            {this.props.ancestor.lab_source_id &&
                                <th>Lab ID</th>
                            }
                            {this.props.ancestor.source_type &&
                                <th>Source Type</th>
                            }
                            {this.props.ancestor.sample_category &&
                                <th>Sample Category</th>
                            }
                            {this.props.ancestor.organ &&
                                <th>Organ Type</th>
                            }
                            {this.props.ancestor.group_name &&
                                <th>Group Name</th>
                            }
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{this.props.ancestor.entity_type}</td>
                            {this.props.ancestor.lab_source_id &&
                                <td>{this.props.ancestor.lab_source_id}</td>
                            }
                            {this.props.ancestor.source_type &&
                                <td>{this.props.ancestor.source_type}</td>
                            }
                            {this.props.ancestor.sample_category &&
                                <td>{this.props.ancestor.sample_category}</td>
                            }
                            {this.props.ancestor.organ &&
                                <td>{this.props.ancestor.display_subtype}</td>
                            }
                            {this.props.ancestor.group_name &&
                                <td>{this.props.ancestor.group_name}</td>
                            }
                        </tr>
                        </tbody>
                    </Table>

                    {this.props.ancestor.description &&
                        <Table borderless>
                            <thead>
                            <tr>
                                <th>Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{this.props.ancestor.description}</td>
                            </tr>
                            </tbody>
                        </Table>
                    }
                </div>
            </li>
        )
    }
}