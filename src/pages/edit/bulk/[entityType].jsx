import React, {useContext} from 'react';
import BulkCreate from "../../../components/custom/bulk/BulkCreate";
import AppNavbar from "../../../components/custom/layout/AppNavbar";
import Unauthorized from "../../../components/custom/layout/Unauthorized";
import {useRouter} from 'next/router'
import {getIngestEndPoint} from "../../../config/config";
import EntityContext, {EntityProvider} from "../../../context/EntityContext";
import Spinner from "../../../components/custom/Spinner";
import AppContext from "../../../context/AppContext";
import NotFound from "../../../components/custom/NotFound";

export default function EditBulk() {
    const {cache, supportedMetadata} = useContext(AppContext)

    const {
        isUnauthorized,
        isAuthorizing,
        userWriteGroups,
        handleHome
    } = useContext(EntityContext)

    const router = useRouter()
    let entityType = router.query['entityType']
    entityType = entityType.toLowerCase()
    let subType = router.query['category']
    const isMetadata = router.query['action'] === 'metadata'
    let result

    if (isAuthorizing() || isUnauthorized()) {
        return (
            isUnauthorized() ? <Unauthorized/> : <Spinner/>
        )
    } else {
        if (subType) {
            //ensure formatting
            subType = subType.toLowerCase()
            subType = subType.upperCaseFirst()
        }

        let supportedEntities = Object.keys(cache.entities)
        const isSupported = () => {
            if (isMetadata) {
                let supp = supportedMetadata()[cache.entities[entityType]]
                return supp ? supp.categories.includes(subType) : false
            } else {
                return (supportedEntities.includes(entityType))
            }
        }
        if (isSupported()) {
            result = <>
                <AppNavbar/>
                <BulkCreate
                    entityType={entityType}
                    subType={subType}
                    userWriteGroups={userWriteGroups}
                    handleHome={handleHome}
                    isMetadata={isMetadata}
                />
            </>
        } else {
            return (<NotFound />)
        }
    }


    return (result)
}

EditBulk.withWrapper = function (page) {
    return <EntityProvider>{page}</EntityProvider>
}

