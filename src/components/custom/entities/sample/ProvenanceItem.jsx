import React from 'react';
import {Card} from 'react-bootstrap';
import {Activity, CaretDownFill, PersonFill, Table} from 'react-bootstrap-icons';
import styles from '../../style.module.css'
import {fetchEntity} from "../../js/functions";

export default class ProvenanceItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ancestor_data: null
        };
    }

    async componentDidMount() {
        await fetchEntity(this.props.ancestor_uuid).then((data) => {
            this.setState({ancestor_data: data})
        });
    }

    render() {
        return (
            <>
                {this.state.ancestor_data != null &&
                    <div>
                        {this.props.entity_count > 0 &&
                            <div className="d-flex justify-content-center fs-2 my-3">
                                <CaretDownFill/>
                            </div>
                        }
                        <a className={styles.card_link} href="#">
                            <Card bg={this.props.bg}>
                                <Card.Body>
                                    <Card.Subtitle className="link_with_icon">
                                        {(() => {
                                            if (this.state.ancestor_data.entity_type === 'Source') {
                                                return (
                                                    <PersonFill/>
                                                )
                                            } else if (this.state.ancestor_data.entity_type === 'Sample') {
                                                return (
                                                    <Activity/>
                                                )
                                            } else if (this.state.ancestor_data.entity_type === 'Dataset') {
                                                return (
                                                    <Table/>
                                                )
                                            }
                                        })()}
                                        <span className="ms-1">{this.state.ancestor_data.sennet_id}</span>
                                    </Card.Subtitle>
                                    <Card.Text className={styles.provenance_text}>
                                        {(() => {
                                            if (this.state.ancestor_data.entity_type === 'Source' && this.state.ancestor_data.mapped_metadata) {
                                                return (
                                                    <>
                                                        {this.state.ancestor_data.mapped_metadata.sex} | {this.state.ancestor_data.mapped_metadata.age_value} {this.state.ancestor_data.mapped_metadata.age_unit}
                                                        <br></br>
                                                        {this.state.ancestor_data.mapped_metadata.race.join(", ")}

                                                    </>
                                                )
                                            } else if (this.state.ancestor_data.entity_type === 'Sample') {
                                                return (
                                                    <>
                                                        {this.state.ancestor_data.origin_sample.mapped_organ}
                                                        <br></br>
                                                        {this.state.ancestor_data.mapped_specimen_type}
                                                    </>
                                                )
                                            } else if (this.state.ancestor_data.entity_type === 'Dataset') {
                                                return (
                                                    <>
                                                        {this.state.ancestor_data.origin_sample.mapped_organ}
                                                        <br></br>
                                                        {this.state.ancestor_data.data_types[0]}

                                                    </>
                                                )
                                            } else {
                                                return (
                                                    <></>
                                                )
                                            }
                                        })()}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer
                                    className={`text-muted ${styles.provenance_subtext}`}>
                                    <div className="d-flex justify-content-between"
                                         style={{display: 'inline-block'}}>
                                        {this.state.ancestor_data.descendant_counts &&
                                            <>
                                                <div>
                                                    <Activity/> {this.state.ancestor_data.descendant_counts?.entity_type?.Sample || 0}
                                                </div>
                                                <div>
                                                    <Table/> {this.state.ancestor_data.descendant_counts?.entity_type?.Dataset || 0}
                                                </div>
                                            </>
                                        }
                                        <div>
                                            Modified {new Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        }).format(this.state.ancestor_data.last_modified_timestamp)}
                                        </div>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </a>
                    </div>
                }
            </>
        )
    }
};