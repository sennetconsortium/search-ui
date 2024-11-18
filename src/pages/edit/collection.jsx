import dynamic from "next/dynamic";
import {EntityProvider} from "@/context/EntityContext";
import React from "react";

const EditCollection = dynamic(() => import("@/components/custom/entities/collection/EditCollection.jsx"))

function CollectionEdit() {

    return (
        <EditCollection collectionType={'Collection'} entitiesTableLabel={'Entities'} entitiesButtonLabel={'entity'}/>
    )
}

CollectionEdit.withWrapper = function (page) {
    return <EntityProvider>{page}</EntityProvider>
}

export default CollectionEdit
