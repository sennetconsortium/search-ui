import React, {useEffect, useState} from 'react';
import BulkCreate from "../../../components/custom/bulk/BulkCreate";
import AppNavbar from "../../../components/custom/layout/AppNavbar";
import {getCookie} from "cookies-next";
import Unauthorized from "../../../components/custom/layout/Unauthorized";
import {useRouter} from 'next/router'
import {getIngestEndPoint} from "../../../config/config";
import {get_user_write_groups} from "../../../lib/services";
import log from 'loglevel'

export default function EditBulk() {
    const [userWriteGroups, setUserWriteGroups] = useState(null)
    const authenticated = getCookie('isAuthenticated')
    const router = useRouter()
    const entity_type_query = router.query['entity_type']
    let result

    useEffect(() => {
        get_user_write_groups()
            .then(r => setUserWriteGroups(r.user_write_groups))
            .catch(log.error)
    }, [])

    if (authenticated) {
        let entity_title = ''
        let exampleFileName = ''
        let bulkUploadUrl = ''
        let bulkUrl = ''
        switch (entity_type_query) {
            case 'source':
                entity_title = 'Sources'
                exampleFileName = 'example_source.tsv'
                bulkUploadUrl = getIngestEndPoint() + 'sources/bulk-upload'
                bulkUrl = getIngestEndPoint() + 'sources/bulk'
                break
            case 'sample':
                entity_title = 'Samples'
                exampleFileName = 'example_sample.tsv'
                bulkUploadUrl = getIngestEndPoint() + 'samples/bulk-upload'
                bulkUrl = getIngestEndPoint() + 'samples/bulk'
                break
            case 'dataset':
                entity_title = 'Datasets'
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
            />
        </>
    } else {
        result = <Unauthorized/>
    }


    return (result)
}

