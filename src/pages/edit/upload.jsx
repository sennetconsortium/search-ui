import dynamic from "next/dynamic";
import React, {useContext, useEffect, useState} from "react";
import {useRouter} from 'next/router';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Layout} from "@elastic/react-search-ui-views";
import log from "loglevel";
import {cleanJson, eq, getRequestHeaders, getStatusColor, getUBKGFullName} from "@/components/custom/js/functions";
import {getEntityData, update_create_dataset} from "@/lib/services";
import AppContext from '@/context/AppContext'
import EntityContext, {EntityProvider} from '@/context/EntityContext'
import $ from "jquery";
import DatasetRevertButton, {statusRevertTooltip} from "@/components/custom/edit/dataset/DatasetRevertButton";

const AppFooter = dynamic(() => import("@/components/custom/layout/AppFooter"))
const AppNavbar = dynamic(() => import("@/components/custom/layout/AppNavbar"))
const DatasetSubmissionButton = dynamic(() => import("@/components/custom/edit/dataset/DatasetSubmissionButton"))
const DatasetType = dynamic(() => import("@/components/custom/edit/dataset/DatasetType"))
const EntityHeader = dynamic(() => import('@/components/custom/layout/entity/Header'))
const EntityFormGroup = dynamic(() => import('@/components/custom/layout/entity/FormGroup'))
const GroupSelect = dynamic(() => import("@/components/custom/edit/GroupSelect"))
const Header = dynamic(() => import("@/components/custom/layout/Header"))
const SenNetAlert = dynamic(() => import("@/components/SenNetAlert"))
const SenNetPopover = dynamic(() => import("@/components/SenNetPopover"))
const SourceType = dynamic(() => import("@/components/custom/edit/source/SourceType"))

