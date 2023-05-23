import React, {useContext, Suspense} from "react";
import VisualizationContext from "../../../context/VisualizationContext";
import Link from "next/link";
import {Fullscreen} from "react-bootstrap-icons";
import {Snackbar} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import SenNetAccordion from "../layout/SenNetAccordion";

export const SennetVitessce = ({ data }) => {
    const Vitessce = React.lazy(() => import ('./VitessceWrapper.js'))
    const {
        showVitessce,
        vitessceConfig,
        showExitFullscreenMessage,
        setShowExitFullscreenMessage,
        isFullscreen,
        setIsFullscreen,
        expandVitessceToFullscreen,
        isPrimaryDataset
    } = useContext(VisualizationContext)
    
    return <>
        {showVitessce(isPrimaryDataset, data) &&
            <SenNetAccordion title='Visualization' id={'Vitessce'} className={'accordion--vitessce'}>
                <div className={'row'}>
                    <div className={'col p-2 m-2'}>
                        <span className={'fw-light fs-6'}>Powered by
                            <a className={'ms-2'} target="_blank" href="http://vitessce.io/" rel="noopener noreferrer" title={'Vitessce.io'}>
                                Vitessce V2.0.3
                            </a>
                        </span>
                    </div>
                    <div className={'col p-2 m-2'}>
                        {isPrimaryDataset && data.immediate_descendants.length !== 0 &&
                            <span className={'fw-light fs-6 m-2 p-2'}>
                                Derived from
                                <Link target="_blank" href={{ pathname: '/dataset', query: { uuid: data.immediate_descendants[0].uuid } }}>
                                    <span className={'ms-2 me-2'}>{data.immediate_descendants[0].sennet_id}</span>
                                </Link>
                            </span>
                        }
                    </div>
                    <div className={'col text-end p-2 m-2'}>
                        <OverlayTrigger placement={'top'} overlay={<Tooltip>Enter fullscreen</Tooltip>}>
                            <Fullscreen style={{cursor: 'pointer'}} className={'m-2'} color="royalblue" size={24} title="Fullscreen" onClick={() => {
                                expandVitessceToFullscreen()
                                setIsFullscreen(true)
                            }
                            }/>
                        </OverlayTrigger>
                    </div>
                </div>
                <div id={'sennet-vitessce-view-config'}>
                    <Snackbar open={ showExitFullscreenMessage } autoHideDuration={ 8000 } anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={() => setShowExitFullscreenMessage(false)}>
                        <MuiAlert onClose={() => setShowExitFullscreenMessage(false)} severity="info" sx={{ width: '100%' }}>
                            Pres ESC to exit fullscreen
                        </MuiAlert>
                    </Snackbar>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Vitessce config={ vitessceConfig } theme={ 'light' } height={ isFullscreen ? null : 800 }/>
                    </Suspense>
                </div>
            </SenNetAccordion>
        }
    </>
}

export default SennetVitessce