import React, {useContext, useEffect, useState} from "react";
import Description from "../components/custom/entities/sample/Description";
import Attribution from "../components/custom/entities/sample/Attribution";
import log from "loglevel";
import {getRequestHeaders, getStatusColor} from "../components/custom/js/functions";
import AppNavbar from "../components/custom/layout/AppNavbar";
import {get_write_privilege_for_group_uuid} from "../lib/services";
import Unauthorized from "../components/custom/layout/Unauthorized";
import AppFooter from "../components/custom/layout/AppFooter";
import Header from "../components/custom/layout/Header";
import Spinner from "../components/custom/Spinner";
import AppContext from "../context/AppContext";
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Provenance from "../components/custom/entities/Provenance";
import {EntityViewHeader} from "../components/custom/layout/entity/ViewHeader";
import DerivedContext, {DerivedProvider} from "../context/DerivedContext";

import SidebarBtn from "../components/SidebarBtn";
import SenNetAccordion from "../components/custom/layout/SenNetAccordion";



function ViewPublication() {
    const [data, setData] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [hasWritePrivilege, setHasWritePrivilege] = useState(false)
    const {router, isRegisterHidden, isUnauthorized, isAuthorizing, _t, cache} = useContext(AppContext)
    const {
        showVitessce,
        setVitessceConfig,
        setIsPrimaryDataset,
        isPrimaryDataset
    } = useContext(DerivedContext)



    // only executed on init rendering, see the []
    useEffect(() => {
        // declare the async data fetching function
        const fetchData = async (uuid) => {


            log.debug('publication: getting data...', uuid)
            // get the data from the api
            const response = await fetch("/api/find?uuid=" + uuid, getRequestHeaders());
            // convert the data to json
            const data = await response.json();

            log.debug('publication: Got data', data)
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
                {data && <Header title={`${data.sennet_id} | Publication | SenNet`}></Header>}

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

                                            <li className="nav-item">
                                                <a href="#Provenance"
                                                   className="nav-link"
                                                   data-bs-parent="#sidebar">Provenance</a>
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
                                    <SidebarBtn />

                                    <EntityViewHeader data={data}
                                                      uniqueHeader={data.dataset_type}
                                                      entity={cache.entities.publication.toLowerCase()}
                                                      hasWritePrivilege={hasWritePrivilege}/>

                                    <div className="row">
                                        <div className="col-12">
                                            {/*Description*/}
                                            <Description primaryDateTitle="Publication Date"
                                                         primaryDate={data.published_timestamp}
                                                         secondaryDateTitle="Modification Date"
                                                         secondaryDate={data.last_modified_timestamp}
                                                         data={data}/>

                                            {/*Publication Details*/}
                                            <SenNetAccordion title={'Publication Details'}>
                                                <div>

                                                    <Table borderless>
                                                        <thead>
                                                        <tr>
                                                            <th>Title</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr>
                                                            <td>{data.title}</td>
                                                        </tr>
                                                        </tbody>
                                                    </Table>
                                                    <br />
                                                    <Table borderless>
                                                        <thead>
                                                        <tr>
                                                            <th style={{width: '44%'}}>Venue</th>
                                                            <th>Status</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr>
                                                            <td>{data.publication_venue}</td>
                                                            <td><span className={`${getStatusColor(data.status)} badge`}>{data.status}</span></td>
                                                        </tr>
                                                        </tbody>
                                                    </Table>
                                                    <br />
                                                    <Table borderless>
                                                        <thead>
                                                        <tr>
                                                            <th style={{width: '44%'}}>Issue/Volume Number</th>
                                                            <th>Pages or Article Number</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr>
                                                            <td>{data.issue}/{data.volume}</td>
                                                            <td>{data.pages_or_article_num}</td>
                                                        </tr>
                                                        </tbody>
                                                    </Table>
                                                    <br />
                                                    { data.publication_url &&
                                                    <Table borderless>
                                                        <thead>
                                                        <tr>
                                                            <th>Publication URL</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr>
                                                            <td><a href={data.publication_url} className={'lnk--ic pl-0'}>{data.publication_url} <i className="bi bi-box-arrow-up-right"></i></a></td>
                                                        </tr>
                                                        </tbody>
                                                    </Table>
                                                    }
                                                    {data.publication_doi &&
                                                    <Table borderless>
                                                        <thead>
                                                        <tr>
                                                            <th>Publication DOI</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr>
                                                            <td><a href={data.publication_doi} className={'lnk--ic pl-0'}>{data.publication_doi} <i className="bi bi-box-arrow-up-right"></i></a></td>
                                                        </tr>
                                                        </tbody>
                                                    </Table> }

                                                </div>
                                            </SenNetAccordion>
                                            {/*Provenance*/}
                                            {data &&
                                                <Provenance nodeData={data}/>
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

ViewPublication.withWrapper = function(page) { return <DerivedProvider>{ page }</DerivedProvider> }

export default ViewPublication
