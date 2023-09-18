import React, {createContext, useEffect, useState, useContext} from 'react'
import { useRouter } from 'next/router'
import {
    get_read_write_privileges,
    get_user_write_groups,
} from '../lib/services'
import log from 'loglevel'
import {APP_ROUTES} from '../config/constants'
import AppModal from '../components/AppModal'
import AppContext from './AppContext'
import {equals, fetchProtocols, getHeaders} from "../components/custom/js/functions";
import {getEntityEndPoint} from "../config/config";
import {BoxArrowUpRight} from "react-bootstrap-icons";
import {Button} from 'react-bootstrap'
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ClipboardCopy from "../components/ClipboardCopy";
const EntityContext = createContext()

export const EntityProvider = ({ children }) => {
    const {_t, cache } = useContext(AppContext)
    const router = useRouter()
    const [authorized, setAuthorized] = useState(null)
    const [validated, setValidated] = useState(false)
    const [editMode, setEditMode] = useState(null)
    const [data, setData] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [values, setValues] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [showCloseButton, setShowCloseButton] = useState(true)
    const [modalBody, setModalBody] = useState(null)
    const [modalTitle, setModalTitle] = useState(null)
    const [hasSubmissionError, setHasSubmissionError] = useState(false)
    const [disableSubmit, setDisableSubmit] = useState(false)
    const [dataAccessPublic, setDataAccessPublic] = useState(null)
    const [userWriteGroups, setUserWriteGroups] = useState([])
    const [selectedUserWriteGroupUuid, setSelectedUserWriteGroupUuid] =
        useState(null)

    const [response, setResponse] = useState()
    const [metadata, setMetadata] = useState({})
    const [warningClasses, setWarningClasses] = useState({})

    const isUnauthorized = () => {
        return authorized === false
    }

    const isAuthorizing = () => {
        return authorized === null
    }

    const isEditMode = () => {
        return editMode === 'Edit'
    }

    const goToEntity = () => {
        if (!hasSubmissionError) {
            router.push(`/edit/${response.entity_type.toLowerCase()}?uuid=${response.uuid}`)
        }
        setShowModal(false)
    }

    const handleClose = () => {
        // Update the data such that buttons are displayed correctly after change
        if (isEditMode() && response && response.status) {
            setData({...data, status: response.status})
        }
        setShowModal(false)
    }
    const handleHome = () => router.push(APP_ROUTES.search)

    // only executed on init rendering, see the []
    useEffect(() => {
        
        get_read_write_privileges()
            .then((response) => {
                setAuthorized(response.write_privs)
            })
            .catch((error) => log.error(error))

        get_user_write_groups()
            .then((response) => {
                if (response.user_write_groups.length === 1) {
                    setSelectedUserWriteGroupUuid(
                        response.user_write_groups[0].uuid
                    )
                }
                setUserWriteGroups(response.user_write_groups)
            })
            .catch((e) => log.error(e))
    }, [])

    const onChange = (e, fieldId, value) => {
        // log.debug('onChange', fieldId, value)
        // use a callback to find the field in the value list and update it
        setValues((previousValues) => {
            if (previousValues !== null) {
                return {...previousValues, [fieldId]: value}
            } else {
                return {
                    [fieldId]: value
                }
            }
        });
    };

    const getEntityConstraints = async (body, params) => {
        const requestOptions = {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body)
        }
        const requestParams = params ?  '?' + new URLSearchParams(params) : ''
        return await fetch(getEntityEndPoint() + 'constraints' + requestParams, requestOptions)
    }

    const buildConstraint = (entity, constraint = [], key = 'ancestors') => {
        const entityType = entity.entity_type.toLowerCase()
        let body = {entity_type: cache.entities[entityType]}
        if (equals(entityType, cache.entities.sample)) {
            const sample_category = entity.sample_category.toLowerCase()
            body['sub_type'] = [sample_category]
            if (equals(sample_category, cache.sampleCategories.Organ)) {
                body['sub_type_val'] = [entity.organ]
            }
        }

        constraint.push({
            [key]: [body]
        })

        return constraint
    }

    const getSampleEntityConstraints = async (source) => {
        const fullBody = buildConstraint(source)
        return getEntityConstraints(fullBody)
    }

    const getMetadataNote = (entity, noteKey, field = 'category') => {
        let note;
        switch (noteKey) {
            case 0:
                note = <span key={'md-0'}>Metadata for this <code>{entity}</code> exists. </span>
                break
            case 1:
                note = <span key={'md-1'}>You may view it via <a target='_blank' className={'js-btn--json lnk--ic'} href={`/api/json/${entity.toLowerCase()}?uuid=${data.uuid}`}> the full entity JSON  <BoxArrowUpRight/></a>. </span>
                break
            case 2:
                let prop = `${entity.toLowerCase()}_${field}`
                let val = values[prop]
                val = val[0]?.toUpperCase() + val.slice(1)
                note =  <span key={'md-2'}>Changing the <code>{entity}</code> {field} will result in loss of this metadata and cannot be undone once submitted. <br /> Please revert back to <span role={'button'} onClick={() => window.location = `#${prop}`}><code>{entity}</code> {field}</span> <code>{val}</code> to keep current metadata.</span>
                break
            default:
                note = <></>
        }
        return note;
    }

    const checkMetadata = (subTypeKey, supportsMetadata) => {
        if(!_.isEmpty(metadata)) {
            if (supportsMetadata) {
                values["metadata"] = metadata.metadata[0]
                values["metadata"]["pathname"] = metadata.pathname
            } else {
                values["metadata"] = {}
            }
        } else {
            if (isEditMode()) {
                //TODO: Remove. This is just for entries with previous metadata to facilitate expected testing.
                if (values.metadata && !values.metadata.pathname) {
                    values["metadata"] = {}
                }
                if (data[subTypeKey] !== values[subTypeKey] || !supportsMetadata) {
                    values["metadata"] = {}
                }
            }
        }
    }

    const setModalDetails = ({entity, type, typeHeader, response}) => {
        setShowModal(true)
        setDisableSubmit(false)

        if ('uuid' in response) {
            const verb = isEditMode() ? 'Updated' : 'Registered'
            setHasSubmissionError(false)
            let body = []
            setModalTitle(<span key='title-0'>{successIcon()}<span key='title-1' className={'title-text'} > {entity} {verb}</span></span>)
            body.push(<span key='bdy-1'>{_t(`Your ${entity} was ${verb.toLocaleLowerCase()}`)}. <br /></span>)
            body.push(<span key='bdy-2'><strong>{_t(typeHeader)}:</strong> {type}<br /></span>)
            body.push(<span key='bdy-3'><strong>{_t('Group Name')}:</strong> {response.group_name}<br /></span>)
            body.push(<span key='bdy-4'><strong>{_t('SenNet ID')}:</strong> {response.sennet_id} <ClipboardCopy text={response.sennet_id} /> </span>)
            setModalBody(body)
            setResponse(response)
        } else {
            const verb = isEditMode() ? 'Updating' : 'Registering'
            setHasSubmissionError(true)
            setModalTitle(<span>{errIcon()}<span className={'title-text'}>Error {verb} {entity}</span></span>)
            let responseText = ""
            if ("error" in response) {
                responseText = response.error
            } else if ("statusText" in response) {
                responseText = response.statusText
            }
            setModalBody(responseText)
        }
    }

    const successIcon = () => <TaskAltIcon color={'success'} />

    const errIcon = () => <WarningAmberIcon sx={{color: '#842029'}} />

    const setCheckDoiModal = (body) => {
        setHasSubmissionError(false)
        setShowModal(true)
        setModalTitle(<span><span className={'title-text'}>Validating DOI URLs of ancestor entities ...</span></span>)
        setModalBody(body)
    }
    
    const setSubmissionModal = (body, hasError) => {
        const icon = hasError ? errIcon() : successIcon()
        setHasSubmissionError(hasError)
        setShowModal(true)
        setDisableSubmit(false)
        setModalTitle(<span>{icon}<span className={'title-text'} >Submitted dataset for processing</span></span>)
        setModalBody(body)
    }

    const checkProtocolUrl = async (value) => {
        let values = {...warningClasses}
        if (!value) {
            delete values.protocol_url
            setWarningClasses(values)
            return
        }
        let protocolCheck = await fetchProtocols(value)

        if (!protocolCheck) {
            values.protocol_url = 'has-warning'
        } else {
            delete values.protocol_url
        }
        setWarningClasses(values)
    }

    const getCancelBtn = (entity) => {
        const isRegister = router.query.uuid === 'register'
        const url = isRegister ? APP_ROUTES.search : `/${entity}?uuid=${router.query.uuid}`
        return (
            <Button variant="outline-primary rounded-0 js-btn--cancel"
                    href={url} > Cancel
            </Button>
        )
    }

    const getModal = () => {
        return <AppModal
            className={`modal--ctaConfirm ${hasSubmissionError ? 'is-error' : ''}`}
            showModal={showModal}
            modalTitle={modalTitle}
            modalBody={<div>{modalBody}</div>}
            handleClose={isEditMode() ? handleClose : goToEntity}
            handleHome={handleHome}
            showCloseButton={showCloseButton}
            closeButtonLabel={'Edit form'}
        />
    }

    return (
        <EntityContext.Provider
            value={{
                isUnauthorized, isAuthorizing,
                getModal, setModalDetails,
                setSubmissionModal,
                setCheckDoiModal,
                isEditMode,
                data, setData,
                error, setError,
                values, setValues,
                errorMessage, setErrorMessage,
                validated, setValidated,
                handleClose, handleHome, 
                showModal, setShowModal,
                modalBody, setModalBody,
                modalTitle, setModalTitle,
                userWriteGroups, setUserWriteGroups, onChange, editMode, setEditMode,
                selectedUserWriteGroupUuid, setSelectedUserWriteGroupUuid,
                disableSubmit, setDisableSubmit,
                metadata, setMetadata,
                dataAccessPublic, setDataAccessPublic,
                getEntityConstraints, getSampleEntityConstraints, buildConstraint,
                checkMetadata, getMetadataNote, successIcon, errIcon, checkProtocolUrl,
                warningClasses, setWarningClasses, getCancelBtn
            }}
        >
            {children}
        </EntityContext.Provider>
    )
}

export default EntityContext
