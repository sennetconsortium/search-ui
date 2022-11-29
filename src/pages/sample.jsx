import React, {useContext, useEffect, useState} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Button} from 'react-bootstrap';
import {FiletypeJson} from 'react-bootstrap-icons';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import Description from "../components/custom/entities/sample/Description";
import DerivedDataset from "../components/custom/entities/sample/DerivedDataset";
import AncestorInformationBox from "../components/custom/edit/sample/AncestorInformationBox";
import Attribution from "../components/custom/entities/sample/Attribution";
import log from "loglevel";
import {displayBodyHeader, fetchEntity, getRequestHeaders} from "../components/custom/js/functions";
import AppNavbar from "../components/custom/layout/AppNavbar";
import {get_write_privilege_for_group_uuid} from "../lib/services";
import Unauthorized from "../components/custom/layout/Unauthorized";
import Protocols from "../components/custom/entities/sample/Protocols";
import AppFooter from "../components/custom/layout/AppFooter";
import Header from "../components/custom/layout/Header";
import Spinner from "../components/custom/Spinner";
import AppContext from "../context/AppContext";
import Alert from "../components/custom/Alert";
import Provenance from "../components/custom/entities/Provenance";

function ViewSample() {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [source, setSource] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [hasWritePrivilege, setHasWritePrivilege] = useState(false)

    const {isRegisterHidden, isLoggedIn, isUnauthorized, isAuthorizing} = useContext(AppContext)

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
                setData(false)
            } else {
                // set state with the result
                setData(data);
                if (data.hasOwnProperty("immediate_ancestors")) {
                    await fetchSource(data.immediate_ancestors[0].uuid);
                }
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

    const fetchSource = async (sourceId) => {
        let source = await fetchEntity(sourceId);
        if (source.hasOwnProperty("error")) {
            setError(true)
            setErrorMessage(source["error"])
        } else {
            setSource(source);
        }
    }

    if ((isAuthorizing() || isUnauthorized()) && !data) {
        return (
            data == null ? <Spinner/> : <Unauthorized/>
        )
    } else {
        return (
            <>
                {data && <Header title={`${data.sennet_id} | Sample | SenNet`}></Header>}

                <AppNavbar hidden={isRegisterHidden} signoutHidden={false}/>

                {error &&
                    <Alert message={errorMessage}/>
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
                                            {!!(data.descendant_counts && Object.keys(data.descendant_counts).length && data.descendant_counts.entity_type.Dataset) &&
                                                <li className="sui-single-option-facet__item"><a
                                                    className="sui-single-option-facet__link"
                                                    href="#Derived-Datasets">Derived
                                                    Datasets</a>
                                                </li>
                                            }
                                            {<li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link" href="#Provenance">Provenance</a>
                                        </li>}
                                            {data.ancestors &&
                                                <li className="sui-single-option-facet__item"><a
                                                    className="sui-single-option-facet__link"
                                                    href="#Ancestor">Ancestor</a>
                                                </li>
                                            }
                                            {data.protocol_url &&
                                                <li className="sui-single-option-facet__item"><a
                                                    className="sui-single-option-facet__link"
                                                    href="#Protocols">Protocols</a>
                                                </li>
                                            }
                                            {/*{!!(data.source && Object.keys(data.source).length && 'mapped_metadata' in data.source) &&*/}
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
                                <h3>{data.sennet_id}</h3>
                                <div className="d-flex justify-content-between mb-2">
                                    <div className="entity_subtitle link_with_icon">
                                        {displayBodyHeader(data.display_subtype)}

                                        {data.lab_tissue_sample_id &&
                                            <>
                                                <span className="mx-2">|</span>
                                                {data.lab_tissue_sample_id}
                                            </>
                                        }
                                    </div>
                                    <div>
                                        {hasWritePrivilege &&
                                            <Button className="ms-3" href={`/edit/sample?uuid=${data.uuid}`}
                                                    variant="outline-primary rounded-0">Edit</Button>}{' '}
                                        <Button className="ms-3" href={`/api/json/sample?uuid=${data.uuid}`}
                                                variant="outline-primary rounded-0"><FiletypeJson/></Button>
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
                                    {data &&
                                    <Provenance nodeData={data}/>
                                    }

                                    {/*Source Information Box*/}
                                    {source &&
                                        <AncestorInformationBox ancestor={source}/>
                                    }

                                    {/*Protocols*/}
                                    {data.protocol_url &&
                                        <Protocols protocol_url={data.protocol_url}/>
                                    }

                                    {/*Metadata*/}
                                    {/*{!!(data.source && Object.keys(data.source).length && 'mapped_metadata' in data.source) &&*/}
                                    {/*    <Metadata metadataKey='source.' data={data.source.mapped_metadata}*/}
                                    {/*              filename={data.sennet_id}/>*/}
                                    {/*}*/}

                                    {/*Attribution*/}
                                    <Attribution data={data}/>

                                </ul>
                            </div>
                        }

                    />

                }
                <AppFooter/>
            </>
        )
    }
}


export default ViewSample