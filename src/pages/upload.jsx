import dynamic from "next/dynamic";
import React, {useContext, useEffect, useState} from "react";
import {useRouter} from 'next/router';
import log from "loglevel";
import {
    callService,
    filterProperties,
    get_write_privilege_for_group_uuid,
    getEntityData
} from "@/lib/services";
import AppContext from "@/context/AppContext";
import Alert from 'react-bootstrap/Alert';
import {EntityViewHeader} from "@/components/custom/layout/entity/ViewHeader";
import {getEntityEndPoint} from "@/config/config";
import LoadingAccordion from "@/components/custom/layout/LoadingAccordion";
import AppNavbar from "@/components/custom/layout/AppNavbar"
import Description from "@/components/custom/entities/sample/Description";
import FileTreeView from "@/components/custom/entities/dataset/FileTreeView";
import Datasets from "@/components/custom/entities/collection/Datasets";
import Attribution from "@/components/custom/entities/sample/Attribution";

const AppFooter = dynamic(() => import("@/components/custom/layout/AppFooter"))
const Header = dynamic(() => import("@/components/custom/layout/Header"))
const SidebarBtn = dynamic(() => import("@/components/SidebarBtn"))

function ViewUpload() {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [isDatasetsLoading, setIsDatasetsLoading] = useState(true)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [hasWritePrivilege, setHasWritePrivilege] = useState(false)
    const {isRegisterHidden, _t, cache, isPreview, getPreviewView} = useContext(AppContext);

    // only executed on init rendering, see the []
    useEffect(() => {
        // declare the async data fetching function
        const fetchData = async (uuid) => {

            log.debug('upload: getting data...', uuid)
            // get the data from the api
            const _data = await getEntityData(uuid, ['ancestors', 'descendants']);

            log.debug('upload: Got data', _data)
            if (_data.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(_data["error"])
                setData(false)
                setIsDatasetsLoading(false)
            } else {
                setData(_data)
                const datasets = await callService(filterProperties.uploadsDatasets,  `${getEntityEndPoint()}uploads/${_data.uuid}/datasets`, 'POST')
                Object.assign(_data, {datasets})
                setData(_data)
                setIsDatasetsLoading(false)

                get_write_privilege_for_group_uuid(_data.group_uuid).then(response => {
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

    if (isPreview(data, error))  {
        return getPreviewView(data)
    } else {
        return (
            <>
                {data && <Header title={`${data.sennet_id} | Upload | SenNet`}></Header>}

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
                                                <a href="#Files"
                                                   className="nav-link"
                                                   data-bs-parent="#sidebar">Files</a>
                                            </li>
                                            {data.datasets?.length > 0 && <li className="nav-item">
                                                <a href="#Datasets"
                                                   className="nav-link"
                                                   data-bs-parent="#sidebar">Datasets</a>
                                            </li>}
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

                                    <EntityViewHeader data={data} entity={cache.entities.upload.toLowerCase()}
                                                      hasWritePrivilege={hasWritePrivilege}/>

                                    <div className="row">
                                        <div className="col-12">
                                            {/*Description*/}
                                            <Description primaryDateTitle="Creation Date"
                                                         primaryDate={data.created_timestamp}
                                                         secondaryDateTitle="Modification Date"
                                                         secondaryDate={data.last_modified_timestamp}
                                                         labId={data.title}
                                                         data={data}
                                            />

                                            {/*Files*/}
                                            <FileTreeView data={data}/>

                                            {/*Datasets*/}
                                            {isDatasetsLoading ? (
                                                <LoadingAccordion id='Datasets' title='Datasets' />
                                            ) : (
                                                <Datasets data={data.datasets}/>
                                            )}

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


export default ViewUpload
