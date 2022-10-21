
import {useEffect, useState, useContext} from 'react'
import {useRouter} from 'next/router'
import 'bootstrap/dist/css/bootstrap.css'
import {Button, Form } from 'react-bootstrap'
import {Layout} from '@elastic/react-search-ui-views'
import '@elastic/react-search-ui-views/lib/styles/styles.css'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import {QuestionCircleFill} from 'react-bootstrap-icons'
import log from 'loglevel'
import { update_create_dataset} from '../../lib/services'
import {cleanJson, fetchEntity, getRequestHeaders} from '../../components/custom/js/functions'
import AppNavbar from '../../components/custom/layout/AppNavbar'
import DataTypes from '../../components/custom/edit/dataset/DataTypes'
import AncestorIds from '../../components/custom/edit/dataset/AncestorIds'
import Unauthorized from '../../components/custom/layout/Unauthorized'
import AppFooter from '../../components/custom/layout/AppFooter'
import GroupSelect from '../../components/custom/edit/GroupSelect'
import Header from '../../components/custom/layout/Header'

import AppContext from '../../context/AppContext'
import { EntityProvider } from '../../context/EntityContext'
import EntityContext from '../../context/EntityContext'
import Spinner from '../../components/custom/Spinner'
import { ENTITIES } from '../../config/constants'
import EntityViewHeader from '../../components/custom/layout/EntityViewHeader'

export default function EditDataset() {
    const { isUnauthorized, getModal, setModalDetails,
        data, setData,
        error, setError,
        values, setValues,
        errorMessage, setErrorMessage,
        validated, setValidated,
        userWriteGroups, onChange, 
        editMode, setEditMode, isEditMode,
        selectedUserWriteGroupUuid,
        disableSubmit, setDisableSubmit } = useContext(EntityContext)
    const { _t } = useContext(AppContext)

    const router = useRouter()
    const [ancestors, setAncestors] = useState(null)
    const [containsHumanGeneticSequences, setContainsHumanGeneticSequences] = useState(null)
    
    
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
                    'contains_human_genetic_sequences': data.contains_human_genetic_sequences
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

    const handleSubmit = async (event) => {
        setDisableSubmit(true);

        const form = event.currentTarget.parentElement;
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

                values['contains_human_genetic_sequences'] = containsHumanGeneticSequences
                if (values['group_uuid'] === null && editMode === 'Create') {
                    values['group_uuid'] = selectedUserWriteGroupUuid
                }
                // Remove empty strings
                let json = cleanJson(values);
                let uuid = data.uuid

                await update_create_dataset(uuid, json, editMode, router).then((response) => {
                    setModalDetails({entity: ENTITIES.dataset, type: response.data_types[0], response})
                })
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

    if (!data) {
        return (
            isUnauthorized() ? <Unauthorized /> : <Spinner />
        )
    } else {
        return (
            <>
                {editMode &&
                    <Header title={`${editMode} Dataset | SenNet`}></Header>
                }

                <AppNavbar/>

                {error &&
                    <div className="alert alert-warning" role="alert">{errorMessage}</div>
                }
                {data && !error &&
                    <div className="no_sidebar">
                        <Layout
                            bodyHeader = {
                                <EntityViewHeader entity={ENTITIES.dataset} isEditMode={isEditMode()} data={data} /> 
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
                                    <Form.Group className="mb-3" controlId="lab_dataset_id">
                                        <Form.Label>{_t('Lab Name or ID')}<span> </span>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Popover>
                                                        <Popover.Body>
                                                        {_t('Lab Name or ID')}
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <QuestionCircleFill/>
                                            </OverlayTrigger>
                                        </Form.Label>
                                        <Form.Control type="text" placeholder={_t('Lab Name or ID')}
                                                      defaultValue={data.lab_dataset_id}
                                                      onChange={e => onChange(e, e.target.id, e.target.value)}/>
                                    </Form.Group>


                                    {/*/!*Description*!/*/}
                                    <Form.Group className="mb-3" controlId="description">
                                        <Form.Label>{_t('Description')}<span> </span>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Popover>
                                                        <Popover.Body>
                                                            {_t('Add information here which can be used to find this data including lab specific (non-PHI) identifiers.')}
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <QuestionCircleFill/>
                                            </OverlayTrigger>
                                        </Form.Label>
                                        <Form.Control as="textarea" rows={4} defaultValue={data.description}
                                                      onChange={e => onChange(e, e.target.id, e.target.value)}/>
                                    </Form.Group>


                                    {/*/!*Additional Information*!/*/}
                                    <Form.Group className="mb-3" controlId="dataset_info">
                                        <Form.Label>{_t('Additional Information')}<span> </span>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Popover>
                                                        <Popover.Body>
                                                            {_t('Add information here which can be used to find this data including lab specific (non-PHI) identifiers.')}
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <QuestionCircleFill/>
                                            </OverlayTrigger>
                                        </Form.Label>
                                        <Form.Control as="textarea" rows={4} defaultValue={data.dataset_info}
                                                      onChange={e => onChange(e, e.target.id, e.target.value)}/>
                                    </Form.Group>

                                    {/*/!*Human Gene Sequences*!/*/}
                                    {editMode &&
                                        <Form.Group controlId="contains_human_genetic_sequences" className="mb-3">
                                            <Form.Label>{_t('Human Gene Sequences')} <span className="required">* </span>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Popover>
                                                            <Popover.Body>
                                                                {_t('Does this data contain any human genetic sequences?')}
                                                            </Popover.Body>
                                                        </Popover>
                                                    }
                                                >
                                                    <QuestionCircleFill/>
                                                </OverlayTrigger>
                                            </Form.Label>
                                            <div className="mb-2 text-muted">{_t('Does this data contain any human genetic sequences?')}
                                            </div>
                                            <Form.Check
                                                required
                                                type="radio"
                                                label="No"
                                                name="contains_human_genetic_sequences"
                                                value={false}
                                                defaultChecked={(data.contains_human_genetic_sequences === false && isEditMode()) ? true : false}
                                                onChange={handleContainsHumanGeneticSequencesNo}
                                            />
                                            <Form.Check
                                                required
                                                type="radio"
                                                label="Yes"
                                                name="contains_human_genetic_sequences"
                                                value={true}
                                                defaultChecked={data.contains_human_genetic_sequences ? true : false}
                                                onChange={handleContainsHumanGeneticSequencesYes}
                                            />
                                        </Form.Group>
                                    }

                                    {/*/!*Data Types*!/*/}
                                    {editMode &&
                                        <DataTypes values={values} data={data} onChange={onChange}/>
                                    }

                                    <Button variant="outline-primary rounded-0" onClick={handleSubmit} disabled={disableSubmit}>
                                        {_t('Submit')}
                                    </Button>
                                </Form>
                            }
                        />
                    </div>
                }
                <AppFooter/>

                {getModal()}
            </>
        )
    }
}

EditDataset.withWrapper = function(page) {
    return <EntityProvider>{page}</EntityProvider>
}



