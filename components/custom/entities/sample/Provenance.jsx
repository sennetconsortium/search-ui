import React from 'react';
import {Container, Row, Col, Card, Tab, Tabs} from 'react-bootstrap';
import {PersonFill} from 'react-bootstrap-icons';
import styles from '../../style.module.css'
import ProvenanceSample from "./ProvenanceSample";

export default class Provenance extends React.Component {
    render() {
        let source_count = 0;
        return (
            <li className="sui-result">
                <div className="sui-result__header" id="Provenance">
                    <span className="sui-result__title">Provenance</span>
                </div>
                <div className="card-body">
                    <Tabs
                        defaultActiveKey="table"
                        transition={false}
                        id="provenance-tab"
                    >
                        <Tab eventKey="table" title="Table">
                            <Container className="mt-3">
                                <Row>
                                    <Col>
                                        <h4>Sources</h4>
                                        {/*TODO: Need to change Donor to Source and will most likely need to change ancestors to descendants*/}
                                        {this.props.data.ancestors.map((ancestor_data, index) => {
                                            if (ancestor_data.entity_type === 'Donor') {
                                                return (
                                                    // TODO: need to update the href
                                                    <a key={"source_" + index} className={styles.card_link} href="#">
                                                        <Card>
                                                            <Card.Body>
                                                                <Card.Subtitle><PersonFill/> {ancestor_data.hubmap_id}
                                                                </Card.Subtitle>
                                                                <Card.Text className={styles.provenance_text}>
                                                                    {ancestor_data.mapped_metadata.sex} | {ancestor_data.mapped_metadata.age_value} {ancestor_data.mapped_metadata.age_unit}
                                                                    <br></br>
                                                                    {ancestor_data.mapped_metadata.race.join(", ")}
                                                                </Card.Text>
                                                            </Card.Body>
                                                            {/*TODO: Need to add additional info to footer*/}
                                                            <Card.Footer
                                                                className={`text-muted ${styles.provenance_subtext}`}>
                                                                Modified {ancestor_data.mapped_last_modified_timestamp.substring(0, 10)}
                                                            </Card.Footer>
                                                        </Card>
                                                    </a>
                                                )
                                            }
                                        })}

                                    </Col>
                                    <Col>
                                        <h4>Samples</h4>
                                        {this.props.data.ancestors.map((ancestor_data) => {
                                            if (ancestor_data.entity_type == 'Sample') {
                                                {
                                                    source_count++
                                                }
                                                return (
                                                    <ProvenanceSample key={"sample_" + source_count}
                                                                      ancestor_data={ancestor_data}
                                                                      data={this.props.data}
                                                                      source_count={source_count}/>
                                                )
                                            }
                                        })}
                                        <ProvenanceSample key={"sample_" + source_count} ancestor_data={this.props.data}
                                                          data={this.props.data}
                                                          source_count={source_count} bg="light"/>

                                    </Col>
                                    <Col>
                                        <h4>Datasets</h4>
                                    </Col>
                                </Row>

                            </Container>
                        </Tab>
                        <Tab eventKey="graph" title="Graph">
                        </Tab>
                    </Tabs>
                </div>
            </li>
        )
    }
}