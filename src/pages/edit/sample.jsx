import React, {useEffect, useState, useContext} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Form} from 'react-bootstrap';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import AncestorId from "../../components/custom/edit/sample/AncestorId";
import SampleCategory from "../../components/custom/edit/sample/SampleCategory";
import AncestorInformationBox from "../../components/custom/edit/sample/AncestorInformationBox";
import log from "loglevel";
import {cleanJson, fetchEntity, getDOIPattern, getRequestHeaders} from "../../components/custom/js/functions";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import {update_create_entity} from "../../lib/services";
import Unauthorized from "../../components/custom/layout/Unauthorized";
import AppFooter from "../../components/custom/layout/AppFooter";
import GroupSelect from "../../components/custom/edit/GroupSelect";
import Header from "../../components/custom/layout/Header";

import AppContext from '../../context/AppContext'
import { EntityProvider } from '../../context/EntityContext'
import EntityContext from '../../context/EntityContext'
import Spinner from '../../components/custom/Spinner'
import { ENTITIES } from '../../config/constants'
import EntityHeader from '../../components/custom/layout/entity/Header'
import EntityFormGroup from "../../components/custom/layout/entity/FormGroup";



function EditSample() {
    const { isUnauthorized, getModal, setModalDetails,
        data, setData,
        error, setError,
        values, setValues,
        errorMessage, setErrorMessage,
        validated, setValidated,
        userWriteGroups, onChange, 
        editMode, setEditMode, isEditMode,
        selectedUserWriteGroupUuid,
        disableSubmit, setDisableSubmit } = useContext(EntityContext)
    const { _t } = useContext(AppContext)

    const router = useRouter()
    
    const [source, setSource] = useState(null)
    const [sourceId, setSourceId] = useState(null)

    // only executed on init rendering, see the []
    useEffect(() => {
        

        // declare the async data fetching function
        const fetchData = async (uuid) => {
            log.debug('editSample: getting data...', uuid)
            // get the data from the api
            const response = await fetch("/api/find?uuid=" + uuid, getRequestHeaders());
            // convert the data to json
            const data = await response.json();

            log.debug('editSample: Got data', data)
            if (data.hasOwnProperty("error")) {
                setError(true)
                setErrorMessage(data["error"])
            } else {
                setData(data);
                // Set state with default values that will be PUT to Entity API to update
                setValues({
                    'sample_category': data.sample_category,
                    'organ': data.organ,
                    'organ_other': data.organ_other,
                    'protocol_url': data.protocol_url,
                    'lab_tissue_sample_id': data.lab_tissue_sample_id,
                    'description': data.description,
                    'direct_ancestor_uuid': data.immediate_ancestors[0].uuid
                })
                setEditMode("Edit")

                if (data.hasOwnProperty("immediate_ancestors")) {
                    await fetchSource(data.immediate_ancestors[0].uuid);
                }
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
            setSourceId(null)
        }
    }, [router]);

    const fetchSource = async (sourceId) => {
        let source = await fetchEntity(sourceId);
        if (source.hasOwnProperty("error")) {
            setError(true)
            setErrorMessage(source["error"])
        } else {
            setSource(source);
            setSourceId(source.sennet_id)
        }
    }

    const handleSubmit = async (event) => {
        setDisableSubmit(true);

        const form = event.currentTarget.parentElement;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            log.debug("Form is invalid")
            setDisableSubmit(false);
        } else {
            event.preventDefault();
            log.debug("Form is valid")

            if (values['group_uuid'] === null && editMode === 'Create') {
                values['group_uuid'] = selectedUserWriteGroupUuid
            }

            // Remove empty strings
            let json = cleanJson(values);
            let uuid = data.uuid

            await update_create_entity(uuid, json, editMode, ENTITIES.sample, router).then((response) => {
                setModalDetails({entity: ENTITIES.sample, type: response.sample_category, 
                    typeHeader: _t('Sample Category'), response})
                
            }).catch((e) => log.error(e))
        }

        setValidated(true);
    };

    if (!data) {
        return (
            isUnauthorized() ? <Unauthorized /> : <Spinner />
        )
    } else  {
        return (
            <>
                {editMode &&
                    <Header title={`${editMode} Sample | SenNet`}></Header>
                }

                <AppNavbar/>

                {error &&
                    <div className="alert alert-warning" role="alert">{errorMessage}</div>
                }
                {data && !error &&
                    <div className="no_sidebar">
                        <Layout
                            bodyHeader={
                                <EntityHeader entity={ENTITIES.sample} isEditMode={isEditMode()} data={data} /> 
                               
                            }
                            bodyContent={
                                <Form noValidate validated={validated}>
                                    {/*Group select*/}
                                    {
                                        !(userWriteGroups.length === 1 || isEditMode()) &&
                                        <GroupSelect
                                            data={data}
                                            groups={userWriteGroups}
                                            onGroupSelectChange={onChange}
                                            entity_type={'sample'}/>
                                    }

                                    {/*Ancestor ID*/}
                                    {/*editMode is only set when page is ready to load */}
                                    {editMode &&
                                        <AncestorId source={source} onChange={onChange} fetchSource={fetchSource}/>
                                    }

                                    {/*Source Information Box*/}
                                    {source &&
                                        <AncestorInformationBox ancestor={source}/>
                                    }

                                    {/*/!*Tissue Sample Type*!/*/}
                                    {((isEditMode() && source) || (editMode === 'Create')) &&
                                        <SampleCategory data={data} source={source} onChange={onChange}/>
                                    }

                                    {/*/!*Preparation Protocol*!/*/}
                                    <EntityFormGroup label="Preparation Protocol" placeholder='protocols.io DOI'
                                        controlId='protocol_url' value={data.protocol_url} isRequired={true} pattern={getDOIPattern()}
                                        onChange={onChange} text='The protocol used when procuring or preparing the tissue. This must be provided as a protocols.io DOI URL see https://www.protocols.io/' />

                                    {/*/!*Lab Sample ID*!/*/}
                                    <EntityFormGroup label='Lab Sample ID' placeholder='Lab specific alpha-numeric ID' controlId='lab_tissue_sample_id' 
                                        value={data.lab_tissue_sample_id} 
                                        onChange={onChange} text='An identifier used by the lab to identify the specimen, this
                                        can be an identifier from the system used to track the specimen in the lab. This field will be entered by the user.' />

                                    
                                    {/*/!*Description*!/*/}
                                    <EntityFormGroup label='Description' type='textarea' controlId='description' value={data.description} 
                                        onChange={onChange} text='A free text description of the specimen.' />
                                    

                                    <Button variant="outline-primary rounded-0" onClick={handleSubmit} disabled={disableSubmit}>
                                        {_t('Submit')}
                                    </Button>
                                </Form>
                            }
                        />
                    </div>
                }
                <AppFooter/>

                {getModal()}
            </>
        )
    } 
}

EditSample.withWrapper = function(page) {
    return <EntityProvider>{page}</EntityProvider>
}

export default EditSample