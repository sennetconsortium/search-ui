import React from 'react';
import {Card} from 'react-bootstrap';
import {Activity, CaretDownFill, Table} from 'react-bootstrap-icons';
import styles from '../../style.module.css'

export default class ProvenanceSample extends React.Component {
    render() {
        return (
            <div>
                {this.props.source_count > 1 &&
                    <div className="d-flex justify-content-center fs-2 my-3">
                        <CaretDownFill/>
                    </div>
                }
                <a className={styles.card_link} href="#">
                    <Card bg={this.props.bg}>
                        <Card.Body>
                            <Card.Subtitle><Activity/> {this.props.ancestor_data.hubmap_id}
                            </Card.Subtitle>
                            <Card.Text className={styles.provenance_text}>
                                {this.props.data.origin_sample.mapped_organ}
                                <br></br>
                                {this.props.ancestor_data.mapped_specimen_type}
                            </Card.Text>
                        </Card.Body>
                        {/*TODO: For each ancestor_data.uuid we need to get the json and then display the descendant_counts for each entity type*/}
                        <Card.Footer
                            className={`text-muted ${styles.provenance_subtext}`}>
                            <div className="d-flex justify-content-between" style={{display: 'inline-block'}}>
                                {this.props.ancestor_data.descendant_counts &&
                                    <>
                                        <div>
                                            <Activity/> {this.props.ancestor_data.descendant_counts?.entity_type?.Sample || 0}
                                        </div>
                                        <div>
                                            <Table/> {this.props.ancestor_data.descendant_counts?.entity_type?.Dataset || 0}
                                        </div>
                                    </>
                                }
                                <div>
                                    Modified {this.props.ancestor_data.mapped_last_modified_timestamp.substring(0, 10)}
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                </a>
            </div>
        )
    }
};