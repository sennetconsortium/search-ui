import React, {useContext, useEffect, useState, useRef} from "react";
import {useRouter} from 'next/router';
import {Button, Form} from 'react-bootstrap';
import {Layout} from "@elastic/react-search-ui-views";
import log from "loglevel";
import {cleanJson, getDOIPattern, getRequestHeaders} from "../../components/custom/js/functions";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import {update_create_entity} from "../../lib/services";
import SourceType from "../../components/custom/edit/source/SourceType";
import Unauthorized from "../../components/custom/layout/Unauthorized";
import AppFooter from "../../components/custom/layout/AppFooter";
import GroupSelect from "../../components/custom/edit/GroupSelect";
import Header from "../../components/custom/layout/Header";
import AppContext from '../../context/AppContext'
import EntityContext, {EntityProvider} from '../../context/EntityContext'
import Spinner from '../../components/custom/Spinner'
import {ENTITIES} from "../../config/constants"
import EntityHeader from '../../components/custom/layout/entity/Header'
import EntityFormGroup from '../../components/custom/layout/entity/FormGroup'
import Alert from 'react-bootstrap/Alert';
import ImageSelector from "../../components/custom/edit/ImageSelector";
import MetadataUpload from "../../components/custom/edit/MetadataUpload";
import {SenPopoverOptions} from "../../components/SenNetPopover";
import {BoxArrowUpRight} from "react-bootstrap-icons";
import $ from "jquery";


