import { createContext, useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import {
    get_read_write_privileges,
    get_user_write_groups,
} from '../lib/services'
import log from 'loglevel'
import { APP_ROUTES } from '../config/constants'
import AppModal from '../components/AppModal'
import AppContext from './AppContext'
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
    const [showCloseButton, setShowCloseButton] = useState(false)
    const [modalBody, setModalBody] = useState(null)
    const [modalTitle, setModalTitle] = useState(null)
    const [disableSubmit, setDisableSubmit] = useState(false)
    const [userWriteGroups, setUserWriteGroups] = useState([])
    const [selectedUserWriteGroupUuid, setSelectedUserWriteGroupUuid] =
        useState(null)

    const isUnauthorized = () => {
        return authorized === false
    }

    const isAuthorizing = () => {
        return authorized === null
    }

    const isEditMode = () => {
        return editMode === 'Edit'
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
        // use a callback to find the field in the value list and update it
        setValues((currentValues) => {
            // log.info(currentValues)
            currentValues[fieldId] = value
            return currentValues
        })
    }

    const setModalDetails = ({entity, type, typeHeader, response}) => {
        setShowModal(true)
        setDisableSubmit(false)

        if (isEditMode()) {
            setShowCloseButton(true)
        }

        if ('uuid' in response) {
            const verb = isEditMode() ? 'Updated' : 'Created'
            setModalTitle(`${entity} ${verb}`)
            setModalBody(`${_t(`Your ${entity} was ${verb.toLocaleLowerCase()}`)}:\n` +
                `${_t(typeHeader)}: ` + type + "\n" +
                `${_t('Group Name')}: ` + response.group_name + "\n" +
                `${_('SenNet ID')}: ` + response.sennet_id)
            
        } else {
            setModalTitle(`Error Creating ${entity}`)
            let responseText = ""
            if ("error" in response) {
                responseText = response.error
            } else if ("statusText" in response) {
                responseText = response.statusText
            }
            setModalBody(responseText)
            setShowCloseButton(true)
        }
    }

    const getModal = () => {
        return <AppModal
            showModal={showModal}
            modalTitle={modalTitle}
            modalBody={modalBody}
            handleClose={handleClose}
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
                disableSubmit, setDisableSubmit
            }}
        >
            {children}
        </EntityContext.Provider>
    )
}

export default EntityContext
