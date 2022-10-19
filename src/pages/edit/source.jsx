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
import {cleanJson, getDOIPattern, getRequestHeaders} from "../../components/custom/js/functions";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import {get_read_write_privileges, get_user_write_groups, update_create_entity} from "../../lib/services";
import SourceType from "../../components/custom/edit/source/SourceType";
import Unauthorized from "../../components/custom/layout/Unauthorized";
import {getCookie} from "cookies-next";
import AppFooter from "../../components/custom/layout/AppFooter";
import GroupSelect from "../../components/custom/edit/GroupSelect";
import Header from "../../components/custom/layout/Header";

function EditSource() {
    const router = useRouter()
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(null)
    const [data, setData] = useState(null)
    const [source, setSource] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [values, setValues] = useState({});
    const [showModal, setShowModal] = useState(false)
    const [showHideModal, setShowHideModal] = useState(false)
    const [modalBody, setModalBody] = useState(null)
    const [modalTitle, setModalTitle] = useState(null)
    const [disableSubmit, setDisableSubmit] = useState(false)
    const [authorized, setAuthorized] = useState(null)
    const [userWriteGroups, setUserWriteGroups] = useState([])
    const [selectedUserWriteGroupUuid, setSelectedUserWriteGroupUuid] = useState(null)

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
            log.debug('editSource: getting data...', uuid)
            // get the data from the api
            const response = await fetch("/api/find?uuid=" + uuid, getRequestHeaders());
            // convert the data to json
            const data = await response.json();

            log.debug('editSource: Got data', data)
            if (data.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(data["error"])
            } else {
                setData(data);
                // Set state with default values that will be PUT to Entity API to update
                setValues({
                    'lab_source_id': data.lab_source_id,
                    'protocol_url': data.protocol_url,
                    'description': data.description,
                    'source_type': data.source_type
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
            setSource(null)
        }
    }, [router]);

    // callback provided to components to update the main list of form values
    const onChange = (e, fieldId, value) => {
        // log.debug('onChange', fieldId, value)
        // use a callback to find the field in the value list and update it
        setValues((currentValues) => {
            currentValues[fieldId] = value;
            return currentValues;
        });
    };

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
            log.debug("Form is valid")

            if (values['group_uuid'] === null && editMode === 'Create') {
                values['group_uuid'] = selectedUserWriteGroupUuid
            }

            // Remove empty strings
            let json = cleanJson(values);
            let uuid = data.uuid

            await update_create_entity(uuid, json, editMode, "Source", router).then((response) => {
                setShowModal(true)
                setDisableSubmit(false);

                if ('uuid' in response) {
                    if (editMode === 'Edit') {
                        setModalTitle("Source Updated")
                        setModalBody("Your Source was updated:\n" +
                            "Source type: " + response.source_type + "\n" +
                            "Group Name: " + response.group_name + "\n" +
                            "SenNet ID: " + response.sennet_id)
                    } else {
                        setModalTitle("Source Created")
                        setModalBody("Your Source was created:\n" +
                            "Source type: " + response.source_type + "\n" +
                            "Group Name: " + response.group_name + "\n" +
                            "SenNet ID: " + response.sennet_id)
                    }
                } else {
                    setModalTitle("Error Creating Source")
                    setModalBody(response.statusText)
                    setShowHideModal(true);
                }
            })
        }

        setValidated(true);
    };

    if (authorized === null) {
        return (
            <div className="text-center p-3">
                <span>Loading, please wait...</span>
                <br></br>
                <span className="spinner-border spinner-border-lg align-center alert alert-info"></span>
            </div>
        )
    } else if (authorized && getCookie('isAuthenticated')) {
        return (
            <>
                {editMode &&
                    <Header title={`${editMode} Source | SenNet`}></Header>
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
                                        <h4>Source Information</h4>
                                    </Row>
                                    {editMode == 'Edit' &&
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
                                    {/*Group select*/}
                                    {
                                        !(userWriteGroups.length === 1 || editMode === 'Edit') &&
                                        <GroupSelect
                                            data={data}
                                            groups={userWriteGroups}
                                            onGroupSelectChange={onChange}
                                            entity_type={'source'}/>
                                    }

                                    {/*Lab's Source Non-PHI ID*/}
                                    <Form.Group className="mb-3" controlId="lab_source_id">
                                        <Form.Label>Lab's Source Non-PHI ID or Name<span className="required">* </span>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Popover>
                                                        <Popover.Body>
                                                            An identifier used by the lab to identify the source.
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <QuestionCircleFill/>
                                            </OverlayTrigger>
                                        </Form.Label>
                                        <Form.Control type="text" required
                                                      placeholder="An non-PHI ID or deidentified name used by the lab when referring to the source."
                                                      defaultValue={data.lab_source_id}
                                                      onChange={e => onChange(e, e.target.id, e.target.value)}/>
                                    </Form.Group>

                                    {/*Source Type*/}
                                    <SourceType data={data} onChange={onChange}/>


                                    {/*Case Selection Protocol*/}
                                    <Form.Group className="mb-3" controlId="protocol_url">
                                        <Form.Label>Case Selection Protocol <span className="required">* </span>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Popover>
                                                        <Popover.Body>
                                                            The protocol used when choosing and acquiring the source.
                                                            This
                                                            can be supplied as a DOI from https://www.protocols.io/.
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <QuestionCircleFill/>
                                            </OverlayTrigger>
                                        </Form.Label>
                                        <Form.Control type="text" required
                                                      pattern={getDOIPattern()}
                                                      placeholder="protocols.io DOI"
                                                      defaultValue={data.protocol_url}
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
                                                            Free text field to enter a description of the source.
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

                                    {/*/!*Metadata*!/*/}
                                    {/* <Form.Group controlId="metadata-file" className="mb-3">
                                    <Form.Label>Add a Metadata file</Form.Label>
                                    <Form.Control type="file"/>
                                </Form.Group> */}

                                    {/*/!*Image*!/*/}
                                    {/* <Form.Group controlId="image-file" className="mb-3">
                                    <Form.Label>Add an Image file <span> </span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Popover>
                                                    <Popover.Body>
                                                        Upload deidentified images only.
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        >
                                            <QuestionCircleFill/>
                                        </OverlayTrigger>
                                    </Form.Label>
                                    <Form.Control type="file"/>
                                </Form.Group> */}

                                    <Button variant="outline-primary rounded-0" onClick={handleSubmit} disabled={disableSubmit}>
                                        Submit
                                    </Button>
                                </Form>
                            }
                        />
                    </div>
                }
                <AppFooter/>

                <Modal show={showModal}>
                    <Modal.Header>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><p>{modalBody}</p></Modal.Body>
                    <Modal.Footer>
                        {showHideModal &&
                            <Button variant="outline-secondary rounded-0" onClick={handleClose}>
                                Close
                            </Button>
                        }
                        <Button variant="outline-primary rounded-0" onClick={handleHome}>
                            Home page
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    } else {
        return (
            <Unauthorized/>
        )
    }
}


export default EditSource