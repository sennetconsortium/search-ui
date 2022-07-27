import React from 'react';
import {Container, Tab, Table, Tabs} from 'react-bootstrap';
import DerivedDatasetItem from "./DerivedDatasetItem";
import styles from "../../style.module.css";

export default class DerivedDataset extends React.Component {
    render() {
        return (
            <li className="sui-result">
                <div className="sui-result__header" id="Derived-Datasets">
                    <span
                        className="sui-result__title">{this.props.includeSample ? "Derived" : "Derived Datasets"}</span>
                    <div>
                        {this.props.includeSample &&
                            <span>{this.props.data.descendant_counts.entity_type.Sample} Sample(s) | </span>
                        }
                        <span>{this.props.data.descendant_counts.entity_type.Dataset} Datset(s)</span>
                    </div>
                </div>
                <div className="card-body">
                    <Tabs
                        defaultActiveKey={this.props.includeSample ? "samples" : "datasets"}
                        transition={false}
                        id="datasets-tab"
                    >
                        {/*Samples section specifically for Source*/}
                        {this.props.includeSample &&
                            <Tab eventKey="samples" title="Samples">
                                <Container className={`mt-3 ${styles.table_wrapper}`}>
                                    <Table>
                                        <thead>
                                        <tr>
                                            <th>SenNet ID</th>
                                            <th>Organ</th>
                                            <th>Specimen</th>
                                            <th>Derived Dataset Count</th>
                                            <th>Last Modified</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.props.data.descendants.map((descendant_data, index) => {
                                            if (descendant_data.entity_type == 'Sample') {
                                                return (
                                                    <DerivedDatasetItem index={index} data={this.props.data}
                                                                        descendant_uuid={descendant_data.uuid}/>
                                                )
                                            }
                                        })}
                                        </tbody>
                                    </Table>
                                </Container>
                            </Tab>
                        }

                        <Tab eventKey="datasets" title="Datasets">
                            <Container className={`mt-3 ${styles.table_wrapper}`}>
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
                                    {this.props.data.descendants.map((descendant_data, index) => {
                                        if (descendant_data.entity_type == 'Dataset') {
                                            return (
                                                <DerivedDatasetItem index={index} data={this.props.data}
                                                                    descendant_uuid={descendant_data.uuid}/>
                                            )
                                        }
                                    })}
                                    </tbody>
                                </Table>
                            </Container>
                        </Tab>
                    </Tabs>
                </div>
            </li>
        )
    }
}