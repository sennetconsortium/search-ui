import {createContext, useCallback, useState} from "react";
import {ENTITIES} from "../config/constants";
import $ from "jquery";

const VisualizationContext = createContext({})

export const VisualizationProvider = ({ children }) => {
    
    //region Vitessce
    const [vitessceTheme, setVitessceTheme] = useState("light")
    const [vitessceConfig, setVitessceConfig] = useState(null)
    const [showCopiedToClipboard, setShowCopiedToClipboard] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showExitFullscreenMessage, setShowExitFullscreenMessage] = useState(null)

    const showVitessce = (data_types) => {
        const supportedVitessceDataTypes = ['snRNA-seq', 'scRNA-seq', 'CODEX']
        return supportedVitessceDataTypes.some(d=> data_types.includes(d))
    }

    const isPrimaryDataset = data => data.immediate_ancestors && data.immediate_ancestors.some(ancestor => ancestor.entity_type === ENTITIES.sample)

    const expandVitessceToFullscreen = () => {
        document.addEventListener("keydown", collapseVitessceOnEsc, false);
        $('#sennet-vitessce').toggleClass('vitessce_fullscreen');
        setShowExitFullscreenMessage(true)
    }

    const collapseVitessceOnEsc = useCallback((event) => {
        if (event.key === "Escape") {
            $('#sennet-vitessce').toggleClass('vitessce_fullscreen');
            setIsFullscreen(false)
            setShowExitFullscreenMessage(false)
            document.removeEventListener("keydown", collapseVitessceOnEsc, false);
        }
    }, []);
    //endregion
    
    return <VisualizationContext.Provider value={{
        showVitessce,
        isPrimaryDataset,
        vitessceTheme,
        setVitessceTheme,
        vitessceConfig,
        setVitessceConfig,
        showCopiedToClipboard,
        setShowCopiedToClipboard,
        showExitFullscreenMessage,
        setShowExitFullscreenMessage,
        isFullscreen,
        setIsFullscreen,
        expandVitessceToFullscreen,
        collapseVitessceOnEsc,
    }}>
        { children }
    </VisualizationContext.Provider>
}

export default VisualizationContext