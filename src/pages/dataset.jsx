import React, {useContext, useEffect, useState} from "react";
import {useRouter} from 'next/router';
import {BoxArrowUpRight, CircleFill, List} from 'react-bootstrap-icons';
import Description from "../components/custom/entities/sample/Description";
import AncestorInformationBox from "../components/custom/entities/sample/AncestorInformationBox";
import Attribution from "../components/custom/entities/sample/Attribution";
import log from "loglevel";
import {fetchEntity, getOrganTypeFullName, getRequestHeaders, getStatusColor} from "../components/custom/js/functions";
import AppNavbar from "../components/custom/layout/AppNavbar";
import {get_write_privilege_for_group_uuid} from "../lib/services";
import Unauthorized from "../components/custom/layout/Unauthorized";
import AppFooter from "../components/custom/layout/AppFooter";
import Header from "../components/custom/layout/Header";
import Files from "../components/custom/entities/dataset/Files";
import Spinner from "../components/custom/Spinner";
import AppContext from "../context/AppContext";
import Alert from "../components/custom/Alert";
import Provenance from "../components/custom/entities/Provenance";
import {ENTITIES} from "../config/constants";
import Metadata from "../components/custom/entities/sample/Metadata";
import Contributors from "../components/custom/entities/dataset/Contributors";
import {EntityViewHeaderButtons} from "../components/custom/layout/entity/ViewHeader";


function ViewDataset() {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [ancestors, setAncestors] = useState(null)
    const [descendants, setDescendants] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [hasWritePrivilege, setHasWritePrivilege] = useState(false)

    const {isRegisterHidden, isLoggedIn, isUnauthorized, isAuthorizing} = useContext(AppContext)

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
                setData(false)
            } else {
                // set state with the result
                setData(data);
                if (data.hasOwnProperty("ancestors")) {
                    await fetchLineage(data.ancestors, setAncestors);
                }
                if (data.hasOwnProperty("descendants")) {
                    await fetchLineage(data.descendants, setDescendants);
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

    const fetchLineage = async (ancestors, fetch) => {
        let new_ancestors = []
        for (const ancestor of ancestors) {
            let complete_ancestor = await fetchEntity(ancestor.uuid);
            if (complete_ancestor.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(complete_ancestor["error"])
            } else {
                new_ancestors.push(complete_ancestor)
            }
        }
        fetch(new_ancestors)
    }

    if ((isAuthorizing() || isUnauthorized()) && !data) {
        return (
            data == null ? <Spinner/> : <Unauthorized/>
        )
    } else {
        return (
            <>
                {data && <Header title={`${data.sennet_id} | Dataset | SenNet`}></Header>}

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
                                            <a href="#Provenance"
                                               className="list-group-item border-end-0 d-inline-block text-truncate"
                                               data-bs-parent="#sidebar"><span>Provenance</span></a>
                                            <a href="#Files"
                                               className="list-group-item border-end-0 d-inline-block text-truncate"
                                               data-bs-parent="#sidebar"><span>Files</span> </a>

                                            {!!(data.metadata && Object.keys(data.metadata).length && 'metadata' in data.metadata) &&
                                                <a href="#Metadata"
                                                   className="list-group-item border-end-0 d-inline-block text-truncate"
                                                   data-bs-parent="#sidebar"><span>Metadata</span></a>
                                            }

                                            {!!(data.contributors && Object.keys(data.contributors).length) &&
                                                <a href="#Contributors"
                                                   className="list-group-item border-end-0 d-inline-block text-truncate"
                                                   data-bs-parent="#sidebar"><span>Contributors</span></a>
                                            }
                                            <a href="#Attribution"
                                               className="list-group-item border-end-0 d-inline-block text-truncate"
                                               data-bs-parent="#sidebar"><span>Attribution</span></a>
                                        </div>
                                    </div>
                                </div>

                                <main className="col m-3">
                                    <a href="#" data-bs-target="#sidebar" data-bs-toggle="collapse"
                                       className="btn btn-outline-primary rounded-0 link_with_icon"><List/>Sections</a>

                                    <div style={{width: '100%'}}>
                                        <h4>Dataset</h4>
                                        <h3>{data.sennet_id}</h3>

                                        <div className="d-flex justify-content-between mb-2">
                                            <div className="entity_subtitle link_with_icon">
                                                {data.data_types &&
                                                    <>
                                                        {data.data_types[0]}
                                                    </>
                                                }
                                                {data.lab_dataset_id &&
                                                    <>
                                                        <span className="mx-2">|</span>
                                                        {getOrganTypeFullName(data.origin_sample.organ)}
                                                    </>
                                                }

                                                {data.doi_url &&
                                                    <>
                                                        |
                                                        <a href={data.doi_url} className="ms-1 link_with_icon">
                                                            <span className="me-1">doi:{data.registered_doi}</span>
                                                            <BoxArrowUpRight/>
                                                        </a>
                                                    </>
                                                }
                                            </div>
                                            <div className="entity_subtitle link_with_icon">
                                                <CircleFill
                                                    className={`me-1 text-${getStatusColor(data.status)}`}/>
                                                <div className={'m-2'}>{data.status}</div>
                                                |
                                                {/*TODO: Add some access level?  | {data.mapped_data_access_level} Access*/}

                                                <EntityViewHeaderButtons data={data} entity={Object.keys(ENTITIES)[2]}
                                                                         hasWritePrivilege={hasWritePrivilege}/>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="row">
                                        <div className="col-12">
                                            {/*Description*/}
                                            <Description primaryDateTitle="Publication Date"
                                                         primaryDate={data.published_timestamp}
                                                         secondaryDateTitle="Modification Date"
                                                         secondaryDate={data.last_modified_timestamp}
                                                         data={data}/>

                                            {/*Provenance*/}
                                            {data && ancestors && descendants &&
                                                <Provenance nodeData={data} ancestors={ancestors} descendants={descendants}/>
                                            }

                                            {/*Files*/}
                                            <Files sennet_id={data.sennet_id}/>


                                            {/*Metadata*/}
                                            {!!(data.metadata && Object.keys(data.metadata).length && 'metadata' in data.metadata) &&
                                                <Metadata data={data.metadata.metadata} filename={data.sennet_id}/>
                                            }

                                            {/*Contributors*/}
                                            {!!(data.contributors && Object.keys(data.contributors).length) &&
                                                <Contributors data={data.contributors}/>
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


export default ViewDataset