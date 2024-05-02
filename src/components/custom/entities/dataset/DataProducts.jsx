import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import SenNetAccordion from "../../layout/SenNetAccordion";
import {datasetIs, eq, getRequestHeaders} from "../../js/functions";
import FileTreeView from "./FileTreeView";

function DataProducts({ files, data }) {


    return (
        <>
            <SenNetAccordion title={'Data Products'} id={'data-products'}>
                {files && (files.length > 0) && <FileTreeView data={{files, uuid: data.uuid}}
                                                              showDownloadAllButton={true}
                                                              showQAButton={false}
                                                              showDataProductButton={false}
                                                              loadDerived={false}
                                                              treeViewOnly={true}
                                                              filesClassName={'js-files'}
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