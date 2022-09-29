import React from 'react';
import {Table} from 'react-bootstrap';
import {getStatusColor} from "../../js/functions";
import Badge from 'react-bootstrap/Badge';

export default class AncestorInformationBox extends React.Component {
    render() {
        console.log(this.props.ancestor)
        if (this.props.ancestor instanceof Array) {
            return (
                <li className="sui-result">
                    <div className="sui-result__header" id="SourceInformationBox">
                        <span className="sui-result__title">Ancestors</span>
                    </div>

                    <div className="card-body">
                        <Table borderless>
                            <thead>
                            <tr>
                                <th>SenNet ID</th>
                                <th>Subtype</th>
                                <th>Group Name</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.props.ancestor.map((ancestor_data, index) => {
                                return (
                                    <tr key={ancestor_data.uuid}>
                                        <td><a
                                            href={'/' + ancestor_data.entity_type.toLowerCase() + '?uuid=' + ancestor_data.uuid}
                                            className="link_with_icon">{ancestor_data.sennet_id}</a></td>
                                        <td>{ancestor_data?.display_subtype}</td>
                                        <td>{ancestor_data.group_name}</td>
                                        <td><Badge pill
                                                   bg={getStatusColor(ancestor_data?.status)}>{ancestor_data?.status}</Badge>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>

                        {/*{this.props.ancestor.description &&*/}
                        {/*    <Table borderless>*/}
                        {/*        <thead>*/}
                        {/*        <tr>*/}
                        {/*            <th>Description</th>*/}
                        {/*        </tr>*/}
                        {/*        </thead>*/}
                        {/*        <tbody>*/}
                        {/*        <tr>*/}
                        {/*            <td>{this.props.ancestor.description}</td>*/}
                        {/*        </tr>*/}
                        {/*        </tbody>*/}
                        {/*    </Table>*/}
                        {/*}*/}
                    </div>
                </li>
            )
        } else {
            return (
                <li className="sui-result">
                    <div className="sui-result__header" id="SourceInformationBox">
                        <span className="sui-result__title">Ancestor</span>
                    </div>


                    <div className="card-body">
                        <a href={'/' + this.props.ancestor.entity_type.toLowerCase() + '?uuid=' + this.props.ancestor.uuid}
                           className="link_with_icon">{this.props.ancestor.sennet_id}</a>

                        <Table borderless>
                            <thead>
                            <tr>
                                <th>Ancestor Type</th>
                                {this.props.ancestor.mapped_organ &&
                                    <th>Organ Type</th>
                                }
                                {this.props.ancestor.lab_source_id &&
                                    <th>Lab ID</th>
                                }
                                {this.props.ancestor.source_type &&
                                    <th>Source Type</th>
                                }
                                {this.props.ancestor.sample_category &&
                                    <th>Sample Category</th>
                                }
                                {this.props.ancestor.group_name &&
                                    <th>Group Name</th>
                                }
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{this.props.ancestor.entity_type}</td>
                                {this.props.ancestor.mapped_organ &&
                                    <td>{this.props.ancestor.mapped_organ}</td>
                                }
                                {this.props.ancestor.lab_source_id &&
                                    <td>{this.props.ancestor.lab_source_id}</td>
                                }
                                {this.props.ancestor.source_type &&
                                    <td>{this.props.ancestor.source_type}</td>
                                }
                                {this.props.ancestor.sample_category &&
                                    <td>{this.props.ancestor.sample_category}</td>
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
}