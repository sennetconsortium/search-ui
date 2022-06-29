import React from 'react';
import {Card} from 'react-bootstrap';
import {Activity, CaretDownFill} from 'react-bootstrap-icons';
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
                                {/*TODO: What is the correct what to get organ (see 8b09621e0749c27758b3a4e208488181)*/}
                                {this.props.ancestor_data.mapped_organ}
                                <br></br>
                                {this.props.ancestor_data.mapped_specimen_type}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer
                            className={`text-muted ${styles.provenance_subtext}`}>
                            Modified {this.props.ancestor_data.mapped_last_modified_timestamp.substring(0, 10)}
                        </Card.Footer>
                    </Card>
                </a>
            </div>
        )
    }
};