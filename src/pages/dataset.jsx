import React, {useContext, useEffect, useState, useCallback, Suspense} from "react";
import {useRouter} from 'next/router';
import {
    BoxArrowUpRight,
    CircleFill, Fullscreen, List,
    MoonFill,
    SunFill
} from 'react-bootstrap-icons';
import Description from "../components/custom/entities/sample/Description";
import Attribution from "../components/custom/entities/sample/Attribution";
import log from "loglevel";
import {getOrganTypeFullName, getRequestHeaders, getStatusColor} from "../components/custom/js/functions";
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
import {rna_seq} from "../vitessce/rna-seq/rna-seq-vitessce-config";
import {Share, Moon, Sun} from "react-bootstrap-icons";
import Link from 'next/link'
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import $ from 'jquery'
import {Snackbar} from "@mui/material";
import MuiAlert from '@mui/material/Alert';


const Vitessce = React.lazy(() => import ('../components/custom/VitessceWrapper.js'))

function ViewDataset() {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [ancestors, setAncestors] = useState(null)
    const [descendants, setDescendants] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [hasWritePrivilege, setHasWritePrivilege] = useState(false)
    const [vitessceTheme, setVitessceTheme] = useState("light")
    const [showCopiedToClipboard, setShowCopiedToClipboard] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showExitFullscreenMessage, setShowExitFullscreenMessage] = useState(null)
    const {isRegisterHidden, isLoggedIn, isUnauthorized, isAuthorizing} = useContext(AppContext)
    const [vitessceConfig, setVitessceConfig] = useState(null)
    
    const showVitessce = (data_types) => {
        const supportedVitessceDataTypes = ['snRNA-seq', 'scRNA-seq']
        return supportedVitessceDataTypes.some(d=> data_types.includes(d))
    }
    
    useEffect(()=> {
        if(data !== null) {
            setVitessceConfig(rna_seq(data.uuid))
        }
    }, [data])
    
    const collapseVitessceOnEsc = useCallback((event) => {
        if (event.key === "Escape") {
            $('#sennet-vitessce').toggleClass('vitessce_fullscreen');
            setIsFullscreen(false)
            setShowExitFullscreenMessage(false)
            document.removeEventListener("keydown", collapseVitessceOnEsc, false);
        }
    }, []);
    
    const expandVitessceToFullscreen = () => {
        document.addEventListener("keydown", collapseVitessceOnEsc, false);
        $('#sennet-vitessce').toggleClass('vitessce_fullscreen');
        setShowExitFullscreenMessage(true)
    }
    
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
                {data && <Header title={`${data.sennet_id} | Dataset | SenNet`}></Header>}

                <AppNavbar hidden={isRegisterHidden} signoutHidden={false}/>

                {error &&
                    <Alert message={errorMessage}/>
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
                                            {showVitessce(data.data_types) &&
                                                <li className="nav-item">
                                                    <a href="#Vitessce"
                                                       className="nav-link"
                                                       data-bs-parent="#sidebar">Visualization</a>
                                                </li>
                                            }
                                            <li className="nav-item">
                                                <a href="#Provenance"
                                                   className="nav-link"
                                                   data-bs-parent="#sidebar">Provenance</a>
                                            </li>
                                            <li className="nav-item">
                                                <a href="#Files"
                                                   className="nav-link"
                                                   data-bs-parent="#sidebar">Files</a>
                                            </li>

                                            {!!(data.metadata && Object.keys(data.metadata).length && 'metadata' in data.metadata) &&
                                                <li className="nav-item">
                                                    <a href="#Metadata"
                                                       className="nav-link"
                                                       data-bs-parent="#sidebar">Metadata</a>
                                                </li>
                                            }

                                            {!!(data.contributors && Object.keys(data.contributors).length) &&
                                                <li className="nav-item">
                                                    <a href="#Contributors"
                                                       className="nav-link"
                                                       data-bs-parent="#sidebar">Contributors</a>
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
                                    <div className="d-none d-md-block sticky-top" id="sections-button">
                                        <a href="#" data-bs-target="#sidebar" data-bs-toggle="collapse"
                                           className="btn btn-outline-primary rounded-0 link_with_icon mb-2"><List/></a>
                                    </div>

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
                                            {/* Vitessce */}
                                            {showVitessce(data.data_types) &&
                                                <div className="accordion accordion-flush sui-result" id="Vitessce">
                                                        <div className="accordion-item ">
                                                            <div className="accordion-header">
                                                                <button className="accordion-button" type="button"
                                                                        data-bs-toggle="collapse"
                                                                        data-bs-target="#vitessce-collapse"
                                                                        aria-expanded="true"
                                                                        aria-controls="vitessce-collapse">Visualization

                                                                </button>
                                                            </div>
                                                            <div id="vitessce-collapse"
                                                                 className="accordion-collapse collapse show">
                                                                <div className="accordion-body" style={{height: '900px'}}>
                                                                    <div className={'row'}>
                                                                        <div className={'col p-2 m-2'}>
                                                                            <span className={'fw-lighter'}>Powered by </span>
                                                                            <Link href={'http://vitessce.io'}></Link>
                                                                            <a target="_blank" href="http://vitessce.io/" rel="noopener noreferrer" title={'Vitessce.io'}>
                                                                                Vitessce V1.2.2
                                                                            </a>
                                                                        </div>
                                                                        <div className={'col text-end p-2 m-2'}>
                                                                                <OverlayTrigger
                                                                                    placement={'top'}
                                                                                    overlay={
                                                                                        <Tooltip id={'share-tooltip'}>
                                                                                            {showCopiedToClipboard ? 'Shareable URL copied to clipboard!' : 'Share Visualization'}
                                                                                        </Tooltip>
                                                                                    }>
                                                                                    <Share style={{cursor: 'pointer'}} color="royalblue" size={24} onClick={()=>{
                                                                                        navigator.clipboard.writeText(document.location.href)
                                                                                        setShowCopiedToClipboard(true)
                                                                                    }} onMouseLeave={()=>setShowCopiedToClipboard(false)}/>
                                                                                </OverlayTrigger>
                                                                                {
                                                                                    vitessceTheme === 'light' ? 
                                                                                        <>
                                                                                            <OverlayTrigger placement={'top'} overlay={<Tooltip id={'light-theme-tooltip'}>Switch to light theme</Tooltip>}>
                                                                                                <SunFill style={{cursor: 'pointer'}} onClick={()=>{setVitessceTheme('light')}} className={'m-2'} color="royalblue" size={24} title="Light mode"/>
                                                                                            </OverlayTrigger>
                                                                                            <OverlayTrigger placement={'top'} overlay={<Tooltip id={'dark-theme-tooltip'}>Switch to dark theme</Tooltip>}>
                                                                                                <Moon style={{cursor: 'pointer'}} onClick={()=>{setVitessceTheme('dark')}} className={'m-2'} color="royalblue" size={24} title="Dark mode"/>
                                                                                            </OverlayTrigger>
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            <OverlayTrigger placement={'top'} overlay={<Tooltip>Switch to light theme</Tooltip>}>
                                                                                                <Sun style={{cursor: 'pointer'}} onClick={()=>setVitessceTheme('light')} className={'m-2'} color="royalblue" size={24} title="Light mode"/>
                                                                                            </OverlayTrigger>
                                                                                            <OverlayTrigger placement={'top'} overlay={<Tooltip>Switch to dark theme</Tooltip>}>
                                                                                                <MoonFill style={{cursor: 'pointer'}} onClick={()=>{setVitessceTheme('dark')}} className={'m-2'} color="royalblue" size={24} title="Dark mode"/>
                                                                                            </OverlayTrigger>
                                                                                        </>
                                                                                    
                                                                                }
                                                                                <OverlayTrigger placement={'top'} overlay={<Tooltip>Enter fullscreen</Tooltip>}>
                                                                                        <Fullscreen style={{cursor: 'pointer'}} className={'m-2'} color="royalblue" size={24} title="Fullscreen" onClick={()=>{
                                                                                            expandVitessceToFullscreen()
                                                                                            setIsFullscreen(true)}
                                                                                        }/>
                                                                                </OverlayTrigger>
                                                                            </div>
                                                                        </div>
                                                                    <div id={'sennet-vitessce'}>
                                                                        <Snackbar open={showExitFullscreenMessage} autoHideDuration={8000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={()=>{setShowExitFullscreenMessage(false)}}>
                                                                            <MuiAlert onClose={()=>{setShowExitFullscreenMessage(false)}} severity="info" sx={{ width: '100%' }}>
                                                                                Pres ESC to exit fullscreen
                                                                            </MuiAlert>
                                                                        </Snackbar>
                                                                        <Suspense fallback={<div>Loading...</div>}>
                                                                            <Vitessce config={vitessceConfig} theme={vitessceTheme} height={isFullscreen ? null : 800}/>
                                                                        </Suspense>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            }

                                            {/*Provenance*/}
                                            {data &&
                                                <Provenance nodeData={data}/>
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