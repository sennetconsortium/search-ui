import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {QuestionCircleFill} from "react-bootstrap-icons";
import log from "loglevel";
import {cleanJson, fetchEntity, getRequestHeaders} from "../../components/custom/js/functions";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import {update_create_dataset} from "../../lib/services";
import DataTypes from "../../components/custom/edit/dataset/DataTypes";
import AncestorIds from "../../components/custom/edit/dataset/AncestorIds";

function EditDataset() {
    const router = useRouter()
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(null)
    const [data, setData] = useState(null)
    const [sources, setSources] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [query, setQuery] = useState(router.query)
    const [values, setValues] = useState({});
    const [showModal, setShowModal] = useState(false)
    const [modalBody, setModalBody] = useState(null)
    const [modalTitle, setModalTitle] = useState(null)
    const [disableSubmit, setDisableSubmit] = useState(false)

    const handleClose = () => setShowModal(false);
    const handleHome = () => router.push('/search');


    // only executed on init rendering, see the []
    useEffect(() => {

        log.debug('ROUTER CHANGED: useEffect: query:', router.query.uuid)
        setQuery(router.query)

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
                // Set state with default values that will be PUT to Entity API to update
                // TODO: Is there a way to do with while setting "defaultValue" for the form fields?
                setValues({
                    // TODO: Need to set group_uuid
                    'lab_dataset_id': lab_dataset_id,
                    'data_types': [data.data_types[0]],
                    'description': data.description,
                    'dataset_info': data.dataset_info,
                    'direct_ancestor_uuids': [data.immediate_ancestors[0].uuid],
                    'contains_human_genetic_sequences': data.contains_human_genetic_sequences
                })
                setEditMode("edit")

                // TODO: Need to change this is descendant for sennet
                if (data.hasOwnProperty("immediate_ancestors")) {
                    for (const ancestor of data.immediate_ancestors) {
                        await fetchSources(ancestor.uuid);
                    }
                }
            }
        }

        if (router.query.hasOwnProperty("uuid")) {
            if (router.query.uuid === 'create') {
                setData(true)
                setEditMode("create")
            } else {
                // call the function
                fetchData(router.query.uuid)
                    // make sure to catch any error
                    .catch(console.error);
            }
        } else {
            setData(null);
            setSources(null)
        }
    }, [router]);

    // effect runs when user state is updated
    useEffect(() => {
        // reset form with user data
        log.debug("editDataset: RESET data...")
        //reset(data);
    }, [data]);

    // callback provided to components to update the main list of form values
    const onChange = (e, fieldId, value) => {
        // log.debug('onChange', fieldId, value)
        // use a callback to find the field in the value list and update it
        setValues((currentValues) => {
            currentValues[fieldId] = value;
            return currentValues;
        });
        log.debug(values)
    };

    const fetchSources = async (source_uuid) => {
        let source = await fetchEntity(source_uuid);
        if (source.hasOwnProperty("error")) {
            setError(true)
            setErrorMessage(source["error"])
        } else {
            if (sources) {
                const old_sources = [...sources];
                old_sources.push(source);
                setSources(old_sources);
            } else {
                setSources([source])
            }
        }
    }

    const deleteSource = (source_uuid) => {
        const old_sources = [...sources];
        log.debug(old_sources)
        let updated_sources = old_sources.filter(e => e.uuid !== source_uuid);
        setSources(updated_sources);
        log.debug(updated_sources);
    }


    const handleSubmit = async (event) => {
        setDisableSubmit(true);

        const form = event.currentTarget;
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

                // Remove empty strings
                let json = cleanJson(values);
                let uuid = data.uuid

                await update_create_dataset(uuid, json, editMode, router).then((response) => {
                    setShowModal(true)
                    setDisableSubmit(false);

                    if (response.status === 200) {
                        if (editMode === 'edit') {
                            setModalTitle("Dataset Updated")
                            setModalBody("Dataset was updated successfully.")
                        } else {
                            setModalTitle("Dataset Created")
                            setModalBody("Dataset was created successfully.")
                        }
                    } else {
                        setModalTitle("Error Creating Dataset")
                        setModalBody(response.statusText)
                    }
                })
            }
        }


        setValidated(true);
    };


    return (
        <div>
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
                                {editMode === 'edit' &&
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
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                {/*Source ID*/}
                                {/*editMode is only set when page is ready to load */}
                                {editMode &&
                                    <AncestorIds values={values} sources={sources} onChange={onChange}
                                                 fetchSources={fetchSources} deleteSource={deleteSource}/>
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
                                            defaultChecked={(data.contains_human_genetic_sequences === false && editMode === 'edit') ? true : false}
                                            onChange={e => onChange(e, e.target.id, e.target.value)}
                                        />
                                        <Form.Check
                                            required
                                            type="radio"
                                            label="Yes"
                                            name="contains_human_genetic_sequences"
                                            value={true}
                                            defaultChecked={data.contains_human_genetic_sequences ? true : false}
                                            onChange={e => onChange(e, e.target.id, e.target.value)}
                                        />
                                    </Form.Group>
                                }

                                {/*/!*Data Types*!/*/}
                                {editMode &&
                                    <DataTypes values={values} data={data} onChange={onChange}/>
                                }

                                <Button variant="primary" type="submit" disabled={disableSubmit}>
                                    Submit
                                </Button>
                            </Form>
                        }
                    />
                </div>
            }
            {!data &&
                <div className="text-center p-3">
                    <span>Loading, please wait...</span>
                    <br></br>
                    <span className="spinner-border spinner-border-lg align-center alert alert-info"></span>
                </div>
            }

            <Modal show={showModal}>
                <Modal.Header>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalBody}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleHome}>
                        Home page
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}


export default EditDataset