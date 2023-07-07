import {createContext, useCallback, useState} from "react";
import $ from "jquery";
import {fetchEntity} from "../components/custom/js/functions";
import {isAssayVitessceSupport} from "../config/config";

const DerivedContext = createContext({})

export const DerivedProvider = ({children}) => {

    //region Vitessce
    const [vitessceTheme, setVitessceTheme] = useState("light")
    const [vitessceConfig, setVitessceConfig] = useState(null)
    const [showCopiedToClipboard, setShowCopiedToClipboard] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showExitFullscreenMessage, setShowExitFullscreenMessage] = useState(null)
    const [isPrimaryDataset, setIsPrimaryDataset] = useState(false)
    const [derivedDataset, setDerivedDataset] = useState(null)

    const showVitessce = (is_primary_dataset, data) => {
        let show_vitessce = false

        //Check first that this dataset has a valid status and has descendants or if we know this isn't a primary dataset
        if (isDatasetStatusPassed(data) && (is_primary_dataset && data.descendants.length !== 0) || !is_primary_dataset) {
            if (!isPrimaryDataset) {
                return true
            }

            // Iterate over all descendants
            for (let i = 0; i < data.descendants.length; i++) {
                let descendantData = data.descendants[i]
                if (isDatasetStatusPassed(descendantData)) {
                    show_vitessce = true
                    break;
                }
            }
        }
        return show_vitessce
    }

    const setDerived = async (data) => {
        let derived = null
        if (data.descendants.length !== 0) {
            for (let i = data.descendants.length - 1; i >= 0; i--) {
                let descendantData = await fetchEntity(data.descendants[i].uuid)
                if (isDatasetStatusPassed(descendantData) && vitessceSupportedAssasys.includes(descendantData.data_types[0])) {
                    // If derivedDataset hasn't been set then set it to this descendant
                    if (derivedDataset === null) {
                        derived = descendantData;
                    } else if (descendantData.status === 'Published') {
                        // If we come across a Published descendant then set it to this
                        derived = descendantData;
                        break;
                    }
                }
            }
        }
        setDerivedDataset(derived)
        return derived;
    }

    const vitessceSupportedAssasys = ['salmon_rnaseq_10x', 'salmon_sn_rnaseq_10x', 'codex_cytokit', 'codex_cytokit_v1', 'Visium']

    const isDatasetStatusPassed = data => {
        return data.status === "QA" || data.status === 'Published'
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

    return <DerivedContext.Provider value={{
        showVitessce,
        isPrimaryDataset,
        derivedDataset,
        setDerived,
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
        {children}
    </DerivedContext.Provider>
}

export default DerivedContext