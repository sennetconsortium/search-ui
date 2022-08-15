import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import AncestorId from "../../components/custom/edit/sample/AncestorId";
import TissueSample from "../../components/custom/edit/sample/TissueSample";
import SourceInformationBox from "../../components/custom/edit/sample/SourceInformationBox";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {QuestionCircleFill} from "react-bootstrap-icons";
import log from "loglevel";
import {cleanJson, fetchEntity, getRequestHeaders} from "../../components/custom/js/functions";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import {update_create_entity} from "../../lib/services";

function EditSample() {
    const router = useRouter()
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(null)
    const [data, setData] = useState(null)
    const [source, setSource] = useState(null)
    const [sourceId, setSourceId] = useState(null)
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
            log.debug('editSample: getting data...', uuid)
            // get the data from the api
            const response = await fetch("/api/find?uuid=" + uuid, getRequestHeaders());
            // convert the data to json
            const data = await response.json();

            log.debug('editSample: Got data', data)
            if (data.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(data["error"])
            } else {
                setData(data);
                // Set state with default values that will be PUT to Entity API to update
                // TODO: Is there a way to do with while setting "defaultValue" for the form fields?
                setValues({
                    'specimen_type': data.specimen_type,
                    'specimen_type_other': data.specimen_type,
                    'organ': data.organ,
                    'organ_other': data.organ_other,
                    'protocol_url': data.protocol_url,
                    'lab_tissue_sample_id': data.lab_tissue_sample_id,
                    'description': data.description,
                    'direct_ancestor_uuid': data.immediate_ancestors[0].uuid
                })
                setEditMode("edit")

                // TODO: Need to change this is descendant for sennet
                if (data.hasOwnProperty("immediate_ancestors")) {
                    await fetchSource(data.immediate_ancestors[0].uuid);
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
            setSource(null)
            setSourceId(null)
        }
    }, [router]);

    // effect runs when user state is updated
    useEffect(() => {
        // reset form with user data
        log.debug("editSample: RESET data...")
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
    };

    const fetchSource = async (sourceId) => {
        let source = await fetchEntity(sourceId);
        if (source.hasOwnProperty("error")) {
            setError(true)
            setErrorMessage(source["error"])
        } else {
            setSource(source);
            setSourceId(source.hubmap_id)
        }
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
            log.debug("Form is valid")

            // Remove empty strings
            let json = cleanJson(values);
            let uuid = data.uuid

            await update_create_entity(uuid, json, editMode, "Sample", router).then((response) => {
                setShowModal(true)
                setDisableSubmit(false);

                if (response.status === 200) {
                    if (editMode === 'edit') {
                        setModalTitle("Sample Updated")
                        setModalBody("Sample was updated successfully.")
                    } else {
                        setModalTitle("Sample Created")
                        setModalBody("Sample was created successfully.")
                    }
                } else {
                    setModalTitle("Error Creating Sample")
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
                                    <h4>Sample Information</h4>
                                </Row>
                                {editMode === 'edit' &&
                                    <>
                                        <Row>
                                            <Col md={6}><h5>SenNet ID: {data.hubmap_id}</h5></Col>
                                            <Col md={6}><h5>Submission ID: {data.submission_id}</h5></Col>
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
                                {/*Ancestor ID*/}
                                {/*editMode is only set when page is ready to load */}
                                {editMode &&
                                    <AncestorId source={source} onChange={onChange} fetchSource={fetchSource}/>
                                }

                                {/*Source Information Box*/}
                                {source &&
                                    <SourceInformationBox source={source}/>
                                }

                                {/*/!*Tissue Sample Type*!/*/}
                                {((editMode === 'edit' && source) || (editMode === 'create')) &&
                                    <TissueSample data={data} source={source} onChange={onChange}/>
                                }

                                {/*/!*Preparation Protocol*!/*/}
                                <Form.Group className="mb-3" controlId="protocol_url">
                                    <Form.Label>Preparation Protocol <span className="required">* </span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Popover>
                                                    <Popover.Body>
                                                        The protocol used when procuring or preparing the tissue.
                                                        This must be provided as a protocols.io DOI URL see
                                                        https://www.protocols.io/
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

                                {/*/!*Lab Sample ID*!/*/}
                                <Form.Group className="mb-3" controlId="lab_tissue_sample_id">
                                    <Form.Label>Lab Sample ID<span> </span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Popover>
                                                    <Popover.Body>
                                                        An identifier used by the lab to identify the specimen, this can
                                                        be an identifier from the system used to track the specimen in
                                                        the lab. This field will be entered by the user.
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        >
                                            <QuestionCircleFill/>
                                        </OverlayTrigger>
                                    </Form.Label>
                                    <Form.Control type="text" placeholder="Lab specific alpha-numeric ID"
                                                  defaultValue={data.lab_tissue_sample_id}
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
                                                        A free text description of the specimen.
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
                                <Form.Group controlId="metadata-file" className="mb-3">
                                    <Form.Label>Add a Metadata file</Form.Label>
                                    <Form.Control type="file"/>
                                </Form.Group>

                                {/*/!*Image*!/*/}
                                <Form.Group controlId="slide-image-file" className="mb-3">
                                    <Form.Label>Add a Slide Image file <span> </span>
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
                                </Form.Group>

                                {/*/!*Thumbnail*!/*/}
                                <Form.Group controlId="thumbnail-file" className="mb-3">
                                    <Form.Label>Add a Thumbnail file <span> </span>
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
                                </Form.Group>

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


export default EditSample