function EditSource() {
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
        metadata, setMetadata, checkMetadata, getMetadataNote } = useContext(EntityContext)
    const { _t, filterImageFilesToAdd } = useContext(AppContext)

    const router = useRouter()
    const [source, setSource] = useState(null)
    const [imageByteArray, setImageByteArray] = useState([])
    const alertStyle = useRef('info')


    // only executed on init rendering, see the []
    useEffect(() => {

        // declare the async data fetching function
        const fetchData = async (uuid) => {
            log.debug('editSource: getting data...', uuid)
            // get the data from the api
            const response = await fetch("/api/find?uuid=" + uuid, getRequestHeaders());
            // convert the data to json
            const data = await response.json();

            log.debug('editSource: Got data', data)
            if (data.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(data["error"])
            } else {
                setData(data);
                // Set state with default values that will be PUT to Entity API to update
                let _values = {
                    'lab_source_id': data.lab_source_id,
                    'protocol_url': data.protocol_url,
                    'description': data.description,
                    'source_type': data.source_type,
                    'metadata': data.metadata
                }
                if (data.image_files) {
                    _values['image_files'] = data.image_files
                }
                setValues(_values)
                setEditMode("Edit")
            }
        }

        if (router.query.hasOwnProperty("uuid")) {
            if (router.query.uuid === 'create') {
                setData(true)
                setEditMode("Create")
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

            filterImageFilesToAdd(values)

            // Remove empty strings
            let json = cleanJson(values);
            let uuid = data.uuid

            checkMetadata('source_type', supportsMetadata())

            await update_create_entity(uuid, json, editMode, ENTITIES.source, router).then((response) => {
                setModalDetails({entity: ENTITIES.source, type: response.source_type, typeHeader: _t('Source Type'), response})
                if (response.image_files) {
                    setValues(prevState => ({...prevState, image_files: response.image_files}))
                }
                if (values.image_files_to_add) {
                    delete values.image_files_to_add
                }
                if (values.image_files_to_remove) {
                    delete values.image_files_to_remove
                }
                setImageByteArray([])
            }).catch((e) => log.error(e))
        }
        
        setValidated(true);
    };

    const supportsMetadata = () => {
        {/*# TODO: Use ontology*/}
        return values.source_type === 'Mouse'
    }

    const metadataNote = () => {
        {/*# TODO:  1. Update copy text and mailto, format. 2. Use ontology*/}
        let text = []
        text.push(getMetadataNote(ENTITIES.source, 0))
        if (values.source_type === 'Human') {
            alertStyle.current = 'info'
            if (values.metadata) {
                text.push(getMetadataNote(ENTITIES.source, 1))
                return text
            } else {
                // TODO: Card #444 <a href={`mailto:`}>curator</a>
                return <>Please send the <code>{values.source_type} Source</code> metadata to the curator. <br />
                    <small className='text-muted'>For details on what information should be included in your metadata submission, please see &nbsp;
                        <a href='https://docs.sennetconsortium.org/libraries/ingest-validation-tools/schemas/source/' target='_blank' className='lnk--ic'> the docs <BoxArrowUpRight/></a>.
                    </small>
                </>
            }
        } else {
            if (isEditMode() && values.metadata && data.source_type === 'Human') {
                alertStyle.current = 'warning'
                text.push(getMetadataNote(ENTITIES.source, 2, 'type'))
                return text
            } else {
                return false
            }
        }
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
                    <Header title={`${editMode} Source | SenNet`}></Header>
                }

                <AppNavbar/>

                {error &&
                    <Alert variant='warning'>{_t(errorMessage)}</Alert>
                }
                {data && !error &&
                    <div className="no_sidebar">
                        <Layout
                            bodyHeader={
                                <EntityHeader entity={ENTITIES.source} isEditMode={isEditMode()} data={data} />
                            }
                            bodyContent={
                                <Form noValidate validated={validated} onSubmit={handleSave}>
                                    {/*Group select*/}
                                    {
                                        !(userWriteGroups.length === 1 || isEditMode()) &&
                                        <GroupSelect
                                            data={data}
                                            groups={userWriteGroups}
                                            onGroupSelectChange={onChange}
                                            entity_type={'source'}/>
                                    }

                                    {/*Lab's Source Non-PHI ID*/}
                                    <EntityFormGroup label="Lab's Source Non-PHI ID or Name" placeholder='An non-PHI ID or deidentified name used by the lab when referring to the source.'
                                        controlId='lab_source_id' value={data.lab_source_id} isRequired={true}
                                        onChange={onChange} text={<>An identifier used by the lab to identify the <code>Source</code>.</>} />

                                    {/*Source Type*/}
                                    <SourceType data={data} onChange={onChange}/>

                                    {/*Case Selection Protocol*/}
                                    <EntityFormGroup label="Case Selection Protocol" placeholder='protocols.io DOI' popoverTrigger={SenPopoverOptions.triggers.hoverOnClickOff}
                                        controlId='protocol_url' value={data.protocol_url} isRequired={true} pattern={getDOIPattern()}
                                                     onChange={onChange} text={<span>The protocol used when choosing and acquiring the <code>Source</code>. This can be supplied as a DOI from <a href="https://www.protocols.io/." target='_blank' className='lnk--ic'>https://www.protocols.io/ <BoxArrowUpRight/></a>.</span>} />

                                    {/*/!*Description*!/*/}
                                    <EntityFormGroup label='Lab Notes' type='textarea' controlId='description' value={data.description}
                                                     onChange={onChange} text={<>Free text field to enter a description of the <code>Source</code>.</>} />

                                    {metadataNote() && <Alert variant={alertStyle.current}><span>{metadataNote()}</span></Alert>}
                                    {/* Images */}
                                    <ImageSelector editMode={editMode}
                                                   values={values}
                                                   setValues={setValues}
                                                   imageByteArray={imageByteArray}
                                                   setImageByteArray={setImageByteArray}/>

                                    {/*{ values && supportsMetadata() && <MetadataUpload setMetadata={setMetadata} entity={ENTITIES.source} />}*/}
                                    <div className={'d-flex flex-row-reverse'}>
                                        <Button variant="outline-primary rounded-0 js-btn--submit " onClick={handleSave}
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

EditSource.withWrapper = function(page) {
    return <EntityProvider>{page}</EntityProvider>
}

export default EditSource