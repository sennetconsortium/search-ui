import React, {useContext, useEffect, useState, useRef} from "react";
import {useRouter} from 'next/router';
import {Button, Form} from 'react-bootstrap';
import {Layout} from "@elastic/react-search-ui-views";
import log from "loglevel";
import {cleanJson, equals, getDOIPattern, getRequestHeaders} from "../../components/custom/js/functions";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import {update_create_entity, update_create_upload} from "../../lib/services";
import SourceType from "../../components/custom/edit/source/SourceType";
import Unauthorized from "../../components/custom/layout/Unauthorized";
import AppFooter from "../../components/custom/layout/AppFooter";
import GroupSelect from "../../components/custom/edit/GroupSelect";
import Header from "../../components/custom/layout/Header";
import AppContext from '../../context/AppContext'
import EntityContext, {EntityProvider} from '../../context/EntityContext'
import Spinner from '../../components/custom/Spinner'
import EntityHeader from '../../components/custom/layout/entity/Header'
import EntityFormGroup from '../../components/custom/layout/entity/FormGroup'
import Alert from 'react-bootstrap/Alert';
import ImageSelector from "../../components/custom/edit/ImageSelector";
import SenNetAlert from "../../components/SenNetAlert";
import MetadataUpload from "../../components/custom/edit/MetadataUpload";
import {SenPopoverOptions} from "../../components/SenNetPopover";
import {BoxArrowUpRight} from "react-bootstrap-icons";
import $ from "jquery";


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
        metadata, setMetadata, checkMetadata, getMetadataNote, checkProtocolUrl,
        warningClasses, getCancelBtn } = useContext(EntityContext)
    const { _t, cache } = useContext(AppContext)

    const router = useRouter()
    const [source, setSource] = useState(null)
    const [imageByteArray, setImageByteArray] = useState([])
    const alertStyle = useRef('info')


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
            let uuid = data.uuid

            await update_create_upload(uuid, json, editMode).then((response) => {
                setModalDetails({entity: cache.entities.upload, type: response.title, typeHeader: _t('Title'), response})
            }).catch((e) => log.error(e))
        }

        setValidated(true);
    };

    const _onBlur = (e, fieldId, value) => {

        if (fieldId === 'protocol_url') {
            checkProtocolUrl(value)
        }
    };

    if (isAuthorizing() || isUnauthorized()) {
        return (
            isUnauthorized() ? <Unauthorized /> : <Spinner />
        )
    } else {
        console.log(values)
        return (
            <>
                {editMode &&
                    <Header title={`${editMode} Source | SenNet`}></Header>
                }

                <AppNavbar/>

                {error &&
                    <div><Alert variant='warning'>{_t(errorMessage)}</Alert></div>
                }
                {data && !error &&
                    <div className="no_sidebar">
                        <Layout
                            bodyHeader={
                                <EntityHeader entity={cache.entities.upload} isEditMode={isEditMode()} data={data} />
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
                                        <Button className={"me-2"} variant="outline-primary rounded-0 js-btn--save" onClick={handleSave}
                                                disabled={disableSubmit}>
                                            {_t('Save')}
                                        </Button>
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
