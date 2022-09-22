import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Button} from 'react-bootstrap';
import {FiletypeJson} from 'react-bootstrap-icons';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import Description from "../components/custom/entities/sample/Description";
// import Provenance from "../components/custom/entities/sample/Provenance";
import Metadata from "../components/custom/entities/sample/Metadata";
import Attribution from "../components/custom/entities/sample/Attribution";
import log from "loglevel";
import {getRequestHeaders} from "../components/custom/js/functions";
import DerivedDataset from "../components/custom/entities/sample/DerivedDataset";
import AppNavbar from "../components/custom/layout/AppNavbar";
import {get_read_write_privileges, get_write_privilege_for_group_uuid} from "../lib/services";
import {getCookie} from "cookies-next";
import Unauthorized from "../components/custom/layout/Unauthorized";
import Protocols from "../components/custom/entities/sample/Protocols";
import AppFooter from "../components/custom/layout/AppFooter";

function ViewSource() {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [hasWritePrivilege, setHasWritePrivilege] = useState(false)
    const [authorized, setAuthorized] = useState(true)

    const handleQueryChange = (event) => {
        log.debug("CHANGE")
        log.debug(event)
    }

    get_read_write_privileges().then(response => {
        setAuthorized(response.read_privs)
    }).catch(error => log.error(error))

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
            log.debug('source: getting data...', uuid)
            // get the data from the api
            const response = await fetch("/api/find?uuid=" + uuid, getRequestHeaders());
            // convert the data to json
            const data = await response.json();

            log.debug('source: Got data', data)
            if (data.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(data["error"])
            } else {
                // set state with the result
                setData(data);
                get_write_privilege_for_group_uuid(data.group_uuid).then(response => {
                    setHasWritePrivilege(response.has_write_privs)
                }).catch(log.error)
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
        log.debug("source: RESET data...")
        //reset(data);
    }, [data]);

    if (authorized && getCookie('isAuthenticated')) {
        return (
            <>
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
                                                className="sui-single-option-facet__link"
                                                href="#Summary">Summary</a>
                                            </li>
                                            {!!(data.mapped_metadata && Object.keys(data.mapped_metadata).length) &&
                                                <li className="sui-single-option-facet__item"><a
                                                    className="sui-single-option-facet__link"
                                                    href="#Metadata">Metadata</a>
                                                </li>
                                            }
                                            {!!(data.descendant_counts && Object.keys(data.descendant_counts).length) &&
                                                <li className="sui-single-option-facet__item"><a
                                                    className="sui-single-option-facet__link"
                                                    href="#Derived-Datasets">Derived</a>
                                                </li>
                                            }
                                            {/* <li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link" href="#Provenance">Provenance</a>
                                        </li> */}
                                            {data.ancestors &&
                                                <li className="sui-single-option-facet__item"><a
                                                    className="sui-single-option-facet__link"
                                                    href="#SourceInformationBox">Ancestor</a>
                                                </li>
                                            }
                                            {data.protocol_url &&
                                                <li className="sui-single-option-facet__item"><a
                                                    className="sui-single-option-facet__link"
                                                    href="#Protocols">Protocols</a>
                                                </li>
                                            }
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
                                <h4>Source</h4>
                                <h3>{data.sennet_id}</h3>

                                <div className="d-flex justify-content-between mb-2">
                                    <div className="entity_subtitle link_with_icon">
                                        {data.source_type}
                                    </div>
                                    <div>
                                        {hasWritePrivilege && <Button className="ms-3" href={`/edit/source?uuid=${data.uuid}`}
                                                                      variant="outline-primary rounded-0">Edit</Button>}{' '}
                                        <Button className="ms-3" href={`/api/json/source?uuid=${data.uuid}`} variant="outline-primary rounded-0">
                                            <FiletypeJson/>
                                        </Button>
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

                                    {/*Metadata*/}
                                    {!!(data.mapped_metadata && Object.keys(data.mapped_metadata).length) &&
                                        <Metadata data={data.mapped_metadata} filename={data.sennet_id}/>
                                    }

                                    {/*Derived Dataset*/}
                                    {!!(data.descendant_counts && Object.keys(data.descendant_counts).length) &&
                                        <DerivedDataset includeSample={true} data={data}/>
                                    }

                                    {/*Provenance*/}
                                    {/* {!!(data.ancestor_counts && Object.keys(data.ancestor_counts).length) &&
                                    <Provenance data={data}/>
                                } */}

                                    {/*Protocols*/}
                                    {data.protocol_url &&
                                        <Protocols protocol_url={data.protocol_url}/>
                                    }

                                    {/*Attribution*/}
                                    <Attribution data={data}/>

                                </ul>
                            </div>
                        }

                    />

                }
                <AppFooter/>
                {!data &&
                    <div className="text-center p-3">
                        <span>Loading, please wait...</span>
                        <br></br>
                        <span className="spinner-border spinner-border-lg align-center alert alert-info"></span>
                    </div>
                }
            </>
        )
    } else {
        return (
            <Unauthorized/>
        )
    }

}


export default ViewSource