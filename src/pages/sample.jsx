import React, {useContext, useEffect, useState} from "react";
import {useRouter} from 'next/router';
import Description from "../components/custom/entities/sample/Description";
import DerivedDataset from "../components/custom/entities/sample/DerivedDataset";
import AncestorInformationBox from "../components/custom/edit/sample/AncestorInformationBox";
import Attribution from "../components/custom/entities/sample/Attribution";
import log from "loglevel";
import {fetchEntity, getRequestHeaders} from "../components/custom/js/functions";
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
import {ENTITIES} from "../config/constants";
import {EntityViewHeader} from "../components/custom/layout/entity/ViewHeader";
import {List} from "react-bootstrap-icons";


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
                    <>
                        <div className="container-fluid">
                            <div className="row flex-nowrap">
                                <div className="col-auto p-0">
                                    <div id="sidebar" className="collapse collapse-horizontal border-end sticky-top custom-sticky">
                                        <div id="sidebar-nav"
                                             className="list-group border-0 rounded-0 text-sm-start vh-100">
                                            <a href="#Summary"
                                               className="list-group-item border-end-0 d-inline-block text-truncate"
                                               data-bs-parent="#sidebar"><span>Summary</span> </a>

                                            {!!(data.descendant_counts && Object.keys(data.descendant_counts).length && data.descendant_counts.entity_type.Dataset) &&
                                                <a href="#Derived-Datasets"
                                                   className="list-group-item border-end-0 d-inline-block text-truncate"
                                                   data-bs-parent="#sidebar"><span>Derived</span></a>
                                            }
                                            <a href="#Provenance"
                                               className="list-group-item border-end-0 d-inline-block text-truncate"
                                               data-bs-parent="#sidebar"><span>Provenance</span></a>
                                            <a href="#Protocols"
                                               className="list-group-item border-end-0 d-inline-block text-truncate"
                                               data-bs-parent="#sidebar"><span>Protocols</span></a>
                                            <a href="#Attribution"
                                               className="list-group-item border-end-0 d-inline-block text-truncate"
                                               data-bs-parent="#sidebar"><span>Attribution</span></a>
                                        </div>
                                    </div>
                                </div>

                                <main className="col m-3">
                                    <a href="#" data-bs-target="#sidebar" data-bs-toggle="collapse"
                                       className="btn btn-outline-primary rounded-0 link_with_icon"><List/>Sections</a>

                                    <EntityViewHeader data={data} entity={Object.keys(ENTITIES)[1]}
                                                      hasWritePrivilege={hasWritePrivilege} idKey='sample_category'/>


                                    <div className="row">
                                        <div className="col-12">
                                            {/*Description*/}
                                            <Description primaryDateTitle="Creation Date"
                                                         primaryDate={data.created_timestamp}
                                                         secondaryDateTitle="Modification Date"
                                                         secondaryDate={data.last_modified_timestamp}
                                            />

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
                                        </div>
                                    </div>
                                </main>
                            </div>
                        </div>
                    </>
                }
                <AppFooter/>
            </>
        )
    }
}


export default ViewSample