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
import {cleanJson, getRequestHeaders} from "../../components/custom/js/functions";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import {update_create_entity} from "../../lib/services";
import SourceType from "../../components/custom/edit/source/SourceType";

function EditSource() {
    const router = useRouter()
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(null)
    const [data, setData] = useState(null)
    const [source, setSource] = useState(null)
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
                // TODO: Is there a way to do with while setting "defaultValue" for the form fields?
                setValues({
                    // TODO: Need to set group_uuid
                    'lab_source_id': data.lab_source_id,
                    'protocol_url': data.protocol_url,
                    'description': data.description,
                    'source_type': data.source_type
                })
                setEditMode("edit")
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
                ;
            }
        } else {
            setData(null);
            setSource(null)
        }
    }, [router]);

    // effect runs when user state is updated
    useEffect(() => {
        // reset form with user data
        log.debug("editSource: RESET data...")
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
        log.info(values);
    };


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
            log.debug("Form is valid")

            // Remove empty strings
            let json = cleanJson(values);
            let uuid = data.uuid

            await update_create_entity(uuid, json, editMode, "Source", router).then((response) => {
                setShowModal(true)
                setDisableSubmit(false);

                if (response.status === 200) {
                    if (editMode === 'edit') {
                        setModalTitle("Source Updated")
                        setModalBody("Source was updated successfully.")
                    } else {
                        setModalTitle("Source Created")
                        setModalBody("Source was created successfully.")
                    }
                } else {
                    setModalTitle("Error Creating Source")
                    setModalBody(response.statusText)
                }
            })
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
                                    <h4>Source Information</h4>
                                </Row>
                                {editMode == 'edit' &&
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
                                                        The protocol used when choosing and acquiring the source. This
                                                        can be supplied as a DOI from https://www.protocols.io/.
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        >
                                            <QuestionCircleFill/>
                                        </OverlayTrigger>
                                    </Form.Label>
                                    <Form.Control type="text" required
                                                  pattern={"(^(http(s)?:\/\/)?dx.doi.org\/10\.17504\/protocols\.io\..+)|(^(http(s)?:\/\/)?doi.org\/10\.17504\/protocols\.io\..+)"}
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


export default EditSource