import React, {useContext, useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import 'bootstrap/dist/css/bootstrap.css'
import {Button, Form} from 'react-bootstrap'
import {Layout} from '@elastic/react-search-ui-views'
import '@elastic/react-search-ui-views/lib/styles/styles.css'
import {QuestionCircleFill} from 'react-bootstrap-icons'
import log from 'loglevel'
import {get_headers, update_create_dataset} from '../../lib/services'
import {cleanJson, equals, fetchEntity, getHeaders, getRequestHeaders} from '../../components/custom/js/functions'
import AppNavbar from '../../components/custom/layout/AppNavbar'
import DataTypes from '../../components/custom/edit/dataset/DataTypes'
import AncestorIds from '../../components/custom/edit/dataset/AncestorIds'
import Unauthorized from '../../components/custom/layout/Unauthorized'
import AppFooter from '../../components/custom/layout/AppFooter'
import GroupSelect from '../../components/custom/edit/GroupSelect'
import Header from '../../components/custom/layout/Header'

import AppContext from '../../context/AppContext'
import EntityContext, {EntityProvider} from '../../context/EntityContext'
import Spinner from '../../components/custom/Spinner'
import EntityHeader from '../../components/custom/layout/entity/Header'
import EntityFormGroup from '../../components/custom/layout/entity/FormGroup'
import Alert from 'react-bootstrap/Alert';
import {getEntityEndPoint, getIngestEndPoint, valid_dataset_ancestor_config} from "../../config/config";
import MetadataUpload from "../../components/custom/edit/MetadataUpload";
import $ from 'jquery'
import SenNetPopover from "../../components/SenNetPopover"

export default function EditDataset() {
    const {
        isUnauthorized, isAuthorizing, getModal, setModalDetails, setSubmissionModal,
        data, setData,
        error, setError,
        values, setValues,
        errorMessage, setErrorMessage,
        validated, setValidated,
        userWriteGroups, onChange,
        editMode, setEditMode, isEditMode,
        showModal,
        selectedUserWriteGroupUuid,
        disableSubmit, setDisableSubmit,
        metadata, setMetadata,
        getEntityConstraints,
        getSampleEntityConstraints,
        buildConstraint
    } = useContext(EntityContext)
    const {_t, cache} = useContext(AppContext)
    const router = useRouter()
    const [ancestors, setAncestors] = useState(null)
    const [containsHumanGeneticSequences, setContainsHumanGeneticSequences] = useState(null)
    const [dataTypes, setDataTypes] = useState(null)

    useEffect(() => {
        async function fetchAncestorConstraints() {
            const fullBody = [
                {
                    descendants: [{
                        entity_type: cache.entities.dataset
                    }]
                }
            ]

            const response = await getEntityConstraints(fullBody, {order: 'descendants', filter: 'search'})
            if (response.ok) {
                const body = await response.json()
                valid_dataset_ancestor_config['searchQuery']['includeFilters'] = body.description[0].description
            }
        }

        fetchAncestorConstraints()
    }, [])

    useEffect(() => {
        const fetchDataTypes = async () => {
            setDataTypes(null)
            if (ancestors !== null && ancestors.length !== 0) {
                let constraints = []
                for (let ancestor of ancestors) {
                    constraints = buildConstraint(ancestor, constraints)
                }
                const response = await getEntityConstraints(constraints)
                let constraintsDataTypes = {}
                if (response.ok) {
                    const body = await response.json()
                    for (let constraintResponse of body.description) {
                        let currentConstraints = constraintResponse.description

                        let sub_types = []
                        currentConstraints.forEach(constraint => {
                            if (equals(constraint.entity_type, cache.entities.dataset)) {
                                sub_types = sub_types.concat(constraint.sub_type || [])
                            }
                        })
                        if (sub_types.length) {
                            const filter = Object.entries(cache.dataTypes).filter(data_type => sub_types.includes(data_type[0]));
                            let data_types = {}
                            filter.forEach(entry => data_types[entry[0]] = entry[1])
                            // TODO: Ensure that selected ancestors can have same descendants to avoid extending mutually exclusive ancestor datatypes (only on update of entity-api constraints)
                            $.extend(constraintsDataTypes, data_types)
                        }
                    } // end for
                    if ($.isEmptyObject(constraintsDataTypes)) {
                        setDataTypes(cache.dataTypes)
                    } else {
                        setDataTypes(constraintsDataTypes)
                    }
                }
            }
        }
        fetchDataTypes()
    }, [ancestors])

    // only executed on init rendering, see the []
    useEffect(() => {

        // declare the async data fetching function
        const fetchData = async (uuid) => {
            log.debug('editDataset: getting data...', uuid)
            // get the data from the api
            const response = await fetch("/api/find?uuid=" + uuid, getRequestHeaders());
            // convert the data to json
            const data = await response.json();

            log.debug('editDataset: Got data', data)
            if (data.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(data["error"])
            } else {
                setData(data);

                let immediate_ancestors = []
                if (data.hasOwnProperty("immediate_ancestors")) {
                    for (const ancestor of data.immediate_ancestors) {
                        immediate_ancestors.push(ancestor.uuid)
                    }
                    await fetchAncestors(immediate_ancestors)
                }

                // Set state with default values that will be PUT to Entity API to update
                setValues({
                    'lab_dataset_id': data.lab_dataset_id,
                    'data_types': [data.data_types[0]],
                    'description': data.description,
                    'dataset_info': data.dataset_info,
                    'direct_ancestor_uuids': immediate_ancestors,
                    'contains_human_genetic_sequences': data.contains_human_genetic_sequences,
                    'metadata': data.metadata
                })
                setEditMode("Edit")
            }
        }

        if (router.query.hasOwnProperty("uuid")) {
            if (router.query.uuid === 'create') {
                setData(true)
                setEditMode("Create")
            } else {
                // call the function
                fetchData(router.query.uuid)
                    // make sure to catch any error
                    .catch(console.error);
            }
        } else {
            setData(null);
            setAncestors(null)
        }
    }, [router]);

    async function fetchAncestors(ancestor_uuids) {
        let new_ancestors = []
        if (ancestors) {
            new_ancestors = [...ancestors];
        }

        for (const ancestor_uuid of ancestor_uuids) {
            let ancestor = await fetchEntity(ancestor_uuid);
            if (ancestor.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(ancestor["error"])
            } else {
                new_ancestors.push(ancestor)
            }
        }
        setAncestors(new_ancestors)
    }

    const deleteAncestor = (ancestor_uuid) => {
        const old_ancestors = [...ancestors];
        log.debug(old_ancestors)
        let updated_ancestors = old_ancestors.filter(e => e.uuid !== ancestor_uuid);
        setAncestors(updated_ancestors);
        log.debug(updated_ancestors);
    }
    
    const handleSubmit = async () => {
        const requestOptions = {
            method: 'PUT',
            headers: get_headers(),
            body: JSON.stringify(values)
        }
        const submitDatasetUrl = getIngestEndPoint() + 'datasets/' + data['uuid'] + '/submit'
        const response = await fetch(submitDatasetUrl, requestOptions)
        await response.text().then(json => {
            setSubmissionModal(json)
        })
    }

    const handleSave = async (event) => {
        setDisableSubmit(true);

        const form = $(event.currentTarget.form)[0]
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            log.debug("Form is invalid")
            setDisableSubmit(false);
        } else {

            event.preventDefault();
            if (values['direct_ancestor_uuids'] === undefined || values['direct_ancestor_uuids'].length === 0) {
                event.stopPropagation();
                setDisableSubmit(false);
            } else {

                log.debug("Form is valid")

                if(!_.isEmpty(metadata)) {
                    values["metadata"] = metadata.metadata
                    values["pathname"] = metadata.pathname
                }

                values['contains_human_genetic_sequences'] = containsHumanGeneticSequences
                if (values['group_uuid'] === null && editMode === 'Create') {
                    values['group_uuid'] = selectedUserWriteGroupUuid
                }
                // Remove empty strings
                let json = cleanJson(values);
                let uuid = data.uuid

                await update_create_dataset(uuid, json, editMode, router).then((response) => {
                    setModalDetails({
                        entity: cache.entities.dataset,
                        type: (response.data_types ? response.data_types[0] : null),
                        typeHeader: _t('Data Type'),
                        response
                    })
                }).catch((e) => log.error(e))
            }
        }


        setValidated(true);
    };

    function handleContainsHumanGeneticSequencesYes() {
        setContainsHumanGeneticSequences(true)
    }

    function handleContainsHumanGeneticSequencesNo() {
        setContainsHumanGeneticSequences(false)
    }

    if (isAuthorizing() || isUnauthorized()) {
        return (
            isUnauthorized() ? <Unauthorized/> : <Spinner/>
        )
    } else {

        return (
            <>
                {editMode &&
                    <Header title={`${editMode} Dataset | SenNet`}></Header>
                }

                <AppNavbar/>

                {error &&
                    <Alert variant='warning'>{_t(errorMessage)}</Alert>
                }
                {data && !error &&
                    <div className="no_sidebar">
                        <Layout
                            bodyHeader={
                                <EntityHeader entity={cache.entities.dataset} isEditMode={isEditMode()} data={data}/>
                            }
                            bodyContent={
                                <Form noValidate validated={validated}>
                                    {/*Group select*/}
                                    {
                                        !(userWriteGroups.length === 1 || isEditMode()) &&
                                        <GroupSelect
                                            data={data}
                                            groups={userWriteGroups}
                                            onGroupSelectChange={onChange}
                                            entity_type={'dataset'}/>
                                    }

                                    {/*Ancestor IDs*/}
                                    {/*editMode is only set when page is ready to load */}
                                    {editMode &&
                                        <AncestorIds values={values} ancestors={ancestors} onChange={onChange}
                                                     fetchAncestors={fetchAncestors} deleteAncestor={deleteAncestor}/>
                                    }

                                    {/*/!*Lab Name or ID*!/*/}
                                    <EntityFormGroup label='Lab Name or ID' placeholder='Lab Name or ID'
                                                     controlId='lab_dataset_id' value={data.lab_dataset_id}
                                                     onChange={onChange} text='Lab Name or ID'/>

                                    {/*/!*Description*!/*/}
                                    <EntityFormGroup label='DOI Abstract' type='textarea' controlId='description'
                                                     value={data.description}
                                                     onChange={onChange}
                                                     text='Add information here which can be used to find this data including lab specific (non-PHI) identifiers.'/>

                                    {/*/!*Additional Information*!/*/}
                                    <EntityFormGroup label='Lab Notes' type='textarea'
                                                     controlId='dataset_info' value={data.dataset_info}
                                                     onChange={onChange}
                                                     text={<>Free text field to enter a description of the <code>Dataset</code>.</>} />


                                    {/*/!*Human Gene Sequences*!/*/}
                                    {editMode &&
                                        <Form.Group controlId="contains_human_genetic_sequences" className="mb-3">
                                            <Form.Label>{_t('Human Gene Sequences')} <span
                                                className="required">* </span>
                                                <SenNetPopover className={'contains_human_genetic_sequences'} text={'Does this data contain any human genetic sequences?'}>
                                                    <QuestionCircleFill/>
                                                </SenNetPopover>

                                            </Form.Label>
                                            <div
                                                className="mb-2 text-muted">{_t('Does this data contain any human genetic sequences?')}
                                            </div>
                                            <div hidden={isEditMode() ? true : false}
                                                className="mb-2 text-muted">{_t('This can not be altered after entity has been created.')}
                                            </div>
                                            <Form.Check
                                                required
                                                type="radio"
                                                label="No"
                                                name="contains_human_genetic_sequences"
                                                value={false}
                                                disabled={isEditMode() ? true : false}
                                                defaultChecked={(data.contains_human_genetic_sequences === false && isEditMode()) ? true : false}
                                                onChange={handleContainsHumanGeneticSequencesNo}
                                            />
                                            <Form.Check
                                                required
                                                type="radio"
                                                label="Yes"
                                                name="contains_human_genetic_sequences"
                                                value={true}
                                                disabled={isEditMode() ? true : false}
                                                defaultChecked={data.contains_human_genetic_sequences ? true : false}
                                                onChange={handleContainsHumanGeneticSequencesYes}
                                            />
                                        </Form.Group>
                                    }

                                    {/*/!*Data Types*!/*/}
                                    {editMode &&
                                        <DataTypes data_types={dataTypes === null ? cache.dataTypes : dataTypes}
                                                   values={values} data={data} onChange={onChange}/>
                                    }

                                    {/*<MetadataUpload setMetadata={setMetadata} entity={ENTITIES.dataset} />*/}
                                    
                                    <div className={'d-flex flex-row-reverse'}>
                                        { editMode === 'Edit' && data['status'] === 'New' &&
                                            <SenNetPopover text={'Submit this dataset for processing'} className={'submit-dataset'}>
                                                <Button variant="outline-primary rounded-0 js-btn--submit"
                                                        onClick={handleSubmit}
                                                        disabled={disableSubmit}>
                                                    {_t('Submit')}
                                                </Button>
                                            </SenNetPopover>
                                        }
                                        { data['status'] !== 'Processing' &&
                                            <SenNetPopover text={'Save changes to this dataset'} className={'save-button'}>
                                                <Button variant="outline-primary rounded-0 js-btn--save"
                                                        className={'me-2'}
                                                        onClick={handleSave}
                                                        disabled={disableSubmit}>
                                                    {_t('Save')}
                                                </Button>
                                            </SenNetPopover>
                                        }
                                    </div>
                                    {getModal()}
                                </Form>
                            }
                        />
                    </div>
                }
                {!showModal && <AppFooter/>}
            </>
        )
    }
}

EditDataset.withWrapper = function (page) {
    return <EntityProvider>{page}</EntityProvider>
}
