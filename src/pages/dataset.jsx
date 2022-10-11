import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Button} from 'react-bootstrap';
import {BoxArrowUpRight, CircleFill, FiletypeJson} from 'react-bootstrap-icons';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import Description from "../components/custom/entities/sample/Description";
// import Provenance from "../components/custom/entities/sample/Provenance";
import AncestorInformationBox from "../components/custom/edit/sample/AncestorInformationBox";
import Metadata from "../components/custom/entities/sample/Metadata";
import Contributors from "../components/custom/entities/dataset/Contributors";
import Attribution from "../components/custom/entities/sample/Attribution";
import log from "loglevel";
import {fetchEntity, getRequestHeaders, getStatusColor} from "../components/custom/js/functions";
import AppNavbar from "../components/custom/layout/AppNavbar";
import {get_read_write_privileges, get_write_privilege_for_group_uuid} from "../lib/services";
import {getCookie} from "cookies-next";
import Unauthorized from "../components/custom/layout/Unauthorized";
import AppFooter from "../components/custom/layout/AppFooter";
import Header from "../components/custom/layout/Header";
import Files from "../components/custom/entities/dataset/Files";

function ViewDataset() {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [ancestors, setAncestors] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [hasWritePrivilege, setHasWritePrivilege] = useState(false)
    const [isRegisterHidden, setIsRegisterHidden] = useState(false)
    const [authorized, setAuthorized] = useState(false)

    // only executed on init rendering, see the []
    useEffect(() => {
        // declare the async data fetching function
        const fetchData = async (uuid) => {
            get_read_write_privileges().then(response => {
                setAuthorized(response.read_privs)
                setIsRegisterHidden(!response.write_privs)
            }).catch(error => log.error(error))

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
                if (data.hasOwnProperty("immediate_ancestors")) {
                    await fetchAncestors(data.immediate_ancestors);
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

    const fetchAncestors = async (ancestor_uuids) => {
        let new_ancestors = []
        for (const ancestor_uuid of ancestor_uuids) {
            let ancestor = await fetchEntity(ancestor_uuid.uuid);
            if (ancestor.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(ancestor["error"])
            } else {
                new_ancestors.push(ancestor)
            }
        }
        setAncestors(new_ancestors)
    }

    if (!data) {
        return (
            <div className="text-center p-3">
                <span>Loading, please wait...</span>
                <br></br>
                <span className="spinner-border spinner-border-lg align-center alert alert-info"></span>
            </div>
        )
    } else if (authorized && getCookie('isAuthenticated')) {
        return (
            <>
                <Header title={`${data.sennet_id} | Dataset | SenNet`}></Header>

                <AppNavbar hidden={isRegisterHidden}/>

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
                                            <li className="sui-single-option-facet__item"><a
                                                className="sui-single-option-facet__link"
                                                href="#Files">Files</a>
                                            </li>
                                            {/* <li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link" href="#Provenance">Provenance</a>
                                        </li> */}
                                            {data.immediate_ancestors &&
                                                <li className="sui-single-option-facet__item"><a
                                                    className="sui-single-option-facet__link"
                                                    href="#Ancestor">Ancestor</a>
                                                </li>
                                            }
                                            {!!(data.metadata && Object.keys(data.metadata).length && 'metadata' in data.metadata) &&
                                                <li className="sui-single-option-facet__item"><a
                                                    className="sui-single-option-facet__link"
                                                    href="#Metadata">Metadata</a>
                                                </li>
                                            }
                                            {/* <li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link" href="#Files">Files</a>
                                        </li> */}

                                            {!!(data.contributors && Object.keys(data.contributors).length) &&
                                                <li className="sui-single-option-facet__item"><a
                                                    className="sui-single-option-facet__link"
                                                    href="#Contributors">Contributors</a>
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
                                <h4>Dataset</h4>
                                <h3>{data.sennet_id}</h3>

                                <div className="d-flex justify-content-between mb-2">
                                    <div className="entity_subtitle link_with_icon">
                                        {data.data_types &&
                                            <span>
                                            {data.data_types[0]}
                                        </span>
                                        }
                                        {data.origin_sample && Object.keys(data.origin_sample).length > 0 && data.origin_sample.organ &&
                                            <span className="ms-1 me-1">
                                            | {data.origin_sample.organ}
                                        </span>
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

                                        {hasWritePrivilege &&
                                            <Button className="ms-3" href={`/edit/dataset?uuid=${data.uuid}`}
                                                    variant="outline-primary rounded-0">Edit</Button>}{' '}
                                        <Button className="ms-3" href={`/api/json/dataset?uuid=${data.uuid}`}
                                                variant="outline-primary rounded-0"><FiletypeJson/></Button>
                                    </div>
                                </div>
                            </div>
                        }

                        bodyContent={
                            <div>
                                <ul className="sui-results-container">
                                    {/*Description*/}
                                    <Description primaryDateTitle="Publication Date"
                                                 primaryDate={data.published_timestamp}
                                                 secondaryDateTitle="Modification Date"
                                                 secondaryDate={data.last_modified_timestamp}
                                                 data={data}/>

                                    {/*Files*/}
                                    <Files sennet_id={data.sennet_id}/>

                                    {/*Provenance*/}
                                    {/* {!!(data.ancestor_counts && Object.keys(data.ancestor_counts).length) &&
                                    <Provenance data={data}/>
                                } */}

                                    {/*Source Information Box*/}
                                    {ancestors &&
                                        <AncestorInformationBox ancestor={ancestors}/>
                                    }


                                    {/*Metadata*/}
                                    {!!(data.metadata && Object.keys(data.metadata).length && 'metadata' in data.metadata) &&
                                        <Metadata data={data.metadata.metadata} filename={data.sennet_id}/>
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
                <AppFooter/>
            </>
        )
    } else {
        return (
            <Unauthorized/>
        )
    }
}


export default ViewDataset