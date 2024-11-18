import dynamic from "next/dynamic";
import {EntityProvider} from "@/context/EntityContext";
import React, {useEffect} from "react";
import {valid_dataset_ancestor_config} from "@/config/config";

const EditCollection = dynamic(() => import("@/components/custom/entities/collection/EditCollection.jsx"))

function EpicollectionEdit() {
    return (
        <EditCollection collectionType={'Epicollection'} entitiesTableLabel={'Datasets'} entitiesButtonLabel={'dataset'}/>
    )
}

EpicollectionEdit.withWrapper = function (page) {
    return <EntityProvider>{page}</EntityProvider>
}

export default EpicollectionEdit
