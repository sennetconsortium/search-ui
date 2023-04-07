import React, {useContext} from 'react';
import BulkCreate from "../../../components/custom/bulk/BulkCreate";
import AppNavbar from "../../../components/custom/layout/AppNavbar";
import Unauthorized from "../../../components/custom/layout/Unauthorized";
import {useRouter} from 'next/router'
import {getIngestEndPoint} from "../../../config/config";
import EntityContext, {EntityProvider} from "../../../context/EntityContext";
import Spinner from "../../../components/custom/Spinner";
import AppContext from "../../../context/AppContext";

export default function EditBulk() {
    const {cache} = useContext(AppContext)

    const {
        isUnauthorized,
        isAuthorizing,
        userWriteGroups,
        handleHome
    } = useContext(EntityContext)

    const router = useRouter()
    const entityType = router.query['entityType']
    const subType = router.query['category']
    const isMetadata = router.query['action'] === 'metadata'
    let result

    if (isAuthorizing() || isUnauthorized()) {
        return (
            isUnauthorized() ? <Unauthorized/> : <Spinner/>
        )
    } else {
        let entity_title = ''
        let exampleFileName = ''
        let bulkUploadUrl = getIngestEndPoint()
        let bulkUrl = getIngestEndPoint()
        let supportedEntities = Object.keys(cache.entities)
        if (supportedEntities.indexOf(entityType) !== -1) {
            result = <>
                <AppNavbar/>
                <BulkCreate
                    entityType={entityType.toLowerCase()}
                    subType={subType}
                    userWriteGroups={userWriteGroups}
                    handleHome={handleHome}
                    isMetadata={isMetadata}
                />
            </>
        } else {
            return (<Unauthorized/>)
        }
    }


    return (result)
}

EditBulk.withWrapper = function (page) {
    return <EntityProvider>{page}</EntityProvider>
}

