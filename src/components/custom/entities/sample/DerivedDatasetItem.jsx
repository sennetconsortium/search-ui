import React from 'react';
import {fetchEntity, getStatusColor} from "../../js/functions";
import {BoxArrowUpRight} from "react-bootstrap-icons";
import Badge from 'react-bootstrap/Badge';

export default class DerivedDatasetItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            descendant_data: null
        };
    }

    async componentDidMount() {
        await fetchEntity(this.props.descendant_uuid).then((data) => {
            this.setState({descendant_data: data})
        });
    }

    render() {
        return (
            <>
                {this.state.descendant_data != null &&
                    <tr key={"descendant_data_" + this.props.index}>
                        <td>
                            <a href={`/dataset?uuid=${this.state.descendant_data.uuid}`} className="link_with_icon">
                                <span className="me-1">{this.state.descendant_data.hubmap_id}</span> <BoxArrowUpRight/>
                            </a>
                        </td>
                        {(() => {
                            if (this.props.data_type === 'Dataset') {
                                return (
                                    <>
                                        <td>
                                            {Array.isArray(this.state.descendant_data.data_types) ?
                                                this.state.descendant_data.data_types.join(', ') : this.state.descendant_data.data_types}
                                        </td>
                                        <td>
                                            <Badge pill bg={getStatusColor(this.state.descendant_data.status)}>
                                                {this.state.descendant_data.status}
                                            </Badge>
                                        </td>
                                    </>
                                )
                            } else if (this.props.data_type === 'Sample') {
                                return (
                                    <>
                                        <td>{this.state.descendant_data.origin_sample.mapped_organ}</td>
                                        <td>{this.state.descendant_data.mapped_specimen_type}</td>
                                    </>
                                )
                            }
                        })()}

                        <td>{this.state.descendant_data.descendant_counts?.entity_type?.Dataset || 0}</td>
                        <td>{new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }).format(this.state.descendant_data.last_modified_timestamp)}</td>
                    </tr>
                }
            </>
        )
    }
};
