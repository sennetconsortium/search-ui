import React, {useState, useEffect} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Navbar, Nav, Container, Form, Button, Col, Row} from 'react-bootstrap';
import {getAuth, APP_TITLE} from '../../config/config';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import {FORM_FIELD_DEF} from "../../config/formdefinitions";
import styles from "../../components/custom/table.module.css";
import {TISSUE_TYPES} from "../../config/constants"
import TissueSample from "../../components/custom/edit/sample/TissueSample";

function EditSample() {
    const router = useRouter()
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(null)
    const [data, setData] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [query, setQuery] = useState(router.query)
    const [values, setValues] = useState({});


    // only executed on init rendering, see the []
    useEffect(() => {

        console.log('ROUTER CHANGED: useEffect: query:', router.query.uuid)
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
            console.log('editSample: getting data...', uuid)
            // get the data from the api
            const response = await fetch("/api/find?uuid=" + uuid, requestOptions);
            // convert the data to json
            const data = await response.json();

            console.log('editSample: Got data', data)
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
        }
    }, [router]);

    // effect runs when user state is updated
    useEffect(() => {
        // reset form with user data
        console.log("editSample: RESET data...")
        //reset(data);
    }, [data]);

    // callback provided to components to update the main list of form values
    const onChange = (e, fieldId, value) => {
        console.log('onChange', fieldId, value)
        // use a callback to find the field in the value list and update it
        setValues((currentValues) => {
            currentValues[fieldId] = value;
            return currentValues;
        });

        console.log("Values: " + JSON.stringify(values))
        e.default
    };


    const handleSubmit = (event) => {
        //TODO: Need to remove keys where value is null
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        console.log("Form is valid")
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
                                <Form.Group className="mb-3" controlId="origin_sample.hubmap_id">
                                    <Form.Label>Source ID <span
                                        className="required">*</span></Form.Label>
                                    <Form.Control required type="text" placeholder=""
                                                  onChange={e => onChange(e, e.target.id, e.target.value)}
                                                  defaultValue={data.origin_sample?.hubmap_id || ""}/>
                                </Form.Group>

                                {data.origin_sample &&
                                    <li className="sui-result w-50 mx-auto">
                                        <div className="sui-result__body">
                                            <ul className="sui-result__details">
                                                <li className={styles.element}>
                                                    <span
                                                        className={`sui-result__key`}>Source Type</span>
                                                    <span
                                                        className={`sui-result__value fluid `}>{data.origin_sample?.mapped_specimen_type || ""}</span>
                                                </li>
                                                <li className={styles.element}>
                                                    <span
                                                        className={`sui-result__key `}>Organ Type</span>
                                                    <span
                                                        className={`sui-result__value fluid `}>{data.origin_sample?.mapped_organ || ""}</span>
                                                </li>
                                                <li className={styles.element}>
                                                    <span
                                                        className={`sui-result__key `}>Submission ID</span>
                                                    <span
                                                        className={`sui-result__value fluid `}>{data.origin_sample?.submission_id || ""}</span>
                                                </li>
                                                <li className={styles.element}>
                                                    <span
                                                        className={`sui-result__key `}>Group Name</span>
                                                    <span
                                                        className={`sui-result__value fluid `}>{data.group_name || ""}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                }

                                {/*/!*Tissue Sample Type*!/*/}
                                {/*editMode is only set when page is ready to load */}
                                {editMode &&
                                    <TissueSample data={data} editMode={editMode} onChange={onChange}/>
                                }

                                {/*/!*Preparation Protocol*!/*/}
                                {/*<Form.Group className="mb-3" controlId="preparationProtocol">*/}
                                {/*    <Form.Label>Preparation Protocol <span className="required">*</span></Form.Label>*/}
                                {/*    <Form.Control type="text" required placeholder="" defaultValue={data.protocol_url}/>*/}
                                {/*</Form.Group>*/}

                                {/*/!*Lab Sample ID*!/*/}
                                {/*<Form.Group className="mb-3" controlId="labSampleId">*/}
                                {/*    <Form.Label>Lab Sample ID</Form.Label>*/}
                                {/*    <Form.Control type="text" placeholder="" defaultValue={data.lab_tissue_sample_id}/>*/}
                                {/*</Form.Group>*/}

                                {/*/!*Description*!/*/}
                                {/*<Form.Group className="mb-3" controlId="description">*/}
                                {/*    <Form.Label>Description</Form.Label>*/}
                                {/*    <Form.Control as="textarea" rows={3} defaultValue={data.description}/>*/}
                                {/*</Form.Group>*/}

                                {/*/!*Metadata*!/*/}
                                {/*<Form.Group controlId="metadataFile" className="mb-3">*/}
                                {/*    <Form.Label>Add a Metadata file</Form.Label>*/}
                                {/*    <Form.Control type="file"/>*/}
                                {/*</Form.Group>*/}

                                {/*/!*Image*!/*/}
                                {/*<Form.Group controlId="imageFile" className="mb-3">*/}
                                {/*    <Form.Label>Add a Image file</Form.Label>*/}
                                {/*    <Form.Control type="file"/>*/}
                                {/*</Form.Group>*/}

                                {/*/!*Thumbnail*!/*/}
                                {/*<Form.Group controlId="thumbnailFile" className="mb-3">*/}
                                {/*    <Form.Label>Add a Thumbnail file</Form.Label>*/}
                                {/*    <Form.Control type="file"/>*/}
                                {/*</Form.Group>*/}

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