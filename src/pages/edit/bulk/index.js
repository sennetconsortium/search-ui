import React, {useContext} from 'react';
import BulkCreate from "../../../components/custom/bulk/BulkCreate";
import AppNavbar from "../../../components/custom/layout/AppNavbar";
import Unauthorized from "../../../components/custom/layout/Unauthorized";
import {useRouter} from 'next/router'
import {getIngestEndPoint} from "../../../config/config";
import EntityContext, {EntityProvider} from "../../../context/EntityContext";
import Spinner from "../../../components/custom/Spinner";

export default function EditBulk() {
    const {
        isUnauthorized,
        isAuthorizing,
        userWriteGroups,
        handleClose,
        handleHome
    } = useContext(EntityContext)

    const router = useRouter()
    const entity_type_query = router.query['entity_type']
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
        switch (entity_type_query) {
            case 'source':
                entity_title = 'Sources'
                exampleFileName = 'example_source.tsv'
                bulkUploadUrl += 'sources/bulk-upload'
                bulkUrl += 'sources/bulk'
                break
            case 'sample':
                entity_title = 'Samples'
                exampleFileName = 'example_sample.tsv'
                bulkUploadUrl += 'samples/bulk-upload'
                bulkUrl += 'samples/bulk'
                break
            case 'dataset':
                entity_title = 'Datasets'
                exampleFileName = 'example_dataset.tsv'
                bulkUploadUrl += 'datasets/bulk-upload'
                bulkUrl += 'datasets/bulk'
                break
            default:
                return (<Unauthorized/>)
        }

        result = <>
            <AppNavbar/>
            <BulkCreate
                entityType={entity_title}
                exampleFileName={exampleFileName}
                bulkUploadUrl={bulkUploadUrl}
                bulkUrl={bulkUrl}
                userWriteGroups={userWriteGroups}
                handleClose={handleClose}
                handleHome={handleHome}
            />
        </>
    }


    return (result)
}

EditBulk.withWrapper = function (page) {
    return <EntityProvider>{page}</EntityProvider>
}

