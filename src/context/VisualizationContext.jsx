import {createContext, useCallback, useState} from "react";
import $ from "jquery";

const VisualizationContext = createContext({})

export const VisualizationProvider = ({ children }) => {
    
    //region Vitessce
    const [vitessceTheme, setVitessceTheme] = useState("light")
    const [vitessceConfig, setVitessceConfig] = useState(null)
    const [showCopiedToClipboard, setShowCopiedToClipboard] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showExitFullscreenMessage, setShowExitFullscreenMessage] = useState(null)
    const [isPrimaryDataset, setIsPrimaryDataset] = useState(false)

    const showVitessce = (is_primary_dataset, data) => {
        return isDatasetStatusPassed(data) && ((is_primary_dataset && data.immediate_descendants.length !== 0) || !is_primary_dataset)
    }
    
    const isDatasetStatusPassed = data => {
        let result = null
        data.descendants.forEach(d => {
            if (d.status === 'Processing' || d.status === 'Error') {
                result = false
            }
        })
        if (result === null) {
            result = (data.status !== 'Processing' && data.status !=='Error')
        }
        return result
    }

    const expandVitessceToFullscreen = () => {
        document.addEventListener("keydown", collapseVitessceOnEsc, false);
        $('.vitessce-container').toggleClass('vitessce_fullscreen');
        setShowExitFullscreenMessage(true)
    }

    const collapseVitessceOnEsc = useCallback((event) => {
        if (event.key === "Escape") {
            $('.vitessce-container').toggleClass('vitessce_fullscreen');
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
        setIsPrimaryDataset
    }}>
        { children }
    </VisualizationContext.Provider>
}

export default VisualizationContext