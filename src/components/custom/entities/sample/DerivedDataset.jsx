import React from 'react';
import {Container, Tab, Table, Tabs} from 'react-bootstrap';
import DerivedDatasetItem from "./DerivedDatasetItem";

const DerivedDataset = ({includeSample, data}) => {

    return (
        <li className="sui-result" id="Derived-Datasets">
            <div className="sui-result__header">
                <span
                    className="sui-result__title">{includeSample ? "Derived" : "Derived Datasets"}</span>
                <div>
                    {includeSample &&
                        <span>{data.descendant_counts.entity_type.Sample} Sample(s) | </span>
                    }
                    <span>{data.descendant_counts.entity_type.Dataset} Dataset(s)</span>
                </div>
            </div>
            <div className="card-body">
                <Tabs
                    defaultActiveKey={includeSample ? "samples" : "datasets"}
                    transition={false}
                    id="datasets-tab"
                >
                    {/*Samples section specifically for Source*/}
                    {includeSample &&
                        <Tab eventKey="samples" title="Samples">
                            <Container className={`mt-3 table--derivedDataset`}>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>SenNet ID</th>
                                        <th>Organ</th>
                                        <th>Sample Category</th>
                                        <th>Derived Dataset Count</th>
                                        <th>Last Modified</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {data.descendants.map((descendant_data, index) => {
                                        if (descendant_data.entity_type === 'Sample') {
                                            return (
                                                <React.Fragment key={index}>
                                                    <DerivedDatasetItem index={index} data={data}
                                                                        data_type="Sample"
                                                                        descendant_uuid={descendant_data.uuid}/>
                                                </React.Fragment>
                                            )
                                        }
                                    })}
                                    </tbody>
                                </Table>
                            </Container>
                        </Tab>
                    }

                    <Tab eventKey="datasets" title="Datasets">
                        <Container className={`mt-3 table--derivedDataset`}>
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
                                {data.descendants.map((descendant_data, index) => {
                                    if (descendant_data.entity_type === 'Dataset') {
                                        return (
                                            <React.Fragment key={index}>
                                                <DerivedDatasetItem index={index} data={data}
                                                                    data_type="Dataset"
                                                                    descendant_uuid={descendant_data.uuid}/>
                                            </React.Fragment>
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

export default DerivedDataset