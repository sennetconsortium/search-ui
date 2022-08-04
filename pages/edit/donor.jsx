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
import {getRequestOptions} from "../../components/custom/js/functions";
import AppNavbar from "../../components/custom/layout/AppNavbar";

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

    // only executed on init rendering, see the []
    useEffect(() => {

        log.debug('ROUTER CHANGED: useEffect: query:', router.query.uuid)
        setQuery(router.query)

        // declare the async data fetching function
        const fetchData = async (uuid) => {
            log.debug('editSource: getting data...', uuid)
            // get the data from the api
            const response = await fetch("/api/find?uuid=" + uuid, getRequestOptions());
            // convert the data to json
            const data = await response.json();

            log.debug('editSource: Got data', data)
            if (data.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(data["error"])
            } else {
                // set state with the result
                setData(data);
                setValues(data);
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
        //TODO: Need to remove keys where value is null. This will ensure that 'other' fields don't get added unnecessarily
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
                                {/*Lab's Source Non-PHI ID*/}
                                <Form.Group className="mb-3" controlId="lab_donor_id">
                                    <Form.Label>Lab's Source Non-PHI ID <span className="required">* </span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Popover>
                                                    <Popover.Body>
                                                        An identifier used by the lab to identify the source. This field
                                                        will be entered by the user.
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        >
                                            <QuestionCircleFill/>
                                        </OverlayTrigger>
                                    </Form.Label>
                                    <Form.Control type="text" required
                                                  placeholder="An non-PHI ID used by the lab when referring to the source."
                                                  defaultValue={data.lab_donor_id}
                                                  onChange={e => onChange(e, e.target.id, e.target.value)}/>
                                </Form.Group>

                                {/*Deidentified Name*/}
                                <Form.Group className="mb-3" controlId="label">
                                    <Form.Label>Deidentified Name <span className="required">* </span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Popover>
                                                    <Popover.Body>
                                                        A deidentified name used by the lab to identify the source (e.g.
                                                        SenNet Source 1).
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        >
                                            <QuestionCircleFill/>
                                        </OverlayTrigger>
                                    </Form.Label>
                                    <Form.Control type="text" required
                                                  placeholder="A deidentified name used by the lab to identify the source (e.g. SenNet Source 1)."
                                                  defaultValue={data.label}
                                                  onChange={e => onChange(e, e.target.id, e.target.value)}/>
                                </Form.Group>


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
                                <Form.Group controlId="metadata-file" className="mb-3">
                                    <Form.Label>Add a Metadata file</Form.Label>
                                    <Form.Control type="file"/>
                                </Form.Group>

                                {/*/!*Image*!/*/}
                                <Form.Group controlId="image-file" className="mb-3">
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


export default EditSource