function EditUpload() {
    const {
        isPreview, getModal, setModalDetails,
        data, setData,
        error, setError,
        values, setValues,
        errorMessage, setErrorMessage,
        validated, setValidated,
        userWriteGroups, onChange,
        editMode, setEditMode, isEditMode,
        showModal,
        selectedUserWriteGroupUuid,
        disableSubmit, setDisableSubmit,
        dataAccessPublic, setDataAccessPublic,
        getCancelBtn, isAdminOrHasValue, getAssignedToGroupNames
    } = useContext(EntityContext)
    const {_t, cache, adminGroup, getBusyOverlay, toggleBusyOverlay, getPreviewView} = useContext(AppContext)
    const router = useRouter()
    const [source, setSource] = useState(null)


    // Disable all form elements if data_access_level is "public"
    // Wait until "sampleCategories" and "editMode" are set prior to running this
    useEffect(() => {
        if (dataAccessPublic === true) {
            const form = document.getElementById("upload-form");
            const elements = form?.elements;
            for (let i = 0, len = elements?.length; i < len; ++i) {
                elements[i].setAttribute('disabled', true);
            }
        }
    }, [dataAccessPublic, editMode])

    // only executed on init rendering, see the []
    useEffect(() => {

        // declare the async data fetching function
        const fetchData = async (uuid) => {
            log.debug('editUpload: getting data...', uuid)
            // get the data from the api
            const _data = await getEntityData(uuid, ['ancestors', 'descendants']);

            log.debug('editUpload: Got data', _data)
            if (_data.hasOwnProperty("error")) {
                setError(true)
                setData(false)
                setErrorMessage(_data["error"])
            } else {
                setData(_data);

                // Set state with default values that will be PUT to Entity API to update
                let _values = {
                    'title': _data.title,
                    'ingest_task': adminGroup ? _data.ingest_task : undefined,
                    'description': _data.description,
                    'assigned_to_group_name': adminGroup ? _data.assigned_to_group_name : undefined,
                    'status': _data.status,
                }

                setValues(_values)
                setEditMode("Edit")
                setDataAccessPublic(_data.data_access_level === 'public')
            }
        }

        if (router.query.hasOwnProperty("uuid")) {
            if (eq(router.query.uuid, 'register')) {
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
            setSource(null)
        }
    }, [router]);

    const modalResponse = (response) => {
        setValues({...values, status: response.status})
        setModalDetails({
            entity: cache.entities.upload,
            type: response.status,
            typeHeader: _t('Status'),
            response
        })
    }

    const handlePut = async (action, body = {}) => {
        await update_create_dataset(data.uuid, body, action, 'uploads').then((response) => {
            toggleBusyOverlay(false)
            modalResponse(response)
        }).catch((e) => log.error(e))
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
            log.debug("Form is valid")

            const assignedToGroupName = values['assigned_to_group_name']
            const ingestTask = values['ingest_task']
            if (values['group_uuid'] === null && !isEditMode()) {
                values['group_uuid'] = selectedUserWriteGroupUuid
            }

            // Remove empty strings
            let json = cleanJson(values);

            // Prevent the 400 bad request error on same status
            if (eq(json.status, values.status)) {
                delete json['status']
            }

            if (adminGroup && assignedToGroupName?.isEmpty()) {
                json['assigned_to_group_name'] = ''
            }

            if (adminGroup && ingestTask?.isEmpty()) {
                json['ingest_task'] = ''
            }

            handlePut(editMode, json)
        }

        setValidated(true);
    };

    const handleValidate = () => {
        toggleBusyOverlay(true, <><code>Validate</code> the <code>Upload</code></>)
        handlePut('validate')
    }

    const handleRevert = async () => {
        const json = {
            status: values.status,
            validation_message: "",
        }
        handlePut(editMode, json)
    }

    const handleSubmit = () => {
        handlePut('submit')
    }

    const handleReorganize = () => {
        toggleBusyOverlay(true, <><code>Reorganize</code> the <code>Upload</code></>)
        handlePut('reorganize')
    }

    if (isPreview(error))  {
        return getPreviewView(data)
    } else {
        return (
            <>
                {editMode &&
                    <Header title={`${editMode} Upload | SenNet`}></Header>
                }

                <AppNavbar/>

                {error &&
                    <div><Alert variant='warning'>{_t(errorMessage)}</Alert></div>
                }
                {data && !error &&
                    <div className="no_sidebar">
                        <Layout
                            bodyHeader={
                                <EntityHeader adminGroup={adminGroup} entity={cache.entities.upload}
                                              isEditMode={isEditMode()} data={data} values={values}/>
                            }
                            bodyContent={
                                <>
                                    {editMode && editMode === 'Register' &&
                                        <SenNetAlert variant={'warning'}
                                                     text={<> This page is intended for registering a single data
                                                         upload. An upload is a unique entity with one SenNet ID and
                                                         Globus location. Valid uploads will be reorganized into
                                                         individual datasets with their own SenNet IDs by CODCC
                                                         Curation. Uploads must have directory structures, contributors,
                                                         and metadata files per the <a target="_blank"
                                                                                       href={"https://docs.google.com/document/d/1jXjUhC9ErfU7CVe5UGA5UEYx1MIXTq7KmDpF0s69ZsY/edit#heading=h.35zdcmzbs5a0"}>Data
                                                             Submission Guide</a>. A new section
                                                         on this topic is forthcoming as of 2023-09-29. For now, please
                                                         schedule a <a target="_blank"
                                                                       href={"https://calendly.com/bhonick-psc/30min"}>Data
                                                             Submission Office Hours</a> meeting with the
                                                         Curation team or email the Help Desk for guidance on
                                                         constructing an upload.
                                                         {/*<br></br><br></br>*/}
                                                         {/*Temporarily removing this line*/}
                                                         {/*If a data provider would rather have SenNet IDs for their*/}
                                                         {/*datasets as soon as possible, CODCC Curation recommends bulk*/}
                                                         {/*dataset registration through <a*/}
                                                         {/*    href={getRootURL() + 'edit/bulk/dataset?action=register'}>this*/}
                                                         {/*    page</a>.*/}
                                                     </>}
                                                     icon={<i className="bi bi-exclamation-triangle-fill"></i>}/>
                                    }
                                    <Form noValidate validated={validated} onSubmit={handleSave} id={"upload-form"}>
                                        {/*Group select*/}
                                        {
                                            !(userWriteGroups.length === 1 || isEditMode()) &&
                                            <GroupSelect
                                                data={data}
                                                groups={userWriteGroups}
                                                onGroupSelectChange={onChange}
                                                entity_type={'source'}/>
                                        }

                                        {
                                            isAdminOrHasValue(adminGroup, 'assigned_to_group_name') && isEditMode() &&
                                            <GroupSelect
                                                optionValueProp={'displayname'}
                                                isDisabled={!adminGroup}
                                                title={'Assigned to Group Name'}
                                                required={false}
                                                controlId={'assigned_to_group_name'}
                                                popover={<>The group responsible for the next step in the data ingest
                                                    process.</>}
                                                data={data}
                                                value={data.assigned_to_group_name}
                                                groups={getAssignedToGroupNames(adminGroup)}
                                                onGroupSelectChange={onChange}
                                                entity_type={'dataset'}/>
                                        }

                                        {/*/!*Ingest*!/*/}
                                        {isEditMode() && isAdminOrHasValue(adminGroup, 'ingest_task') &&
                                            <EntityFormGroup label='Ingest Task'
                                                             isDisabled={!adminGroup}
                                                             type={'textarea'}
                                                             controlId='ingest_task' value={data.ingest_task}
                                                             onChange={onChange}
                                                             text={<>The next task in the data ingest process.</>}/>}

                                        {/*Title*/}
                                        <EntityFormGroup label="Upload Title" placeholder='Upload Title'
                                                         controlId='title' value={data.title}
                                                         isRequired={true}
                                                         onChange={onChange}
                                                         text={<>A meaningful title for the <code>Upload</code>.
                                                         </>}/>

                                        {/*/!*Description*!/*/}
                                        <EntityFormGroup isRequired={true} label='Description' type='textarea'
                                                         controlId='description' value={data.description}
                                                         onChange={onChange}
                                                         text={<>Free text field to enter a description of
                                                             the <code>Upload</code>.</>}/>

                                        {/*/!*Intended Dataset Type*!/*/}
                                         <DatasetType
                                            datasetTypes={Object.values(cache.datasetTypes)}
                                            label={'Intended Dataset Type'}
                                            labelDescription={<>The dataset type of the intended datasets that will be
                                                uploaded as part of this <code>Upload</code>.</>}
                                            dataValue={'intended_dataset_type'}
                                            values={values} data={data} onChange={onChange}/>

                                        {/*/!*Intended Organ*!/*/}
                                        <Form.Group className="mb-3" controlId="intended_organ_group">
                                            <Form.Label>Intended Organ<span
                                                className="required">* </span>
                                                <SenNetPopover className={'intended_organ'}
                                                               text={<>The organ that the data contained in
                                                                   this <code>Upload</code> will be
                                                                   registered/associated with.</>}>
                                                    <i className={'bi bi-question-circle-fill'}></i>
                                                </SenNetPopover>
                                            </Form.Label>

                                            <Form.Select required aria-label="Intended Organ" id="intended_organ" onChange={e => {
                                                onChange(e, e.target.id, e.target.value)
                                            }}
                                                         defaultValue={data.intended_organ}>
                                                <option value="">----</option>
                                                {Object.entries(cache.organTypes).map(op => {
                                                    return (
                                                        <option key={op[0]} value={op[0]}>
                                                            {op[1]}
                                                        </option>
                                                    );

                                                })}
                                            </Form.Select>

                                        </Form.Group>

                                        {/*Intended Source Type*/}
                                        <SourceType data={data} onChange={onChange}
                                                    label={'Intended Source Type'}
                                                    dataValue={'intended_source_type'}
                                                    labelDescription={<>The source type that the data contained in
                                                        this <code>Upload</code> will be registered/associated with.</>}

                                        />


                                        <div className={'d-flex flex-row-reverse'}>
                                            {getCancelBtn('upload')}


                                            {!eq(data['status'], 'Processing') && !eq(data['status'], 'Reorganized') &&
                                                <SenNetPopover text={<>Save changes to this <code>Upload</code>.</>}
                                                               className={'save-button'}>
                                                    <Button variant="outline-primary rounded-0 js-btn--save"
                                                            className={'me-2'}
                                                            onClick={handleSave}
                                                            disabled={disableSubmit}>
                                                        {_t('Save')}
                                                    </Button>
                                                </SenNetPopover>
                                            }

                                            {!eq(data['status'], 'Processing') && isEditMode() && (eq(data['status'], 'New') || eq(data['status'], 'Valid')) &&
                                                <SenNetPopover
                                                    text={<>Mark this <code>Upload</code> as "Submitted" and ready for
                                                        reorganizing.</>} className={'initiate-upload-submission'}>
                                                    <DatasetSubmissionButton
                                                        btnLabel={"Submit"}
                                                        modalBody={<div><p>By clicking "Submit"
                                                            this <code>Upload</code> will
                                                            have its status set to <span
                                                                className={`${getStatusColor('Submitted')} badge`}>Submitted</span> and
                                                            be ready for reorganizing.</p>
                                                            <p>
                                                                Before submitting your <code>Upload</code> please
                                                                confirm that all files (including metadata/contributors
                                                                TSVs) have been uploaded in Globus.
                                                            </p>
                                                        </div>}
                                                        onClick={handleSubmit} disableSubmit={disableSubmit}/>
                                                </SenNetPopover>
                                            }

                                            {adminGroup && isEditMode() && !(eq(data['status'], 'Processing') || eq(data['status'], 'Reorganized')) &&
                                                <SenNetPopover
                                                    text={<>Validate upload.
                                                    </>}
                                                    className={'initiate-upload-validation'}>
                                                    <DatasetSubmissionButton
                                                        actionBtnClassName={'js-btn--validate'}
                                                        btnLabel={"Validate"}
                                                        modalTitle={'Validation'}
                                                        modalBody={<div><p>By clicking "Validate"
                                                            this <code>Upload</code> will
                                                            have its status set to <span
                                                                className={`${getStatusColor('Valid')} badge`}>Valid</span> if
                                                            upload checks are met and
                                                            be ready for submitting.</p>
                                                        </div>}
                                                        onClick={handleValidate} disableSubmit={disableSubmit}/>
                                                </SenNetPopover>}

                                            {!eq(data['status'], 'Processing') && adminGroup && isEditMode() && (eq(data['status'], 'Valid') || eq(data['status'], 'Submitted')) &&
                                                <SenNetPopover
                                                    text={<>Reorganize this <code>Upload</code>.
                                                    </>}
                                                    className={'initiate-upload-reorganization'}>
                                                    <DatasetSubmissionButton
                                                        actionBtnClassName={'js-btn--reorganize'}
                                                        btnLabel={"Reorganize"}
                                                        modalTitle={'Reorganization'}
                                                        modalBody={<div><p>By clicking "Reorganize"
                                                            this <code>Upload</code> will
                                                            have its status set to <span
                                                                className={`${getStatusColor('Processing')} badge`}>Processing</span> and
                                                            corresponding Datasets and respective directories created
                                                            and moved accordingly.</p>
                                                        </div>}
                                                        onClick={handleReorganize} disableSubmit={disableSubmit}/>
                                                </SenNetPopover>}

                                            {!['Processing', 'Published', 'Reorganized'].contains(data['status']) && adminGroup && isEditMode() &&
                                                <SenNetPopover
                                                    text={statusRevertTooltip(cache.entities.upload)}
                                                    className={'initiate-upload-status-change'}>
                                                    <DatasetRevertButton data={data} onClick={handleRevert}
                                                                         disableSubmit={disableSubmit}
                                                                         onStatusChange={onChange}/>
                                                </SenNetPopover>}
                                        </div>
                                        {getModal()}
                                        {getBusyOverlay()}
                                    </Form>
                                </>
                            }
                        />
                    </div>
                }
                {!showModal && <AppFooter/>}

            </>
        )
    }
}

EditUpload.withWrapper = function (page) {
    return <EntityProvider>{page}</EntityProvider>
}

export default EditUpload
