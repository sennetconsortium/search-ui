import { createContext, useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import {
    get_read_write_privileges,
    get_user_write_groups,
} from '../lib/services'
import log from 'loglevel'
import {APP_ROUTES, ENTITIES} from '../config/constants'
import AppModal from '../components/AppModal'
import AppContext from './AppContext'
import {simple_query_builder} from "search-ui/lib/search-tools";
import {getHeaders} from "../components/custom/js/functions";
import {getEntityEndPoint} from "../config/config";
const EntityContext = createContext()

export const EntityProvider = ({ children }) => {
    const {_t } = useContext(AppContext)
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
    const [userWriteGroups, setUserWriteGroups] = useState([])
    const [selectedUserWriteGroupUuid, setSelectedUserWriteGroupUuid] =
        useState(null)

    const [response, setResponse] = useState()
    const [metadata, setMetadata] = useState({})

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

    const handleClose = () => setShowModal(false)
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

    const getSampleEntityConstraints = async (source) => {
        const entityType = source.entity_type.toLowerCase()
        let body = {entity_type: ENTITIES[entityType]}
        if (entityType === 'sample') {
            const sample_category = source.sample_category.toLowerCase()
            body['sub_type'] = [sample_category]
            if (sample_category === 'organ') {
                body['sub_type_val'] = [source.organ]
            }
        }
        const fullBody = [
            {
                ancestors: [body]
            }
        ]
        return getEntityConstraints(fullBody)
    }

    const setModalDetails = ({entity, type, typeHeader, response}) => {
        setShowModal(true)
        setDisableSubmit(false)

        if ('uuid' in response) {
            const verb = isEditMode() ? 'Updated' : 'Created'
            setHasSubmissionError(false)
            setModalTitle(`${entity} ${verb}`)
            setModalBody(`${_t(`Your ${entity} was ${verb.toLocaleLowerCase()}`)}:\n` +
                `${_t(typeHeader)}: ` + type + "\n" +
                `${_t('Group Name')}: ` + response.group_name + "\n" +
                `${_('SenNet ID')}: ` + response.sennet_id)
            setResponse(response)
        } else {
            setHasSubmissionError(true)
            setModalTitle(`Error Creating ${entity}`)
            let responseText = ""
            if ("error" in response) {
                responseText = response.error
            } else if ("statusText" in response) {
                responseText = response.statusText
            }
            setModalBody(responseText)

        }
    }

    const getModal = () => {
        return <AppModal
            showModal={showModal}
            modalTitle={modalTitle}
            modalBody={modalBody}
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
                getEntityConstraints, getSampleEntityConstraints
            }}
        >
            {children}
        </EntityContext.Provider>
    )
}

export default EntityContext
