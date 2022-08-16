import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Button} from 'react-bootstrap';
import {FiletypeJson} from 'react-bootstrap-icons';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import Description from "../components/custom/entities/sample/Description";
import DerivedDataset from "../components/custom/entities/sample/DerivedDataset";
import Tissue from "../components/custom/entities/sample/Tissue";
// import Provenance from "../components/custom/entities/sample/Provenance";
import SourceInformationBox from "../components/custom/edit/sample/SourceInformationBox";
import Metadata from "../components/custom/entities/sample/Metadata";
import Attribution from "../components/custom/entities/sample/Attribution";
import log from "loglevel";
import {getRequestHeaders} from "../components/custom/js/functions";
import AppNavbar from "../components/custom/layout/AppNavbar";

function ViewSample() {
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
            log.debug('sample: getting data...', uuid)
            // get the data from the api
            const response = await fetch("/api/find?uuid=" + uuid, getRequestHeaders());
            // convert the data to json
            const data = await response.json();

            log.debug('sample: Got data', data)
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
        log.debug("sample: RESET data...")
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
                                        {!!(data.descendant_counts && Object.keys(data.descendant_counts).length && data.descendant_counts.entity_type.Dataset) &&
                                            <li className="sui-single-option-facet__item"><a
                                                className="sui-single-option-facet__link" href="#Derived-Datasets">Derived
                                                Datasets</a>
                                            </li>
                                        }
                                        {/* <li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link" href="#Provenance">Provenance</a>
                                        </li> */}
                                        {data.ancestors &&
                                            <li className="sui-single-option-facet__item"><a
                                                className="sui-single-option-facet__link" href="#SourceInformationBox">Source</a>
                                            </li>
                                        }
                                        <li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link" href="#Protocols">Protocols</a>
                                        </li>
                                        {/*{!!(data.donor && Object.keys(data.donor).length && 'mapped_metadata' in data.donor) &&*/}
                                        {/*    <li className="sui-single-option-facet__item"><a*/}
                                        {/*        className="sui-single-option-facet__link" href="#Metadata">Metadata</a>*/}
                                        {/*    </li>*/}
                                        {/*}*/}
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
                            <h4>Sample</h4>
                            {/*TODO: Change to sennet_id*/}
                            <h3>{data.hubmap_id}</h3>
                            <div className="d-flex justify-content-between mb-2" style={{display: 'inline-block'}}>
                                {data.origin_sample &&
                                    <div className="entity_subtitle">
                                        {data.origin_sample.mapped_organ} | {data.mapped_specimen_type}
                                    </div>
                                }
                                <div>
                                    <Button href={`/edit/sample?uuid=${data.uuid}`} variant="primary">Edit</Button>{' '}
                                    <Button href={`/api/json/sample?uuid=${data.uuid}`}
                                            variant="primary"><FiletypeJson/></Button>
                                </div>
                            </div>

                        </div>
                    }

                    bodyContent={
                        <div>
                            <ul className="sui-results-container">
                                {/*Description*/}
                                <Description primaryDateTitle="Creation Date" primaryDate={data.created_timestamp}
                                             secondaryDateTitle="Modification Date"
                                             secondaryDate={data.last_modified_timestamp}
                                             data={data}/>

                                {/*Derived Dataset*/}
                                {!!(data.descendant_counts && Object.keys(data.descendant_counts).length && data.descendant_counts.entity_type.Dataset) &&
                                    <DerivedDataset data={data}/>
                                }


                                {/*Provenance*/}
                                {/* {!!(data.ancestor_counts && Object.keys(data.ancestor_counts).length) &&
                                    <Provenance data={  }/>
                                } */}

                                {/*Source Information Box*/}
                                {data.ancestors &&
                                    <SourceInformationBox source={data}/>
                                }

                                {/*Protocols*/}
                                {/*TODO: Need to add protocols section*/}

                                {/*Metadata*/}
                                {/*/!*TODO: change donor to source*!/*/}
                                {/*{!!(data.donor && Object.keys(data.donor).length && 'mapped_metadata' in data.donor) &&*/}
                                {/*    <Metadata metadataKey='donor.' data={data.donor.mapped_metadata}*/}
                                {/*              filename={data.hubmap_id}/>*/}
                                {/*}*/}

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


export default ViewSample