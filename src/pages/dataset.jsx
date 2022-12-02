import React, {useContext, useEffect, useState} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Button} from 'react-bootstrap';
import {BoxArrowUpRight, CircleFill, FiletypeJson} from 'react-bootstrap-icons';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import Description from "../components/custom/entities/sample/Description";
import AncestorInformationBox from "../components/custom/edit/sample/AncestorInformationBox";
import Metadata from "../components/custom/entities/sample/Metadata";
import Contributors from "../components/custom/entities/dataset/Contributors";
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

function ViewDataset() {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [ancestors, setAncestors] = useState(null)
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
                    <Alert message={errorMessage} />
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
                                            {isLoggedIn() && <li className="sui-single-option-facet__item"><a
                                            className="sui-single-option-facet__link" href="#Provenance">Provenance</a>
                                            </li> }
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
                                            <>
                                                {data.data_types[0]}
                                            </>
                                        }
                                        {data.lab_dataset_id &&
                                            <>
                                                <span className="mx-2">|</span>
                                                {data.lab_dataset_id}
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
                                    {data && isLoggedIn() &&
                                        <Provenance nodeData={data}/>
                                    }

                                    {/*Source Information Box*/}
                                    {ancestors &&
                                        <AncestorInformationBox ancestor={ancestors}/>
                                    }


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


export default ViewDataset