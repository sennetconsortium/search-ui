import React, {useEffect, useState, useContext} from "react";
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Form} from 'react-bootstrap';
import {Layout} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import log from "loglevel";
import {cleanJson, getDOIPattern, getRequestHeaders} from "../../components/custom/js/functions";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import { update_create_entity} from "../../lib/services";
import SourceType from "../../components/custom/edit/source/SourceType";
import Unauthorized from "../../components/custom/layout/Unauthorized";
import AppFooter from "../../components/custom/layout/AppFooter";
import GroupSelect from "../../components/custom/edit/GroupSelect";
import Header from "../../components/custom/layout/Header";

import AppContext from '../../context/AppContext'
import { EntityProvider } from '../../context/EntityContext'
import EntityContext from '../../context/EntityContext'
import Spinner from '../../components/custom/Spinner'
import { ENTITIES } from "../../config/constants"
import EntityHeader from '../../components/custom/layout/entity/Header'
import EntityFormGroup from '../../components/custom/layout/entity/FormGroup'
import Alert from "../../components/custom/Alert";


function EditSource() {
    const { isUnauthorized, getModal, setModalDetails,
        data, setData,
        error, setError,
        values, setValues,
        errorMessage, setErrorMessage, 
        validated, setValidated,
        userWriteGroups, onChange, 
        editMode, setEditMode,isEditMode,
        showModal,
        selectedUserWriteGroupUuid,
        disableSubmit, setDisableSubmit } = useContext(EntityContext)
    const { _t } = useContext(AppContext)

    const router = useRouter()
    const [source, setSource] = useState(null)

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
                setValues({
                    'lab_source_id': data.lab_source_id,
                    'protocol_url': data.protocol_url,
                    'description': data.description,
                    'source_type': data.source_type
                })
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

            if (values['group_uuid'] === null && !isEditMode()) {
                values['group_uuid'] = selectedUserWriteGroupUuid
            }

            // Remove empty strings
            let json = cleanJson(values);
            let uuid = data.uuid


            await update_create_entity(uuid, json, editMode, ENTITIES.source, router).then((response) => {
                setModalDetails({entity: ENTITIES.source, type: response.source_type, typeHeader: _t('Source Type'), response})
            }).catch((e) => log.error(e))

        }

        setValidated(true);
    };


    if ((!data || isUnauthorized()) && !error) {
        return (
            isUnauthorized() ? <Unauthorized /> : <Spinner />
        )
    } else {
        return (
            <>
                {editMode &&
                    <Header title={`${editMode} Source | SenNet`}></Header>
                }

                <AppNavbar/>

                {error &&
                    <Alert message={errorMessage} />
                }
                {data && !error &&
                    <div className="no_sidebar">
                        <Layout
                            bodyHeader={
                                <EntityHeader entity={ENTITIES.source} isEditMode={isEditMode()} data={data} />
                            }
                            bodyContent={
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                                        onChange={onChange} text='An identifier used by the lab to identify the source.' />

                                    {/*Source Type*/}
                                    <SourceType data={data} onChange={onChange}/>

                                    {/*Case Selection Protocol*/}
                                    <EntityFormGroup label="Case Selection Protocol" placeholder='protocols.io DOI'
                                        controlId='protocol_url' value={data.protocol_url} isRequired={true} pattern={getDOIPattern()}
                                        onChange={onChange} text='The protocol used when choosing and acquiring the source. This can be supplied as a DOI from https://www.protocols.io/.' />

                                    {/*/!*Description*!/*/}
                                    <EntityFormGroup label='Description' type='textarea' controlId='description' value={data.description} 
                                        onChange={onChange} text='Free text field to enter a description of the source.' />

                                    <Button variant="outline-primary rounded-0" onClick={handleSubmit}
                                            disabled={disableSubmit}>
                                        {_t('Submit')}
                                    </Button>

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