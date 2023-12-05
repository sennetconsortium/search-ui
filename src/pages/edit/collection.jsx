import React, {useContext, useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/router'
import 'bootstrap/dist/css/bootstrap.css'
import {Button, Form} from 'react-bootstrap'
import {Layout} from '@elastic/react-search-ui-views'
import '@elastic/react-search-ui-views/lib/styles/styles.css'
import log from 'loglevel'
import { update_create_entity} from '../../lib/services'
import {
    cleanJson,
    equals,
    fetchEntity,
    getRequestHeaders, isPrimaryAssay
} from '../../components/custom/js/functions'
import AppNavbar from '../../components/custom/layout/AppNavbar'
import AncestorIds from '../../components/custom/edit/dataset/AncestorIds'
import Unauthorized from '../../components/custom/layout/Unauthorized'
import AppFooter from '../../components/custom/layout/AppFooter'
import Header from '../../components/custom/layout/Header'

import AppContext from '../../context/AppContext'
import EntityContext, {EntityProvider} from '../../context/EntityContext'
import Spinner from '../../components/custom/Spinner'
import EntityHeader from '../../components/custom/layout/entity/Header'
import EntityFormGroup from '../../components/custom/layout/entity/FormGroup'
import Alert from 'react-bootstrap/Alert';
import {
    valid_dataset_ancestor_config
} from "../../config/config";
import $ from 'jquery'
import SenNetPopover from "../../components/SenNetPopover"
import AttributesUpload, {getResponseList} from "../../components/custom/edit/AttributesUpload";
import DataTable from "react-data-table-component";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export default function EditCollection() {
    const {
        isUnauthorized, isAuthorizing, getModal, setModalDetails, setSubmissionModal, setCheckDoiModal,
        data, setData,
        error, setError,
        values, setValues,
        errorMessage, setErrorMessage,
        validated, setValidated,
        userWriteGroups, onChange,
        editMode, setEditMode, isEditMode,
        showModal, setShowModal,
        disableSubmit, setDisableSubmit,
        dataAccessPublic, setDataAccessPublic,
        getEntityConstraints,getCancelBtn
    } = useContext(EntityContext)
    const {_t, cache, adminGroup, isLoggedIn, getBusyOverlay, toggleBusyOverlay} = useContext(AppContext)
    const router = useRouter()
    const [ancestors, setAncestors] = useState(null)
    const isPrimary = useRef(false)
    const [contacts, setContacts] = useState([])
    const [contributors, setContributors] = useState([])
    const ingestEndpoint = 'collections/attributes'
    const excludeColumns = ['is_contact']

    useEffect(() => {
        async function fetchAncestorConstraints() {
            const fullBody = [
                {
                    descendants: [{
                        entity_type: cache.entities.dataset
                    }]
                }
            ]

            const response = await getEntityConstraints(fullBody, {order: 'descendants', filter: 'search'})
            if (response.ok) {
                const body = await response.json()
                valid_dataset_ancestor_config['searchQuery']['includeFilters'] = body.description[0].description
            }
        }

        fetchAncestorConstraints()
    }, [])

    // only executed on init rendering, see the []
    useEffect(() => {

        // declare the async data fetching function
        const fetchData = async (uuid) => {
            log.debug('editCollection: getting data...', uuid)
            // get the data from the api
            const response = await fetch("/api/find?uuid=" + uuid, getRequestHeaders());
            // convert the data to json
            const data = await response.json();

            log.debug('editCollection: Got data', data)
            if (data.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(data["error"])
            } else {
                setData(data)
                isPrimary.current = isPrimaryAssay(data)
                let dataset_uuids = []
                if (data.hasOwnProperty("dataset_uuids")) {
                    for (const ancestor of data.dataset_uuids) {
                        dataset_uuids.push(ancestor.uuid)
                    }
                    await fetchLinkedDataset(dataset_uuids)
                }

                // Set state with default values that will be PUT to Entity API to update
                setValues({
                    'title': data.title,
                    'description': data.description,
                    'dataset_uuids': dataset_uuids,
                    'metadata': data.contacts,
                    'creators': data.creators
                })
                setEditMode("Edit")
                setDataAccessPublic(data.data_access_level === 'public')
            }
        }

        if (router.query.hasOwnProperty("uuid")) {
            if (equals(router.query.uuid, 'register')) {
                setData(true)
                setEditMode("Register")
            } else {
                // call the function
                fetchData(router.query.uuid)
                    // make sure to catch any error
                    .catch(console.error);
            }
        } else {
            setData(null);
            setAncestors(null)
        }
    }, [router]);

    async function fetchLinkedDataset(dataset_uuids) {
        let newDatasets = []
        if (ancestors) {
            newDatasets = [...ancestors];
        }

        for (const ancestor_uuid of dataset_uuids) {
            let ancestor = await fetchEntity(ancestor_uuid);
            if (ancestor.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(ancestor["error"])
            } else {
                newDatasets.push(ancestor)
            }
        }
        setAncestors(newDatasets)
    }

    const deleteLinkedDataset = (uuid) => {
        const prevDatasets = [...ancestors];
        log.debug(prevDatasets)
        let updatedDatasets = prevDatasets.filter(e => e.uuid !== uuid);
        setAncestors(updatedDatasets);
        log.debug(updatedDatasets);
    }

    const modalResponse = (response) => {
        toggleBusyOverlay(false)

        setModalDetails({
            entity: cache.entities.collection,
            type: response.title,
            typeHeader: _t('Title'),
            response
        })
    }

    const handleSave = async (event) => {
        setDisableSubmit(true);

        const form = $(event.currentTarget.form)[0]
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            log.debug("Form is invalid")
            setDisableSubmit(false);
        } else {

            event.preventDefault();
            if (values['dataset_uuids'] === undefined || values['dataset_uuids'].length === 0) {
                event.stopPropagation();
                setDisableSubmit(false);
            } else {

                log.debug("Form is valid")


                if(!_.isEmpty(contributors)) {
                    values["creators"] = contributors.description.records
                    values['contacts'] = contacts.description.records
                }

                // Remove empty strings
                let json = cleanJson(values);
                let uuid = data.uuid

                await update_create_entity(uuid, json, editMode, cache.entities.collection).then((response) => {
                    modalResponse(response)
                }).catch((e) => log.error(e))
            }
        }
        setValidated(true);
    };

    const setAttributes = (resp) => {
        if (!resp.description) return
        setContributors(resp)
        let _contacts = []
        for (let creator of resp?.description?.records) {
            if (equals(creator.is_contact, 'true')) {
                _contacts.push(creator)
            }
        }
        setContacts({description: {records: _contacts, headers: resp.description.headers}})
    }

    // TODO: May see a brief flash of this Unauthorized view ...
    if (!isAuthorizing() && !adminGroup) {
        return <Unauthorized/>
    }

    if (isAuthorizing() || isUnauthorized()) {
        return (
            isUnauthorized() ? <Unauthorized/> : <Spinner/>
        )
    } else {

        return (
            <>
                {editMode &&
                    <Header title={`${editMode} Collection | SenNet`}></Header>
                }

                <AppNavbar/>

                {error &&
                    <div><Alert variant='warning'>{_t(errorMessage)}</Alert></div>
                }
                {data && !error &&
                    <div className="no_sidebar">
                        <Layout
                            bodyHeader={
                                <EntityHeader entity={cache.entities.collection} isEditMode={isEditMode()} data={data} values={values} adminGroup={adminGroup} />
                            }
                            bodyContent={
                                <Form noValidate validated={validated} id="collection-form">


                                    {/*Ancestor IDs*/}
                                    {/*editMode is only set when page is ready to load */}
                                    {editMode &&
                                        <AncestorIds controlId={'dataset_uuids'} formLabel={'dataset'} values={values} ancestors={ancestors} onChange={onChange}
                                                     fetchAncestors={fetchLinkedDataset} deleteAncestor={deleteLinkedDataset}/>
                                    }

                                    {/*/!*Lab Name or ID*!/*/}
                                    <EntityFormGroup label='Title' placeholder='The title of the collection'
                                                     controlId='title' value={data.title}
                                                     isRequired={true}
                                                     onChange={onChange}
                                                     text={<>The title of the <code>Collection</code>.</>}/>

                                    {/*/!*Description*!/*/}
                                    <EntityFormGroup label='Description' type='textarea' controlId='description'
                                                     isRequired={true}
                                                     value={data.description}
                                                     onChange={onChange}
                                                     text={<>An abstract publicly available when the <code>Collection</code> is published.</>}/>

                                    <AttributesUpload ingestEndpoint={ingestEndpoint} showAllInTable={true} setAttribute={setAttributes}
                                                      entity={cache.entities.collection} excludeColumns={excludeColumns}
                                                      attribute={'Contributors'} title={<h6>Contributors</h6>}
                                                      customFileInfo={<span><a className='btn btn-outline-primary rounded-0 fs-8' download href={'/bulk/entities/example_collection_contributors.tsv'}> <FileDownloadIcon  />EXAMPLE.TSV</a></span>}/>
                                    {contacts && contacts.description && <div className='c-metadataUpload__table table-responsive'>
                                        <h6>Contacts</h6>
                                        <DataTable
                                            columns={getResponseList(contacts, excludeColumns).columns}
                                            data={contacts.description.records}
                                            pagination />
                                    </div>}

                                    <div className={'d-flex flex-row-reverse'}>

                                        {getCancelBtn('collection')}

                                        {!data.doi_url && <SenNetPopover text={<>Save changes to this <code>Collection</code>.</>} className={'save-button'}>
                                            <Button variant="outline-primary rounded-0 js-btn--save"
                                                    className={'me-2'}
                                                    onClick={handleSave}
                                                    disabled={disableSubmit}>
                                                {_t('Save')}
                                            </Button>
                                        </SenNetPopover>}

                                    </div>
                                    {getModal()}
                                    {getBusyOverlay()}
                                </Form>
                            }
                        />
                    </div>
                }
                {!showModal && <AppFooter/>}
            </>
        )
    }
}

EditCollection.withWrapper = function (page) {
    return <EntityProvider>{page}</EntityProvider>
}
