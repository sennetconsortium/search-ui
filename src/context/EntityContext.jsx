import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
    get_read_write_privileges,
    get_user_write_groups,
} from '../lib/services'
import log from 'loglevel'
import { APP_ROUTES } from '../config/constants'
import AppModal from '../components/custom/AppModal'
const EntityContext = createContext()

export const EntityProvider = ({ children }) => {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(null)
    const [validated, setValidated] = useState(false)
    const [editMode, setEditMode] = useState(null)
    const [data, setData] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [values, setValues] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [showHideModal, setShowHideModal] = useState(false)
    const [modalBody, setModalBody] = useState(null)
    const [modalTitle, setModalTitle] = useState(null)
    const [disableSubmit, setDisableSubmit] = useState(false)
    const [userWriteGroups, setUserWriteGroups] = useState([])
    const [selectedUserWriteGroupUuid, setSelectedUserWriteGroupUuid] =
        useState(null)

    const isUnauthorized = () => {
        return authorized === false
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

    const setModalDetails = ({entity, type, response}) => {
        setShowModal(true)
        setDisableSubmit(false);

        if ('uuid' in response) {
            if (isEditMode()) {
                setModalTitle(`${entity} Updated`)
                setModalBody(`Your ${entity} was updated:\n` +
                    "Data type: " + type + "\n" +
                    "Group Name: " + response.group_name + "\n" +
                    "SenNet ID: " + response.sennet_id)
            } else {
                setModalTitle(`${entity} Created`)
                setModalBody(`Your ${entity} was created:\n` +
                    "Data type: " + type + "\n" +
                    "Group Name: " + response.group_name + "\n" +
                    "SenNet ID: " + response.sennet_id)
            }
        } else {
            setModalTitle(`Error Creating ${entity}`)
            setModalBody(response.statusText)
            setShowHideModal(true);
        }
    }

    const getModal = () => {
        return <AppModal showHideModal={showHideModal} showModal={showModal} modalBody={modalBody}
                modalTitle={modalTitle} handleClose={handleClose} handleHome={handleHome} />
    }

    return (
        <EntityContext.Provider
            value={{
                isUnauthorized, 
                getModal, setModalDetails,
                isEditMode,
                data, setData,
                error, setError,
                values, setValues,
                errorMessage, setErrorMessage,
                showHideModal, setShowHideModal, 
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
