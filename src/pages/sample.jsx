import React, {useContext, useEffect, useState} from "react";
import {useRouter} from 'next/router';
import Description from "../components/custom/entities/sample/Description";
import DerivedDataset from "../components/custom/entities/sample/DerivedDataset";
import Attribution from "../components/custom/entities/sample/Attribution";
import log from "loglevel";
import {getRequestHeaders} from "../components/custom/js/functions";
import AppNavbar from "../components/custom/layout/AppNavbar";
import {get_write_privilege_for_group_uuid} from "../lib/services";
import Unauthorized from "../components/custom/layout/Unauthorized";
import Protocols from "../components/custom/entities/sample/Protocols";
import AppFooter from "../components/custom/layout/AppFooter";
import Header from "../components/custom/layout/Header";
import Spinner from "../components/custom/Spinner";
import AppContext from "../context/AppContext";
import Alert from 'react-bootstrap/Alert';
import Provenance from "../components/custom/entities/Provenance";
import {ENTITIES} from "../config/constants";
import {EntityViewHeader} from "../components/custom/layout/entity/ViewHeader";
import {List} from "react-bootstrap-icons";


function ViewSample() {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [ancestors, setAncestors] = useState(null)
    const [descendants, setDescendants] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [hasWritePrivilege, setHasWritePrivilege] = useState(false)

    const {isRegisterHidden, isLoggedIn, isUnauthorized, isAuthorizing, _t} = useContext(AppContext)

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
                    <Alert variant='warning'>{_t(errorMessage)}</Alert>
                }
                {data && !error &&
                    <>
                        <div className="container-fluid">
                            <div className="row flex-nowrap entity_body">
                                <div className="col-auto p-0">
                                    <div id="sidebar"
                                         className="collapse collapse-horizontal sticky-top custom-sticky">
                                        <ul id="sidebar-nav"
                                            className="nav list-group rounded-0 text-sm-start">
                                            <li className="nav-item">
                                                <a href="#Summary"
                                                   className="nav-link "
                                                   data-bs-parent="#sidebar">Summary</a>
                                            </li>
                                            {!!(data.mapped_metadata && Object.keys(data.mapped_metadata).length) &&
                                                <li className="nav-item">
                                                    <a href="#Metadata"
                                                       className="nav-link "
                                                       data-bs-parent="#sidebar">Metadata</a>
                                                </li>
                                            }
                                            {!!(data.descendant_counts && Object.keys(data.descendant_counts).length && data.descendant_counts.entity_type.Dataset) &&
                                                <li className="nav-item">
                                                    <a href="#Derived-Datasets"
                                                       className="nav-link "
                                                       data-bs-parent="#sidebar">Derived</a>
                                                </li>
                                            }
                                            <li className="nav-item">
                                                <a href="#Provenance"
                                                   className="nav-link"
                                                   data-bs-parent="#sidebar">Provenance</a>
                                            </li>
                                            <li className="nav-item">
                                                <a href="#Protocols"
                                                   className="nav-link"
                                                   data-bs-parent="#sidebar">Protocols</a>
                                            </li>
                                            <li className="nav-item">
                                                <a href="#Attribution"
                                                   className="nav-link"
                                                   data-bs-parent="#sidebar">Attribution</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <main className="col m-md-3 entity_details">
                                    <div className="d-none d-md-block sticky-top" id="sections-button">
                                        <a href="#" data-bs-target="#sidebar" data-bs-toggle="collapse"
                                           className="btn btn-outline-primary rounded-0 icon_inline mb-2"><List/></a>
                                    </div>

                                    <EntityViewHeader data={data} entity={Object.keys(ENTITIES)[1]}
                                                      hasWritePrivilege={hasWritePrivilege}
                                                      uniqueHeader={data.sample_category}/>

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