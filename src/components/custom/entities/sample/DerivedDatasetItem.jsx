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
                            <a href={`/dataset?uuid=${this.state.descendant_data.uuid}`} className="icon_inline">
                                <span className="me-1">{this.state.descendant_data.sennet_id}</span> <BoxArrowUpRight/>
                            </a>
                        </td>
                        {(() => {
                            if (this.props.data_type === 'Dataset') {
                                return (
                                    <>
                                        <td>
                                            {this.state.descendant_data.dataset_type}
                                        </td>
                                        <td>
                                            <span className={`${getStatusColor(this.state.descendant_data.status)} badge`}>
                                                {this.state.descendant_data.status}
                                            </span>
                                        </td>
                                    </>
                                )
                            } else if (this.props.data_type === 'Sample') {
                                return (
                                    <>
                                        <td>{this.state.descendant_data.organ}</td>
                                        <td>{this.state.descendant_data.sample_category}</td>
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
