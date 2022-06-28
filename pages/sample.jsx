import React, {useState, useEffect} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {FORM_FIELD_DEF} from "../config/formdefinitions";
import {Navbar, Nav, Container, Button} from 'react-bootstrap';
import {FiletypeJson} from 'react-bootstrap-icons';
import {getAuth, APP_TITLE} from '../config/config';
import {
    Layout
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import Description from "../components/custom/entities/sample/Description";
import DerivedDataset from "../components/custom/entities/sample/DerivedDataset";
import Tissue from "../components/custom/entities/sample/Tissue";
import Provenance from "../components/custom/entities/sample/Provenance";

function ViewSample() {
    const router = useRouter()
    const [whichPage, setWhichPage] = useState(0)
    const [form, setForm] = useState(FORM_FIELD_DEF)
    const [editMode, setEditMode] = useState(null)
    const [data, setData] = useState(null)
    const [uuid, setUuid] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [query, setQuery] = useState(router.query)

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
            console.log('sample: getting data...', uuid)
            // get the data from the api
            const response = await fetch("/api/find?uuid=" + uuid, requestOptions);
            // convert the data to json
            const data = await response.json();

            console.log('sample: Got data', data)
            if (data.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(data["error"])
            } else {
                // set state with the result
                setData(data);
            }
        }

        if (router.query.hasOwnProperty("uuid")) {
            // call the function
            fetchData(router.query.uuid)
                // make sure to catch any error
                .catch(console.error);
            ;
        } else {
            setData({});
        }
    }, [router]);

    // effect runs when user state is updated
    useEffect(() => {
        // reset form with user data
        console.log("sample: RESET data...")
        //reset(data);
    }, [data]);


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
                <Layout
                    header={
                        <div>
                            <h4>Sample</h4>
                            {/*TODO: Change to sennet_id*/}
                            <h3>{data.hubmap_id}</h3>
                        </div>
                    }
                    sideContent={
                        <div>
                            <div className="sui-facet">
                                <div>
                                    <div className="sui-facet__title">Sections</div>
                                    <ul className="sui-single-option-facet">
                                        <li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link" href="#Derived-Dataset">Derived
                                            Dataset</a>
                                        </li>
                                        <li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link" href="#Tissue">Tissue</a>
                                        </li>
                                        <li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link" href="#Provenance">Provenance</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    }

                    bodyHeader={
                        <div className="ms-auto pb-2">
                            <Button href="" variant="primary"><FiletypeJson/></Button>{' '}
                        </div>
                    }

                    bodyContent={
                        <div>
                            <ul className="sui-results-container">
                                {/*Description*/}
                                <Description data={data}/>

                                {/*Derived Dataset*/}
                                {data.descendant_counts && data.descendant_counts.entity_type.Dataset &&
                                    <DerivedDataset data={data}/>
                                }

                                {/*Tissue*/}
                                <Tissue data={data}/>

                                {/*Provenance*/}
                                <Provenance data={data}/>

                            </ul>
                        </div>
                    }

                />

            }

            {!data &&
                <div className="text-center p-3">
                    <span className="spinner-border spinner-border-lg align-center alert alert-info">Loading, please wait...</span>
                </div>
            }
        </div>
    )
}


export default ViewSample