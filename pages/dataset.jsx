import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Container, Nav, Navbar} from 'react-bootstrap';
import {BoxArrowUpRight, CircleFill, FiletypeJson} from 'react-bootstrap-icons';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import Description from "../components/custom/entities/sample/Description";
import Provenance from "../components/custom/entities/sample/Provenance";
import Metadata from "../components/custom/entities/sample/Metadata";
import Contributors from "../components/custom/entities/dataset/Contributors";
import Attribution from "../components/custom/entities/sample/Attribution";
import log from "loglevel";
import {getRequestHeaders, getStatusColor} from "../components/custom/js/functions";
import AppNavbar from "../components/custom/layout/AppNavbar";

function ViewDataset() {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const handleQueryChange = (event) => {
        log.debug("CHANGE")
        log.debug(event)
    }

    useEffect(() => {
        window.addEventListener('hashchange', handleQueryChange);
        return () => {
            window.removeEventListener('hashchange', handleQueryChange);
        }
    },);

    // only executed on init rendering, see the []
    useEffect(() => {
        // declare the async data fetching function
        const fetchData = async (uuid) => {
            log.debug('dataset: getting data...', uuid)
            // get the data from the api
            const response = await fetch("/api/find?uuid=" + uuid, getRequestHeaders());
            // convert the data to json
            const data = await response.json();

            log.debug('dataset: Got data', data)
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
            setData(null);
        }
    }, [router]);

    // effect runs when user state is updated
    useEffect(() => {
        // reset form with user data
        log.debug("dataset: RESET data...")
        //reset(data);
    }, [data]);


    return (
        <div>
           <AppNavbar/>

            {error &&
                <div className="alert alert-warning" role="alert">{errorMessage}</div>
            }
            {data && !error &&
                <Layout
                    sideContent={
                        <div>
                            <div className="sui-facet">
                                <div>
                                    <div className="sui-facet__title">Sections</div>
                                    <ul className="sui-single-option-facet">
                                        <li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link" href="#Summary">Summary</a>
                                        </li>
                                        <li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link" href="#Provenance">Provenance</a>
                                        </li>
                                        {!!(data.metadata && Object.keys(data.metadata).length && 'metadata' in data.metadata) &&
                                            <li className="sui-single-option-facet__item"><a
                                                className="sui-single-option-facet__link" href="#Metadata">Metadata</a>
                                            </li>
                                        }
                                        <li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link" href="#Files">Files</a>
                                        </li>
                                        <li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link"
                                            href="#Contributors">Contributors</a>
                                        </li>
                                        <li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link"
                                            href="#Attribution">Attribution</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    }

                    bodyHeader={
                        <div style={{width: '100%'}}>
                            <h4>Dataset</h4>
                            {/*TODO: Change to sennet_id*/}
                            <h3>{data.hubmap_id}</h3>

                            <div className="d-flex justify-content-between mb-2">
                                {data.origin_sample &&
                                    <a href={data.doi_url} className="entity_subtitle link_with_icon">
                                            <span
                                                className="me-1">{data.mapped_data_types[0]} | {data.origin_sample.mapped_organ} |
                                                doi:{data.registered_doi}</span> <BoxArrowUpRight/>

                                    </a>
                                }
                                <div className="entity_subtitle link_with_icon">
                                    <CircleFill
                                        className={`me-1 ${getStatusColor(data.status)}`}/> {data.status} | {data.mapped_data_access_level} Access
                                    | <Button href={`/api/json/dataset?uuid=${data.uuid}`} className="ms-1"
                                              variant="primary"><FiletypeJson/></Button>
                                </div>
                            </div>
                        </div>
                    }

                    bodyContent={
                        <div>
                            <ul className="sui-results-container">
                                {/*Description*/}
                                <Description primaryDateTitle="Publication Date" primaryDate={data.published_timestamp}
                                             secondaryDateTitle="Modification Date"
                                             secondaryDate={data.last_modified_timestamp}
                                             data={data}/>

                                {/*Provenance*/}
                                {!!(data.ancestor_counts && Object.keys(data.ancestor_counts).length) &&
                                    <Provenance data={data}/>
                                }

                                {/*Metadata*/}
                                {!!(data.metadata && Object.keys(data.metadata).length && 'metadata' in data.metadata) &&
                                    <Metadata data={data.metadata.metadata} filename={data.hubmap_id}/>
                                }

                                {/*Files*/}
                                {/*TODO: Need to create files section*/}

                                {/*Contributors*/}
                                {!!(data.contributors && Object.keys(data.contributors).length) &&
                                    <Contributors data={data.contributors}/>
                                }

                                {/*Attribution*/}
                                <Attribution data={data}/>

                            </ul>
                        </div>
                    }

                />

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


export default ViewDataset