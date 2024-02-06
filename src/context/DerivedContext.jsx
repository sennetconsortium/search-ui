import {createContext, useCallback, useState} from "react";
import $ from "jquery";
import {fetchEntity} from "../components/custom/js/functions";
import {fetchVitessceConfiguration, get_prov_info} from "../lib/services";

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
    const [showVitessce, setShowVitessce] = useState(false)

    // Load the correct Vitessce view config
    const set_vitessce_config = async (data, dataset_id, dataset_type) => {
        fetchVitessceConfiguration(dataset_id).then(config => {
            setVitessceConfig(config)
        }).catch(error => {
            console.error(error)
            setVitessceConfig("")
        })
    }

    const initVitessceConfig = async (data) => {
        // Remove anything in brackets from dataset_type (might need to update this for visium to include parenthesis)
        const dataset_type = data.dataset_type = data.dataset_type.replace(/\s+([\[]).*?([\]])/g, "")

        // Set if primary based on the data_category: primary, component, codcc-processed, lab-processed
        const is_primary_dataset = data.dataset_category === 'primary'
        setIsPrimaryDataset(is_primary_dataset)

        // Determine whether to show the Vitessce visualizations and where to pull data from
        //Check that this dataset has a valid status and has descendants or if we know this isn't a primary dataset
        if (isDatasetStatusPassed(data) && ((is_primary_dataset && data.descendants.length !== 0) || !is_primary_dataset)) {
            if (!is_primary_dataset) {
                setShowVitessce(true)
                await set_vitessce_config(data, data.uuid, dataset_type)

            } else {
                //Call `/prov-info` and check if processed datasets are returned
                const prov_info = await get_prov_info(data.uuid)
                if (prov_info !== {}) {
                    const processed_datasets = prov_info['processed_dataset_uuid']
                    const processed_dataset_statuses = prov_info['processed_dataset_status']
                    // Iterate over processed datasets and check that the status is valid
                    for (let i = 0; i < processed_dataset_statuses.length; i++) {
                        if (isDatasetStatusPassed(processed_dataset_statuses[i])) {
                            fetchEntity(processed_datasets[0]).then(processed_dataset => {
                                // Check that the assay type is supported by Vitessce
                                let processed_dataset_type = processed_dataset.dataset_type.replace(/\s+([\[]).*?([\]])/g, "")
                                setShowVitessce(true)
                                setDerivedDataset(processed_dataset)
                                set_vitessce_config(processed_dataset, processed_dataset.uuid, processed_dataset_type)
                            })
                            break;
                        }
                    }
                }
            }
        }
    }

    const isDatasetStatusPassed = data => {
        if (data.hasOwnProperty('status')) {
            return data.status === "QA" || data.status === 'Published'
        } else {
            return data === "QA" || data === 'Published'
        }
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
        initVitessceConfig,
        showVitessce,
        isPrimaryDataset,
        derivedDataset,
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
    }}>
        {children}
    </DerivedContext.Provider>
}

export default DerivedContext