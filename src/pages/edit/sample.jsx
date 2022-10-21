import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import AncestorId from "../../components/custom/edit/sample/AncestorId";
import SampleCategory from "../../components/custom/edit/sample/SampleCategory";
import AncestorInformationBox from "../../components/custom/edit/sample/AncestorInformationBox";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {QuestionCircleFill} from "react-bootstrap-icons";
import log from "loglevel";
import {cleanJson, fetchEntity, getDOIPattern, getRequestHeaders} from "../../components/custom/js/functions";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import {get_read_write_privileges, get_user_write_groups, parseJson, update_create_entity} from "../../lib/services";
import {getCookie} from "cookies-next";
import Unauthorized from "../../components/custom/layout/Unauthorized";
import AppFooter from "../../components/custom/layout/AppFooter";
import GroupSelect from "../../components/custom/edit/GroupSelect";
import Header from "../../components/custom/layout/Header";
import RuiIntegration from "../../components/custom/edit/sample/rui/RuiIntegration";
import RUIButton from "../../components/custom/edit/sample/rui/RUIButton";
import CreateCompleteModal from "../../components/CreateCompleteModal";
import Spinner from "../../components/custom/Spinner";
import HipaaModal from "../../components/custom/edit/sample/HipaaModal";

function EditSample() {
    const router = useRouter()
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(null)
    const [data, setData] = useState(null)
    const [source, setSource] = useState(null)
    const [sourceId, setSourceId] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [values, setValues] = useState(null);
    const [showModal, setShowModal] = useState(false)
    const [showHideModal, setShowHideModal] = useState(false)
    const [modalBody, setModalBody] = useState(null)
    const [modalTitle, setModalTitle] = useState(null)
    const [disableSubmit, setDisableSubmit] = useState(false)
    const [authorized, setAuthorized] = useState(null)
    const [userWriteGroups, setUserWriteGroups] = useState([])
    const [selectedUserWriteGroupUuid, setSelectedUserWriteGroupUuid] = useState(null)
    const [ruiLocation, setRuiLocation] = useState('')
    const [showRui, setShowRui] = useState(false)
    const [showRuiButton, setShowRuiButton] = useState(false)
    const [isLoading, setIsLoading] = useState(null)

    const handleClose = () => setShowModal(false);
    const handleHome = () => router.push('/search');

    // only executed on init rendering, see the []
    useEffect(() => {
        get_read_write_privileges()
            .then(response => setAuthorized(response.write_privs))
            .catch(log.error)

        get_user_write_groups()
            .then(response => {
                if (response.user_write_groups.length === 1) {
                    setSelectedUserWriteGroupUuid(response.user_write_groups[0].uuid)
                }
                setUserWriteGroups(response.user_write_groups)
            })
            .catch(log.error)

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

                if (data.hasOwnProperty("immediate_ancestors")) {
                    await fetchSource(data.immediate_ancestors[0].uuid);
                }
                if (data['rui_location'] !== null) {
                    setRuiLocation(data['rui_location'])
                    setShowRuiButton(true)
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
        setValues((previousValues) => {
            if (previousValues !== null) {
                return {...previousValues, [fieldId]: value}
            } else {
                return {
                    [fieldId]: value
                }
            }
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
        setIsLoading(true)
        setDisableSubmit(true);

        const form = event.currentTarget.parentElement;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            log.debug("Form is invalid")
            setIsLoading(false)
            setDisableSubmit(false);
        } else {
            event.preventDefault();
            log.debug("Form is valid")

            if (values['group_uuid'] === null && editMode === 'Create') {
                values['group_uuid'] = selectedUserWriteGroupUuid
            }

            if (ruiLocation !== '') {
                values['rui_location'] = parseJson(ruiLocation)
            }

            // Remove empty strings
            let json = cleanJson(values);
            let uuid = data.uuid

            await update_create_entity(uuid, json, editMode, "Sample", router)
                .then((response) => {
                    setIsLoading(false)
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

        setValidated(true);
    };

    if (values !== null && values['sample_category'] === 'organ' &&
        (values.hasOwnProperty('organ') && values['organ'] !== '' && values['organ'] !== 'other')) {
        if (!showRuiButton) {
            setShowRuiButton(true)
        }
    } else {
        if (showRuiButton) {
            setShowRuiButton(false)
        }
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
                    <Header title={`${editMode} Sample | SenNet`}></Header>
                }

                <AppNavbar/>

                {error &&
                    <div className="alert alert-warning" role="alert">{errorMessage}</div>
                }
                {showRui &&
                    <RuiIntegration
                        organ={values['organ']}
                        sex={'male'}
                        user={'Samuel Sedivy'}
                        blockStartLocation={ruiLocation}
                        setRuiLocation={setRuiLocation}
                        setShowRui={setShowRui}
                    />
                }

                {data && !error && !showModal &&
                    <div className="no_sidebar">
                        <Layout
                            bodyHeader={
                                <Container className="px-0" fluid={true}>
                                    <Row md={12}>
                                        <h4>Sample Information</h4>
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

                                    {/*/!*Tissue Sample Type*!/*/}
                                    {((editMode === 'Edit' && source) || (editMode === 'Create')) &&
                                        <>
                                            <SampleCategory
                                                data={data}
                                                source={source}
                                                onChange={onChange}
                                            />
                                            <RUIButton
                                                showRegisterLocationButton={showRuiButton}
                                                ruiLocation={ruiLocation}
                                                setShowRui={setShowRui}
                                            />
                                        </>
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
                                                      pattern={getDOIPattern()}
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

                                    <Button variant="outline-primary rounded-0" onClick={handleSubmit}
                                            disabled={disableSubmit}>
                                        Submit
                                    </Button>
                                </Form>
                            }
                        />
                    </div>
                }

                {!showModal && <AppFooter/>}

                <CreateCompleteModal
                    showModal={showModal}
                    modalTitle={modalTitle}
                    modalBody={modalBody}
                    handleClose={handleClose}
                    handleHome={handleHome}
                    showCloseButton={showHideModal}
                />
            </>
        )
    } else {
        return (
            <Unauthorized/>
        )
    }
}


export default EditSample