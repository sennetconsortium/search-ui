import {createContext, useCallback, useState} from "react";
import $ from "jquery";
import {fetchEntity, getDataTypes, getDataTypesByProperty, getIsPrimaryDataset} from "../components/custom/js/functions";
import {get_prov_info} from "../lib/services";
import {rna_seq} from "../vitessce-view-config/rna-seq/rna-seq-vitessce-config";
import {codex_config} from "../vitessce-view-config/codex/codex-vitessce-config";
import {kuppe2022nature} from "../vitessce-view-config/kuppe_2022_nature";

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
    const set_vitessce_config = (data, dataset_id) => {
        // TODO: Review after change from data_types to dataset_type
        const assayTypes = getDataTypes()
        [data.dataset_type].forEach(assay => {
            switch (assay) {
                case assayTypes['snRNA-seq']:
                case assayTypes['scRNA-seq']:
                case assayTypes['salmon_rnaseq_10x']:
                case assayTypes['salmon_sn_rnaseq_10x']:
                    setVitessceConfig(rna_seq(dataset_id))
                    break
                case assayTypes['codex_cytokit']:
                case assayTypes['codex_cytokit_v1']:
                case assayTypes['CODEX']:
                    setVitessceConfig(codex_config(dataset_id))
                    break
                case assayTypes['Visium']:
                    setVitessceConfig(kuppe2022nature())
                    break
                default:
                    console.log(`No Vitessce config found for assay type: ${assay}`)
            }
        })
    }

    const initVitessceConfig = async (data) => {
        const primary_assays = getDataTypesByProperty("primary", true)
        let is_primary_dataset = getIsPrimaryDataset(data)   //primary_assays.includes(getDataType(data));
        setIsPrimaryDataset(is_primary_dataset)

        // Determine whether to show the Vitessce visualizations and where to pull data from
        //Check that this dataset has a valid status and has descendants or if we know this isn't a primary dataset
        if (isDatasetStatusPassed(data) && ((is_primary_dataset && data.descendants.length !== 0) || !is_primary_dataset)) {
            if (!is_primary_dataset) {
                // Check that the assay type is supported by Vitessce
                if (vitessceSupportedAssays.includes(data.dataset_type)) {
                    setShowVitessce(true)
                    set_vitessce_config(data, data.uuid)
                }

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
                                if (vitessceSupportedAssays.includes(processed_dataset.dataset_type)) {
                                    setShowVitessce(true)
                                    setDerivedDataset(processed_dataset)
                                    set_vitessce_config(processed_dataset, processed_dataset.uuid)
                                }
                            })
                            break;
                        }
                    }
                }
            }
        }
    }

    const vitessceSupportedAssays = (() => {
        const assayTypes = getDataTypes()
        return [
            assayTypes['salmon_rnaseq_10x'],
            assayTypes['salmon_sn_rnaseq_10x'],
            assayTypes['codex_cytokit'],
            assayTypes['codex_cytokit_v1'],
            assayTypes['Visium'],
        ]
    })()

    const isDatasetStatusPassed = data => {
        if(data.hasOwnProperty('status')) {
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