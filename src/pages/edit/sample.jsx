import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import AncestorId from "../../components/custom/edit/sample/AncestorId";
import SampleCategory from "../../components/custom/edit/sample/SampleCategory";
import AncestorInformationBox from "../../components/custom/edit/sample/AncestorInformationBox";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {QuestionCircleFill} from "react-bootstrap-icons";
import log from "loglevel";
import {cleanJson, fetchEntity, getRequestHeaders} from "../../components/custom/js/functions";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import {get_read_write_privileges, get_user_write_groups, update_create_entity} from "../../lib/services";
import {getCookie} from "cookies-next";
import Unauthorized from "../../components/custom/layout/Unauthorized";
import AppFooter from "../../components/custom/layout/AppFooter";
import GroupSelect from "../../components/custom/edit/GroupSelect";
import Header from "../../components/custom/layout/Header";
import RuiIntegration from "../../components/RuiIntegration";

function EditSample() {
    const router = useRouter()
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(null)
    const [data, setData] = useState(null)
    const [source, setSource] = useState(null)
    const [sourceId, setSourceId] = useState(null)
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
    const [tissueBlockSpatialData, setTissueBlockSpatialData] = useState('')
    const [showRui, setShowRui] = useState(false)
    const [organType, setOrganType] = useState('')

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
                    'sample_category': data.sample_category,
                    'organ': data.organ,
                    'organ_other': data.organ_other,
                    'protocol_url': data.protocol_url,
                    'lab_tissue_sample_id': data.lab_tissue_sample_id,
                    'description': data.description,
                    'direct_ancestor_uuid': data.immediate_ancestors[0].uuid
                })
                setEditMode("Edit")

                // TODO: Need to change this is descendant for sennet
                if (data.hasOwnProperty("immediate_ancestors")) {
                    await fetchSource(data.immediate_ancestors[0].uuid);
                }
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
            setSourceId(null)
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

    const fetchSource = async (sourceId) => {
        let source = await fetchEntity(sourceId);
        if (source.hasOwnProperty("error")) {
            setError(true)
            setErrorMessage(source["error"])
        } else {
            setSource(source);
            setSourceId(source.sennet_id)
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

            if (values['group_uuid'] === null && editMode === 'Create') {
                values['group_uuid'] = selectedUserWriteGroupUuid
            }

            if (tissueBlockSpatialData !== '') {
                values['rui_location'] = tissueBlockSpatialData
            }

            // Remove empty strings
            let json = cleanJson(values);
            let uuid = data.uuid

            await update_create_entity(uuid, json, editMode, "Sample", router).then((response) => {
                setShowModal(true)
                setDisableSubmit(false);

                if ('uuid' in response) {
                    if (editMode === 'Edit') {
                        setModalTitle("Sample Updated")
                        setModalBody("Your Sample was updated:\n" +
                            "Sample category: " + response.sample_category + "\n" +
                            "Group Name: " + response.group_name + "\n" +
                            "SenNet ID: " + response.sennet_id)
                    } else {
                        setModalTitle("Sample Created")
                        setModalBody("Your Sample was created:\n" +
                            "Sample category: " + response.sample_category + "\n" +
                            "Group Name: " + response.group_name + "\n" +
                            "SenNet ID: " + response.sennet_id)
                    }
                } else {
                    setModalTitle("Error Creating Sample")
                    setModalBody(response.statusText)
                    setShowHideModal(true);
                }
            })
        }


        setValidated(true);
    };

    const showRegisterLocationButton = organType !== '' && values['organ'] !== 'other'

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
                    <Header title={`${editMode} Sample | SenNet`}></Header>
                }

                <AppNavbar/>

                {error &&
                    <div className="alert alert-warning" role="alert">{errorMessage}</div>
                }
                {showRui &&
                    <RuiIntegration
                        organ={organType}
                        sex={'male'}
                        user={'Samuel Sedivy'}
                        blockStartLocation={tissueBlockSpatialData}
                        handleJsonRUI={(data) => setTissueBlockSpatialData(data)}
                        setShowRui={(b) => setShowRui(b)}
                    />
                }

                {data && !error &&
                    <div className="no_sidebar">
                        <Layout
                            bodyHeader={
                                <Container className="px-0" fluid={true}>
                                    <Row md={12}>
                                        <h4>Sample Information</h4>
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
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    {/*Group select*/}
                                    {
                                        !(userWriteGroups.length === 1 || editMode === 'Edit') &&
                                        <GroupSelect
                                            data={data}
                                            groups={userWriteGroups}
                                            onGroupSelectChange={onChange}
                                            entity_type={'sample'}/>
                                    }

                                    {/*Ancestor ID*/}
                                    {/*editMode is only set when page is ready to load */}
                                    {editMode &&
                                        <AncestorId source={source} onChange={onChange} fetchSource={fetchSource}/>
                                    }

                                    {/*Source Information Box*/}
                                    {source &&
                                        <AncestorInformationBox ancestor={source}/>
                                    }

                                    {/*TODO: Need to rename this component to "SampleCategory" and update the form values set by it*/}
                                    {/*/!*Tissue Sample Type*!/*/}
                                    {((editMode === 'Edit' && source) || (editMode === 'Create')) &&
                                        <SampleCategory
                                            data={data}
                                            source={source}
                                            onChange={onChange}
                                            setShowRui={(b) => setShowRui(b)}
                                            tissueBlockSpatialData={tissueBlockSpatialData}
                                            setOrganType={setOrganType}
                                            showRegisterLocationButton={showRegisterLocationButton}
                                        />
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
                                                            An identifier used by the lab to identify the specimen, this
                                                            can
                                                            be an identifier from the system used to track the specimen
                                                            in
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
                                    {/* <Form.Group controlId="metadata-file" className="mb-3">
                                    <Form.Label>Add a Metadata file</Form.Label>
                                    <Form.Control type="file"/>
                                </Form.Group> */}

                                    {/*/!*Image*!/*/}
                                    {/* <Form.Group controlId="slide-image-file" className="mb-3">
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
                                </Form.Group> */}

                                    {/*/!*Thumbnail*!/*/}
                                    {/* <Form.Group controlId="thumbnail-file" className="mb-3">
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
                                </Form.Group> */}

                                    <Button variant="outline-primary rounded-0" type="submit" disabled={disableSubmit}>
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


export default EditSample