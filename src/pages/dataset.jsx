import React, {useContext, useEffect, useState} from "react";
import Description from "../components/custom/entities/sample/Description";
import Attribution from "../components/custom/entities/sample/Attribution";
import log from "loglevel";
import {getDataTypesByProperty, getRequestHeaders} from "../components/custom/js/functions";
import AppNavbar from "../components/custom/layout/AppNavbar";
import {get_write_privilege_for_group_uuid} from "../lib/services";
import Unauthorized from "../components/custom/layout/Unauthorized";
import AppFooter from "../components/custom/layout/AppFooter";
import Header from "../components/custom/layout/Header";
import Spinner from "../components/custom/Spinner";
import AppContext from "../context/AppContext";
import Alert from 'react-bootstrap/Alert';
import Provenance from "../components/custom/entities/Provenance";
import ContributorsContacts from "../components/custom/entities/ContributorsContacts";
import {EntityViewHeader} from "../components/custom/layout/entity/ViewHeader";
import {rna_seq} from "../vitessce-view-config/rna-seq/rna-seq-vitessce-config";
import {codex_config} from "../vitessce-view-config/codex/codex-vitessce-config";
import DerivedContext, {DerivedProvider} from "../context/DerivedContext";
import SennetVitessce from "../components/custom/vitessce/SennetVitessce";
import SidebarBtn from "../components/SidebarBtn";
import {kuppe2022nature} from "../vitessce-view-config/kuppe_2022_nature";
import Metadata from "../components/custom/entities/Metadata";
import FileTreeView from "../components/custom/entities/dataset/FileTreeView";

function ViewDataset() {
    const [data, setData] = useState(null)
    const [ancestorHasMetadata, setAncestorHasMetadata] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [hasWritePrivilege, setHasWritePrivilege] = useState(false)
    const {router, isRegisterHidden, isUnauthorized, isAuthorizing, _t, cache} = useContext(AppContext)
    const {
        showVitessce,
        setVitessceConfig,
        setIsPrimaryDataset,
        isPrimaryDataset,
        setDerived
    } = useContext(DerivedContext)

    // Load the correct Vitessce view config
    const vitessceConfig = (data, dataset_id) => {
        data.data_types.forEach(assay => {
            switch (assay) {
                case 'snRNA-seq':
                case 'scRNA-seq':
                case 'salmon_rnaseq_10x':
                case 'salmon_sn_rnaseq_10x':
                    setVitessceConfig(rna_seq(dataset_id))
                    break
                case 'codex_cytokit':
                case 'codex_cytokit_v1':
                case 'CODEX':
                    setVitessceConfig(codex_config(dataset_id))
                    break
                case 'Visium':
                    setVitessceConfig(kuppe2022nature())
                    break
                default:
                    console.log(`No Vitessce config found for assay type: ${assay}`)
            }
        })
    }

    useEffect(() => {
        const initVitessceConfig = async () => {
            if (data) {
                const primary_assays = getDataTypesByProperty("primary", true)
                let is_primary_dataset = primary_assays.includes(data.data_types[0]);
                setIsPrimaryDataset(is_primary_dataset)
                if (showVitessce(is_primary_dataset, data)) {
                    if (is_primary_dataset) {
                        setDerived(data).then(derived => {
                            if(derived) {
                                vitessceConfig(derived, derived.uuid)
                            }
                        })
                    } else {
                        vitessceConfig(data, data.uuid)
                    }
                }
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
                for (const ancestor of data.ancestors) {
                    console.log(ancestor)
                    if (ancestor.metadata && Object.keys(ancestor.metadata).length) {
                        setAncestorHasMetadata(true)
                        break
                    }
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
                                            {showVitessce(isPrimaryDataset, data) &&
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

                                            {!!((data.metadata && Object.keys(data.metadata).length && 'metadata' in data.metadata) || ancestorHasMetadata) &&
                                                <li className="nav-item">
                                                    <a href="#Metadata"
                                                       className="nav-link"
                                                       data-bs-parent="#sidebar">Metadata</a>
                                                </li>
                                            }

                                            <li className="nav-item">
                                                <a href="#Files"
                                                   className="nav-link"
                                                   data-bs-parent="#sidebar">Files</a>
                                            </li>

                                            {!!(data.contacts && Object.keys(data.contacts).length) &&
                                                <li className="nav-item">
                                                    <a href="#Contacts"
                                                       className="nav-link"
                                                       data-bs-parent="#sidebar">Contacts</a>
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
                                    <SidebarBtn/>

                                    <EntityViewHeader data={data}
                                                      uniqueHeader={data.data_types[0]}
                                                      entity={cache.entities.dataset.toLowerCase()}
                                                      hasWritePrivilege={hasWritePrivilege}/>

                                    <div className="row">
                                        <div className="col-12">
                                            {/*Description*/}
                                            <Description
                                                primaryDateTitle={data.published_timestamp ? ("Publication Date") : ("Creation Date")}
                                                primaryDate={data.published_timestamp ? (data.published_timestamp) : (data.created_timestamp)}
                                                labId={data.lab_dataset_id}
                                                secondaryDateTitle="Modification Date"
                                                secondaryDate={data.last_modified_timestamp}
                                                data={data}/>

                                            {/* Vitessce */}
                                            <SennetVitessce data={data}/>

                                            {/*Provenance*/}
                                            {data &&
                                                <Provenance nodeData={data}/>
                                            }

                                            {/*Metadata*/}
                                            {/*Datasets have their metadata inside "metadata.metadata"*/}
                                            {!!((data.metadata && Object.keys(data.metadata).length && 'metadata' in data.metadata) || ancestorHasMetadata) &&
                                                <Metadata data={data} metadata={data?.metadata?.metadata}
                                                          hasLineageMetadata={true}/>
                                            }

                                            {/*Files*/}
                                            <FileTreeView data={data}/>

                                            {/*Contacts*/}
                                            {!!(data.contacts && Object.keys(data.contacts).length) &&
                                                <ContributorsContacts title={'Contacts'} data={data.contacts}/>
                                            }

                                            {/*Contributors*/}
                                            {!!(data.contributors && Object.keys(data.contributors).length) &&
                                                <ContributorsContacts title={'Contributors'} data={data.contributors}/>
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

ViewDataset.withWrapper = function (page) {
    return <DerivedProvider>{page}</DerivedProvider>
}

export default ViewDataset
