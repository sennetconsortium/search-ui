import React, {useContext} from 'react';
import BulkCreate from "../../../components/custom/bulk/BulkCreate";
import AppNavbar from "../../../components/custom/layout/AppNavbar";
import Unauthorized from "../../../components/custom/layout/Unauthorized";
import {useRouter} from 'next/router'
import EntityContext, {EntityProvider} from "../../../context/EntityContext";
import Spinner from "../../../components/custom/Spinner";
import AppContext from "../../../context/AppContext";
import NotFound from "../../../components/custom/NotFound";
import AppFooter from "../../../components/custom/layout/AppFooter";
import {eq} from "../../../components/custom/js/functions";
import Header from "../../../components/custom/layout/Header";
import {JobQueueProvider} from "../../../context/JobQueueContext";

export default function EditBulk() {
    const {cache, supportedMetadata} = useContext(AppContext)

    const {
        isUnauthorized,
        isAuthorizing,
        userWriteGroups,
        handleHome
    } = useContext(EntityContext)

    const router = useRouter()
    let entityType = router.query['entityType'] || cache.entities.source
    entityType = cache.entities[entityType?.toLowerCase()]
    let subType = router.query['category'] || cache.sourceTypes.Mouse
    const isMetadata = router.query['action'] === 'metadata'
    let result

    if (eq(entityType, cache.entities.dataset)) {
        window.location = '/edit/upload?uuid=register'
    }

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

        let supportedEntities = Object.values(cache.entities)
        const isSupported = () => {
            console.log('DETAILS', entityType, subType)
            if (isMetadata) {
                return true
            } else {
                return (supportedEntities.includes(entityType))
            }
        }
        if (isSupported()) {
            result = <>
                <Header title={`Bulk Register ${isMetadata ? `Metadata` : entityType.upperCaseFirst()} | SenNet`}></Header>

                <AppNavbar/>
                <BulkCreate
                    entityDetails={{entityType, subType}}
                    userWriteGroups={userWriteGroups}
                    handleHome={handleHome}
                    isMetadata={isMetadata}
                />
                <AppFooter />
            </>
        } else {
            return (<NotFound />)
        }
    }


    return (result)
}

EditBulk.withWrapper = function (page) {
    return <EntityProvider><JobQueueProvider>{page}</JobQueueProvider></EntityProvider>
}

