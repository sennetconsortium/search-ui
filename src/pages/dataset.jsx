import React, {useContext, useEffect, useState} from "react";
import {
    List
} from 'react-bootstrap-icons';
import Description from "../components/custom/entities/sample/Description";
import Attribution from "../components/custom/entities/sample/Attribution";
import log from "loglevel";
import {getRequestHeaders} from "../components/custom/js/functions";
import AppNavbar from "../components/custom/layout/AppNavbar";
import {get_write_privilege_for_group_uuid} from "../lib/services";
import Unauthorized from "../components/custom/layout/Unauthorized";
import AppFooter from "../components/custom/layout/AppFooter";
import Header from "../components/custom/layout/Header";
import Files from "../components/custom/entities/dataset/Files";
import Spinner from "../components/custom/Spinner";
import AppContext from "../context/AppContext";
import Alert from 'react-bootstrap/Alert';
import Provenance from "../components/custom/entities/Provenance";
import Metadata from "../components/custom/entities/sample/Metadata";
import Contributors from "../components/custom/entities/dataset/Contributors";
import {EntityViewHeader} from "../components/custom/layout/entity/ViewHeader";
import {rna_seq} from "../vitessce-view-config/rna-seq/rna-seq-vitessce-config";
import {codex_config} from "../vitessce-view-config/codex/codex-vitessce-config";
import VisualizationContext, {VisualizationProvider} from "../context/VisualizationContext";
import SennetVitessce from "../components/custom/vitessce/SennetVitessce";
import {get_primary_data_assays} from "../lib/ontology";



function ViewDataset() {
    const [data, setData] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [hasWritePrivilege, setHasWritePrivilege] = useState(false)
    const {router, isRegisterHidden, isUnauthorized, isAuthorizing, _t, cache} = useContext(AppContext)
    const {
        showVitessce,
        setVitessceConfig,
        setIsPrimaryDataset
    } = useContext(VisualizationContext)

    // Load the correct Vitessce view config
    useEffect(() => {
        const initVitessceConfig = async () => {
            if (data) {
                let dataset_id = data.uuid
                const primary_assays = await get_primary_data_assays()
                // TODO: Check each data_type in the list instead of the first item
                let is_primary_dataset = primary_assays.includes(data.data_types[0]);
                setIsPrimaryDataset(is_primary_dataset)
                if (is_primary_dataset && data.immediate_descendants.length !== 0) {
                    let immediate_descendant = data.immediate_descendants[0];
                    dataset_id = immediate_descendant.uuid
                }
                data.data_types.forEach(assay => {
                    switch (assay) {
                        case 'snRNA-seq':
                        case 'scRNA-seq':
                        case 'scRNA-seq (10x Genomics) [Salmon]':    
                            setVitessceConfig(rna_seq(dataset_id))
                            break
                        case 'CODEX [Cytokit + SPRM]':
                        case 'CODEX':
                            setVitessceConfig(codex_config(dataset_id))
                            break
                        default:
                            console.log(`No Vitessce config found for assay type: ${assay}`)
                    }
                })
            }
        }
        initVitessceConfig()
    }, [data])

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
                                           className="btn btn-outline-primary rounded-0 icon_inline mb-2"><List/></a>
                                    </div>

                                    <EntityViewHeader data={data}
                                                      uniqueHeader={data.data_types[0]}
                                                      entity={cache.entities.dataset.toLowerCase()}
                                                      hasWritePrivilege={hasWritePrivilege}/>

                                    <div className="row">
                                        <div className="col-12">
                                            {/*Description*/}
                                            <Description primaryDateTitle="Publication Date"
                                                         primaryDate={data.published_timestamp}
                                                         secondaryDateTitle="Modification Date"
                                                         secondaryDate={data.last_modified_timestamp}
                                                         data={data}/>

                                            {/* Vitessce */}
                                            <SennetVitessce data={data}/>

                                            {/*Provenance*/}
                                            {data &&
                                                <Provenance nodeData={data}/>
                                            }

                                            {/*Files*/}
                                            <Files sennet_id={data.sennet_id}/>


                                            {/*Metadata*/}
                                            {!!(data.metadata && Object.keys(data.metadata).length && 'metadata' in data.metadata) &&
                                                <Metadata metadataKey={""} data={data.metadata.metadata} filename={data.sennet_id}/>
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

ViewDataset.withWrapper = function(page) { return <VisualizationProvider>{ page }</VisualizationProvider> }

export default ViewDataset
