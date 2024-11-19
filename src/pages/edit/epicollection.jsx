import dynamic from "next/dynamic";
import {EntityProvider} from "@/context/EntityContext";
import React from "react";

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
