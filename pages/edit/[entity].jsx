import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Col, Container, Form, Nav, Navbar, Row} from 'react-bootstrap';
import {APP_TITLE, getAuth} from '../../config/config';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import TissueSample from "../../components/custom/edit/sample/TissueSample";
import SourceInformationBox from "../../components/custom/edit/sample/SourceInformationBox";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {QuestionCircleFill} from "react-bootstrap-icons";
import log from "loglevel";

function EditSample() {
    const router = useRouter()
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(null)
    const [data, setData] = useState(null)
    const [source, setSource] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [query, setQuery] = useState(router.query)
    const [values, setValues] = useState({});

    // only executed on init rendering, see the []
    useEffect(() => {

        log.debug('ROUTER CHANGED: useEffect: query:', router.query.uuid)
        setQuery(router.query)

        // declare the async data fetching function
        const fetchData = async (uuid) => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + getAuth());
            myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            }
            log.debug('editSample: getting data...', uuid)
            // get the data from the api
            const response = await fetch("/api/find?uuid=" + uuid, requestOptions);
            // convert the data to json
            const data = await response.json();

            log.debug('editSample: Got data', data)
            if (data.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(data["error"])
            } else {
                // set state with the result
                setData(data);
                setValues(data);
                setEditMode("edit")

                // TODO: Need to change this is descendant for sennet
                if (data.hasOwnProperty("ancestors")) {
                    const response = await fetch("/api/find?uuid=" + data.ancestors[0].uuid, requestOptions);
                    // convert the data to json
                    const source = await response.json();
                    if (source.hasOwnProperty("error")) {
                        setError(true)
                        setErrorMessage(data["error"])
                    } else {
                        setSource(source);
                    }
                }
            }
        }

        if (router.query.hasOwnProperty("uuid")) {
            if (router.query.uuid == 'create') {
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
        log.debug("editSample: RESET data...")
        //reset(data);
    }, [data]);

    // callback provided to components to update the main list of form values
    const onChange = (e, fieldId, value) => {
        log.debug('onChange', fieldId, value)
        // use a callback to find the field in the value list and update it
        setValues((currentValues) => {
            currentValues[fieldId] = value;
            return currentValues;
        });

        log.debug("Values: " + JSON.stringify(values))
        e.default
    };


    const handleSubmit = (event) => {
        //TODO: Need to remove keys where value is null
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            log.debug("Form is invalid")
        } else {
            log.debug("Form is valid")
        }


        setValidated(true);
    };


    return (
        <div>
            <Navbar className="navbar navbar-expand-lg navbar-light">
                <Container fluid={true}>
                    <Navbar.Brand href="/search">
                        {APP_TITLE}
                    </Navbar.Brand>
                    <Nav className="justify-content-end">
                        <Nav.Link href="http://localhost:8484/logout">Sign-out</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
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
                                {editMode == 'edit' &&
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
                                {/*Source ID*/}
                                <Form.Group className="mb-3" controlId="ancestors[0].hubmap_id">
                                    <Form.Label>Source ID <span
                                        className="required">* </span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Popover>
                                                    <Popover.Body>
                                                        The HuBMAP Unique identifier of the direct origin entity,
                                                        other sample or donor, where this sample came from.
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        >
                                            <QuestionCircleFill/>
                                        </OverlayTrigger>
                                    </Form.Label>
                                    <Form.Control required type="text" placeholder=""
                                                  onChange={e => onChange(e, e.target.id, e.target.value)}
                                                  defaultValue={data.ancestors?.[0].hubmap_id || ""}/>
                                </Form.Group>

                                {/*Source Information Box*/}
                                {source &&
                                    <SourceInformationBox source={source}/>
                                }

                                {/*/!*Tissue Sample Type*!/*/}
                                {/*editMode is only set when page is ready to load */}
                                {editMode &&
                                    <TissueSample data={data} editMode={editMode} onChange={onChange}/>
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
                                <Form.Group controlId="metadataFile" className="mb-3">
                                    <Form.Label>Add a Metadata file</Form.Label>
                                    <Form.Control type="file"/>
                                </Form.Group>

                                {/*/!*Image*!/*/}
                                <Form.Group controlId="imageFile" className="mb-3">
                                    <Form.Label>Add a Image file</Form.Label>
                                    <Form.Control type="file"/>
                                </Form.Group>

                                {/*/!*Thumbnail*!/*/}
                                <Form.Group controlId="thumbnailFile" className="mb-3">
                                    <Form.Label>Add a Thumbnail file</Form.Label>
                                    <Form.Control type="file"/>
                                </Form.Group>

                                <Button variant="primary" type="submit">
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
        </div>
    )
}


export default EditSample