import dynamic from "next/dynamic";

const ViewCollection = dynamic(() => import("@/components/custom/entities/collection/ViewCollection.jsx"))

function EpicollectionView() {

    return (
        <ViewCollection collectionType={'Epicollection'} entitiesLabel={'Datasets'}/>
    )
}

export default EpicollectionView
