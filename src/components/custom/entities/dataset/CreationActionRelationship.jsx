import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import SenNetAccordion from "../../layout/SenNetAccordion";
import Lineage from "../sample/Lineage";
import {datasetIs, getCreationActionRelationName} from "../../js/functions";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
function CreationActionRelationship({ data }) {
    const [datasetCategories, setDatasetCategories] = useState({primary: [], component: [], processed: []})

    useEffect(() => {
        let component = []
        let primary = []
        let processed = []
        let mergedData = data.ancestors.concat(data.descendants)
        mergedData.push(data)
        for (let entity of mergedData) {
            if (datasetIs.component(entity.creation_action || '')) {
                component.push(entity)
            }
            if (datasetIs.processed(entity.creation_action || '')) {
                processed.push(entity)
            }
            if (datasetIs.primary(entity.creation_action || '')) {
                primary.push(entity)
            }
        }
        setDatasetCategories({component, processed, primary})
    }, [])

    const relationshipNames = {
        component: 'Component Dataset (Raw)',
        processed: 'Primary Dataset (Processed)',
        primary: 'Primary Dataset (Raw)'
    }

    const getDefaultTab = () => {
        const category = getCreationActionRelationName(data.creation_action)
        return category.replace(' Dataset', '').toLowerCase()
    }
    return (
        <>
            <SenNetAccordion title={'Multi-Assay Relationship'} id={'multi-assay-relationship'}>
                <p>This dataset is a component of a multi-assay dataset and the relationships between datasets are displayed below.</p>

                <Tabs
                    defaultActiveKey={getDefaultTab()}
                    className="mb-3"
                    variant="pills"
                >
                {datasetCategories.primary.length > 0 &&
                    <Tab eventKey="primary" title={relationshipNames.primary}>
                        <Lineage lineage={datasetCategories.primary}/>
                    </Tab>
                }
                {datasetCategories.component.length > 0 &&
                    <Tab eventKey="component" title={relationshipNames.component}>
                        <Lineage lineage={datasetCategories.component} />
                    </Tab>
                }
                {datasetCategories.processed.length > 0 &&
                    <Tab eventKey="processed" title={relationshipNames.processed}>
                        <Lineage lineage={datasetCategories.processed}/>
                    </Tab>
                }
                </Tabs>
            </SenNetAccordion>
        </>
    )
}

CreationActionRelationship.defaultProps = {}

CreationActionRelationship.propTypes = {
    children: PropTypes.node
}

export default CreationActionRelationship