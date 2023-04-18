import React, {useContext, Suspense} from "react";
import VisualizationContext from "../../../context/VisualizationContext";
import Link from "next/link";
import {Fullscreen, Moon, MoonFill, Share, Sun, SunFill} from "react-bootstrap-icons";
import {Snackbar} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

export const SennetVitessce = ({ data }) => {
    const Vitessce = React.lazy(() => import ('./VitessceWrapper.js'))
    const {
        showVitessce,
        vitessceTheme,
        setVitessceTheme,
        vitessceConfig,
        showCopiedToClipboard,
        setShowCopiedToClipboard,
        showExitFullscreenMessage,
        setShowExitFullscreenMessage,
        isFullscreen,
        setIsFullscreen,
        expandVitessceToFullscreen,
        isPrimaryDataset
    } = useContext(VisualizationContext)
    
    return <>
        { showVitessce(data.data_types) &&
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
                                <span className={'fw-light fs-6'}>Powered by 
                                    <a className={'ms-2'} target="_blank" href="http://vitessce.io/" rel="noopener noreferrer" title={'Vitessce.io'}>
                                        Vitessce V1.2.2
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
                                <OverlayTrigger
                                    placement={'top'}
                                    overlay={
                                        <Tooltip id={'share-tooltip'}>
                                            { showCopiedToClipboard ? 'Shareable URL copied to clipboard!' : 'Share Visualization' }
                                        </Tooltip>
                                    }>
                                    <Share style={{cursor: 'pointer'}} color="royalblue" size={24} onClick={()=>{
                                        navigator.clipboard.writeText(document.location.href)
                                        setShowCopiedToClipboard(true)
                                    }} onMouseLeave={() => setShowCopiedToClipboard(false)}/>
                                </OverlayTrigger>
                                {
                                    vitessceTheme === 'light' ?
                                        <>
                                            <OverlayTrigger placement={'top'} overlay={<Tooltip id={'light-theme-tooltip'}>Switch to light theme</Tooltip>}>
                                                <SunFill style={{cursor: 'pointer'}} onClick={() => setVitessceTheme('light')} className={'m-2'} color="royalblue" size={24} title="Light mode"/>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement={'top'} overlay={<Tooltip id={'dark-theme-tooltip'}>Switch to dark theme</Tooltip>}>
                                                <Moon style={{cursor: 'pointer'}} onClick={() => setVitessceTheme('dark')} className={'m-2'} color="royalblue" size={24} title="Dark mode"/>
                                            </OverlayTrigger>
                                        </>
                                        :
                                        <>
                                            <OverlayTrigger placement={'top'} overlay={<Tooltip>Switch to light theme</Tooltip>}>
                                                <Sun style={{cursor: 'pointer'}} onClick={() => setVitessceTheme('light')} className={'m-2'} color="royalblue" size={24} title="Light mode"/>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement={'top'} overlay={<Tooltip>Switch to dark theme</Tooltip>}>
                                                <MoonFill style={{cursor: 'pointer'}} onClick={() => setVitessceTheme('dark')} className={'m-2'} color="royalblue" size={24} title="Dark mode"/>
                                            </OverlayTrigger>
                                        </>
    
                                }
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
                                <Vitessce config={ vitessceConfig } theme={ vitessceTheme } height={ isFullscreen ? null : 800 }/>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        }
    </>
}

export default SennetVitessce