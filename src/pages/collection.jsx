import dynamic from "next/dynamic";

const ViewCollection = dynamic(() => import("@/components/custom/entities/collection/ViewCollection.jsx"))

function CollectionView() {
    return (
        <ViewCollection collectionType={'Collection'} entitiesLabel={'Entities'}/>
    )
}

export default CollectionView
