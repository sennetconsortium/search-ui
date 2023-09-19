import React, {useContext, useEffect, useState, useRef} from "react";
import {useRouter} from 'next/router';
import {Button, Form} from 'react-bootstrap';
import {Layout} from "@elastic/react-search-ui-views";
import log from "loglevel";
import {
    cleanJson,
    equals,
    getRequestHeaders,
    getStatusColor
} from "../../components/custom/js/functions";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import {
    update_create_dataset
} from "../../lib/services";
import Unauthorized from "../../components/custom/layout/Unauthorized";
import AppFooter from "../../components/custom/layout/AppFooter";
import GroupSelect from "../../components/custom/edit/GroupSelect";
import Header from "../../components/custom/layout/Header";
import AppContext from '../../context/AppContext'
import EntityContext, {EntityProvider} from '../../context/EntityContext'
import Spinner from '../../components/custom/Spinner'
import EntityHeader from '../../components/custom/layout/entity/Header'
import EntityFormGroup from '../../components/custom/layout/entity/FormGroup'
import {Alert, Badge} from 'react-bootstrap';
import SenNetPopover, {SenPopoverOptions} from "../../components/SenNetPopover";
import $ from "jquery";
import DatasetSubmissionButton from "../../components/custom/edit/dataset/DatasetSubmissionButton";
import DatasetRevertButton from "../../components/custom/edit/dataset/DatasetRevertButton";


function EditUpload() {
    const { isUnauthorized, isAuthorizing, getModal, setModalDetails,
        data, setData,
        error, setError,
        values, setValues,
        errorMessage, setErrorMessage,
        validated, setValidated,
        userWriteGroups, onChange,
        editMode, setEditMode,isEditMode,
        showModal,
        selectedUserWriteGroupUuid,
        disableSubmit, setDisableSubmit,
        dataAccessPublic, setDataAccessPublic,
        getCancelBtn } = useContext(EntityContext)
    const { _t, cache, adminGroup, getGroupName } = useContext(AppContext)

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
            const response = await fetch("/api/find?uuid=" + uuid, getRequestHeaders());
            // convert the data to json
            const data = await response.json();

            log.debug('editUpload: Got data', data)
            if (data.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(data["error"])
            } else {
                setData(data);

                // Set state with default values that will be PUT to Entity API to update
                let _values = {
                    'title': data.title,
                    'description': data.description,
                    'status': data.status,
                }

                setValues(_values)
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

            if (values['group_uuid'] === null && !isEditMode()) {
                values['group_uuid'] = selectedUserWriteGroupUuid
            }

            // Remove empty strings
            let json = cleanJson(values);

            handlePut(editMode, json)
        }

        setValidated(true);
    };

    const handleValidate = () => {
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
        handlePut('reorganize')
    }

    if (isAuthorizing() || isUnauthorized()) {
        return (
            isUnauthorized() ? <Unauthorized /> : <Spinner />
        )
    } else {
        console.log(values)
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
                                <EntityHeader adminGroup={adminGroup} entity={cache.entities.upload} isEditMode={isEditMode()} data={data} values={values} />
                            }
                            bodyContent={
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

                                    {/*Title*/}
                                    <EntityFormGroup label="Upload Title" placeholder='Upload Title'
                                                     controlId='title' value={data.title}
                                                     isRequired={true}
                                                     onChange={onChange}
                                                     text={<>A meaningful title for the <code>Upload</code>.
                                                     </>}/>

                                    {/*/!*Description*!/*/}
                                    <EntityFormGroup isRequired={true} label='Description' type='textarea' controlId='description' value={data.description}
                                                     onChange={onChange} text={<>Free text field to enter a description of the <code>Upload</code>.</>} />


                                    <div className={'d-flex flex-row-reverse'}>
                                        {getCancelBtn('upload')}


                                        {!equals(data['status'], 'Reorganized') &&
                                            <SenNetPopover text={<>Save changes to this <code>Upload</code>.</>} className={'save-button'}>
                                                <Button variant="outline-primary rounded-0 js-btn--save"
                                                        className={'me-2'}
                                                        onClick={handleSave}
                                                        disabled={disableSubmit}>
                                                    {_t('Save')}
                                                </Button>
                                            </SenNetPopover>
                                        }

                                        {isEditMode() && (equals(data['status'], 'New') || equals(data['status'], 'Valid')) &&
                                            <SenNetPopover text={<>Mark this <code>Upload</code> as "Submitted" and ready for reorganizing.</>} className={'submit-dataset'}>
                                                <DatasetSubmissionButton
                                                    btnLabel={"Submit"}
                                                    modalBody={<div><p>By clicking "Submit" this <code>Upload</code> will
                                                        have its status set to <span className={`${getStatusColor('Submitted')} badge`}>Submitted</span> and
                                                        be ready for reorganizing.</p>
                                                        <p>
                                                            Before submitting your <code>Upload</code> please confirm that all files (including metadata/contributors TSVs) have been uploaded in Globus.
                                                        </p>
                                                    </div>}
                                                    onClick={handleSubmit} disableSubmit={disableSubmit}/>
                                            </SenNetPopover>
                                        }

                                        {adminGroup && isEditMode() && !(equals(data['status'], 'Processing')  || equals(data['status'], 'Reorganized')) && <SenNetPopover
                                            text={<>Validate upload.
                                            </>}
                                            className={'validate-button'}>
                                            <Button className="me-2" variant="outline-primary rounded-0"
                                                    onClick={handleValidate}>
                                                Validate
                                            </Button>
                                        </SenNetPopover>}

                                        {adminGroup && isEditMode() && (equals(data['status'], 'Error') || equals(data['status'], 'Invalid') || equals(data['status'], 'Submitted')) && <SenNetPopover
                                            text={<>Revert this <code>Upload</code> back to <span className={`${getStatusColor('New')} badge`}>New</span> or <span className={`${getStatusColor('Submitted')} badge`}>Submitted</span>  status.
                                            </>}
                                            className={'revert-button'}>
                                            <DatasetRevertButton data={data} onClick={handleRevert} disableSubmit={disableSubmit} onStatusChange={onChange} />
                                        </SenNetPopover>}
                                    </div>
                                    {getModal()}
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

EditUpload.withWrapper = function(page) {
    return <EntityProvider>{page}</EntityProvider>
}

export default EditUpload
