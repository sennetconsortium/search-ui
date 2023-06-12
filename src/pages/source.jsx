import React, {useContext, useEffect, useState} from "react";
import {useRouter} from 'next/router';
import Description from "../components/custom/entities/sample/Description";
import Metadata from "../components/custom/entities/sample/Metadata";
import Attribution from "../components/custom/entities/sample/Attribution";
import log from "loglevel";
import {getRequestHeaders} from "../components/custom/js/functions";
import DerivedDataset from "../components/custom/entities/sample/DerivedDataset";
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
import {EntityViewHeader} from "../components/custom/layout/entity/ViewHeader";
import {List} from 'react-bootstrap-icons';
import SidebarBtn from "../components/SidebarBtn";

function ViewSource() {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [filteredMetadata, setFilteredMetadata] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [hasWritePrivilege, setHasWritePrivilege] = useState(false)
    const {isRegisterHidden, isLoggedIn, isUnauthorized, isAuthorizing, _t, cache} = useContext(AppContext);

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
                setData(false)
                setFilteredMetadata(null)
            } else {
                // set state with the result
                setData(data);
                setFilteredMetadata(getFilteredMetadata(data))
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

    console.log("Test cache in source: ", cache)
    
    const metadataFilters = {
        // source_type: accepted metadata fields
        Mouse: ['strain', 'sex', 'is_embryo']
    }

    const getFilteredMetadata = (data) => {
        if (metadataFilters.hasOwnProperty(data.source_type)) {
            const acceptedFields = metadataFilters[data.source_type]
            const metadata = {}
            acceptedFields.forEach(field => {
                if (data.metadata.hasOwnProperty(field)) {
                    metadata[field] = data.metadata[field]
                }
            })
            return metadata
        }
        return null
    }

    if ((isAuthorizing() || isUnauthorized()) && !data) {
        return (
            data == null ? <Spinner/> : <Unauthorized/>
        )
    } else {
        return (
            <>
                {data && <Header title={`${data.sennet_id} | Source | SenNet`}></Header>}

                <AppNavbar hidden={isRegisterHidden} signoutHidden={false}/>

                {error &&
                    <div><Alert variant='warning'>{_t(errorMessage)}</Alert></div>
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
                                            {filteredMetadata &&
                                                <li className="nav-item">
                                                    <a href="#Metadata"
                                                       className="nav-link"
                                                       data-bs-parent="#sidebar">Metadata</a>
                                                </li>
                                            }
                                            <li className="nav-item">
                                                <a href="#Attribution"
                                                   className="nav-link"
                                                   data-bs-parent="#sidebar">Attribution</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <main className="col m-md-3 entity_details">
                                    <SidebarBtn />

                                    <EntityViewHeader data={data} entity={cache.entities.source.toLowerCase()}
                                                      hasWritePrivilege={hasWritePrivilege}/>

                                    <div className="row">
                                        <div className="col-12">
                                            {/*Description*/}
                                            <Description primaryDateTitle="Creation Date"
                                                         primaryDate={data.created_timestamp}
                                                         secondaryDateTitle="Modification Date"
                                                         secondaryDate={data.last_modified_timestamp}
                                            />

                                            {/*Derived Dataset*/}
                                            {!!(data.descendant_counts && Object.keys(data.descendant_counts).length) &&
                                                <DerivedDataset includeSample={true} data={data}/>
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
                                            {filteredMetadata && 
                                                <Metadata data={filteredMetadata}
                                                          metadataKey=""
                                                          filename={data.sennet_id}/>
                                            } 

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


export default ViewSource