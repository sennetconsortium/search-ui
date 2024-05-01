import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import SenNetAccordion from "../../layout/SenNetAccordion";
import {datasetIs, eq, getRequestHeaders} from "../../js/functions";
import FileTreeView from "./FileTreeView";

function DataProducts({ data }) {

    const [files, setFiles] = useState(null)

    const filterFiles = (allFiles) => {
        if (!allFiles) return
        let _files = []
        for (let file of allFiles) {
            if (file.is_data_product) {
                _files.push(file)
            }
        }
        setFiles(_files)
    }
    const fetchData = async () => {
        if (datasetIs.primary(data.creation_action)) {
            let _files = []
            for (let entity of data.descendants) {
                if (datasetIs.processed(entity.creation_action)) {
                    const response = await fetch("/api/find?uuid=" + entity.uuid, getRequestHeaders());
                    const processed = await response.json();
                    _files = _files.concat(processed.files)
                }
            }
            filterFiles(_files)
        } else {
            filterFiles(data.files)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <SenNetAccordion title={'Data Products'} id={'data-products'}>
                {files && (files.length > 0) && <FileTreeView data={{files, uuid: data.uuid}}
                                                              showQAButton={false}
                                                              showDataProductButton={false}
                                                              loadDerived={false}
                                                              treeViewOnly={true}
                                                              className={'c-treeView__main--inTable'} />}
            </SenNetAccordion>
        </>
    )
}

DataProducts.defaultProps = {}

DataProducts.propTypes = {
    children: PropTypes.node
}

export default DataProducts