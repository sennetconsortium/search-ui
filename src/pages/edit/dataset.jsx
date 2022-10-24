import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {QuestionCircleFill} from "react-bootstrap-icons";
import log from "loglevel";
import {cleanJson, fetchEntity, getRequestHeaders} from "../../components/custom/js/functions";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import {get_read_write_privileges, get_user_write_groups, update_create_dataset} from "../../lib/services";
import DataTypes from "../../components/custom/edit/dataset/DataTypes";
import AncestorIds from "../../components/custom/edit/dataset/AncestorIds";
import {getCookie} from "cookies-next";
import Unauthorized from "../../components/custom/layout/Unauthorized";
import AppFooter from "../../components/custom/layout/AppFooter";
import GroupSelect from "../../components/custom/edit/GroupSelect";
import Header from "../../components/custom/layout/Header";
import CreateCompleteModal from "../../components/CreateCompleteModal";
import Spinner from "../../components/custom/Spinner";
import HipaaModal from "../../components/custom/edit/sample/HipaaModal";

function EditDataset() {
    const router = useRouter()
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(null)
    const [data, setData] = useState(null)
    const [ancestors, setAncestors] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [values, setValues] = useState({});
    const [showModal, setShowModal] = useState(false)
    const [showHideModal, setShowHideModal] = useState(false)
    const [modalBody, setModalBody] = useState(null)
    const [modalTitle, setModalTitle] = useState(null)
    const [disableSubmit, setDisableSubmit] = useState(false)
    const [authorized, setAuthorized] = useState(null)
    const [containsHumanGeneticSequences, setContainsHumanGeneticSequences] = useState(null)
    const [userWriteGroups, setUserWriteGroups] = useState([])
    const [selectedUserWriteGroupUuid, setSelectedUserWriteGroupUuid] = useState(null)
    const [isLoading, setIsLoading] = useState(null)

    const handleClose = () => setShowModal(false);
    const handleHome = () => router.push('/search');

    // only executed on init rendering, see the []
    useEffect(() => {
        get_read_write_privileges().then(response => {
            setAuthorized(response.write_privs)
        }).catch(error => log.error(error))

        get_user_write_groups()
            .then(response => {
                if (response.user_write_groups.length === 1) {
                    setSelectedUserWriteGroupUuid(response.user_write_groups[0].uuid)
                }
                setUserWriteGroups(response.user_write_groups)
            })
            .catch(e => log.error(e))

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

    // callback provided to components to update the main list of form values
    const onChange = (e, fieldId, value) => {
        // use a callback to find the field in the value list and update it
        setValues((currentValues) => {
            // log.info(currentValues)
            currentValues[fieldId] = value;
            return currentValues;
        });

    };

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

                await update_create_dataset(uuid, json, editMode, router)
                    .then((response) => {
                        setShowModal(true)
                        setDisableSubmit(false);

                        if ('uuid' in response) {
                            if (editMode === 'Edit') {
                                setModalTitle("Dataset Updated")
                                setModalBody("Your Dataset was updated:\n" +
                                    "Data type: " + response.data_types[0] + "\n" +
                                    "Group Name: " + response.group_name + "\n" +
                                    "SenNet ID: " + response.sennet_id)
                            } else {
                                setModalTitle("Dataset Created")
                                setModalBody("Your Dataset was created:\n" +
                                    "Data type: " + response.data_types[0] + "\n" +
                                    "Group Name: " + response.group_name + "\n" +
                                    "SenNet ID: " + response.sennet_id)
                            }
                        } else {
                            setModalTitle("Error Creating Dataset")
                            let responseText = ""
                            if ("error" in response) {
                                responseText = response.error
                            } else if ("statusText" in response) {
                                responseText = response.statusText
                            }
                            setModalBody(responseText)
                            setShowHideModal(true);
                        }
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

    const showLoadingSpinner = authorized === null || data === null

    if (showLoadingSpinner || isLoading) {
        return (
            <Spinner/>
        )
    } else if (authorized && getCookie('isAuthenticated')) {
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
                            bodyHeader={
                                <Container className="px-0" fluid={true}>
                                    <Row md={12}>
                                        <h4>Dataset Information</h4>
                                    </Row>
                                    <Row>
                                        <HipaaModal/>
                                    </Row>
                                    {editMode === 'Edit' &&
                                        <>
                                            <Row>
                                                <Col md={6}><h5>SenNet ID: {data.sennet_id}</h5></Col>
                                                <Col md={6}><h5>Group: {data.group_name}</h5></Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}><h5>Entered By: {data.created_by_user_email}</h5></Col>
                                                <Col md={6}><h5>Entry Date: {new Intl.DateTimeFormat('en-US', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit'
                                                }).format(data.created_timestamp)}</h5></Col>
                                            </Row>
                                        </>
                                    }

                                </Container>
                            }
                            bodyContent={
                                <Form noValidate validated={validated}>
                                    {/*Group select*/}
                                    {
                                        !(userWriteGroups.length === 1 || editMode === 'Edit') &&
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
                                        <Form.Label>Lab Name or ID<span> </span>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Popover>
                                                        <Popover.Body>
                                                            Lab Name or ID
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <QuestionCircleFill/>
                                            </OverlayTrigger>
                                        </Form.Label>
                                        <Form.Control type="text" placeholder="Lab Name or ID"
                                                      defaultValue={data.lab_dataset_id}
                                                      onChange={e => onChange(e, e.target.id, e.target.value)}/>
                                    </Form.Group>


                                    {/*/!*Description*!/*/}
                                    <Form.Group className="mb-3" controlId="description">
                                        <Form.Label>Description<span> </span>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Popover>
                                                        <Popover.Body>
                                                            Add information here which can be used to find this data
                                                            including lab specific (non-PHI) identifiers.
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
                                        <Form.Label>Additional Information<span> </span>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Popover>
                                                        <Popover.Body>
                                                            Add information here which can be used to find this data
                                                            including lab specific (non-PHI) identifiers.
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
                                            <Form.Label>Human Gene Sequences <span className="required">* </span>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Popover>
                                                            <Popover.Body>
                                                                Does this data contain any human genetic sequences?
                                                            </Popover.Body>
                                                        </Popover>
                                                    }
                                                >
                                                    <QuestionCircleFill/>
                                                </OverlayTrigger>
                                            </Form.Label>
                                            <div className="mb-2 text-muted">Does this data contain any human genetic
                                                sequences?
                                            </div>
                                            <Form.Check
                                                required
                                                type="radio"
                                                label="No"
                                                name="contains_human_genetic_sequences"
                                                value={false}
                                                defaultChecked={(data.contains_human_genetic_sequences === false && editMode === 'Edit') ? true : false}
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

                                    <Button variant="outline-primary rounded-0" onClick={handleSubmit}
                                            disabled={disableSubmit}>
                                        Submit
                                    </Button>

                                    <CreateCompleteModal
                                        showModal={showModal}
                                        modalTitle={modalTitle}
                                        modalBody={modalBody}
                                        handleClose={handleClose}
                                        handleHome={handleHome}
                                        showCloseButton={showHideModal}
                                    />
                                </Form>
                            }
                        />
                    </div>
                }
                {!showModal && <AppFooter/>}
            </>
        )
    } else {
        return (
            <Unauthorized/>
        )
    }
}


export default EditDataset