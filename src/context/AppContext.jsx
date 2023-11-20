import React, { createContext, useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import { goToSearch } from '../components/custom/js/functions'
import { getCookie, setCookie } from 'cookies-next'
import log from 'loglevel'
import {
    check_valid_token,
    get_read_write_privileges,
    get_user_write_groups,
    has_data_admin_privs
} from '../lib/services'
import {deleteCookies} from "../lib/auth";
import {APP_ROUTES} from "../config/constants";
import {getUIPassword} from "../config/config";
import Swal from 'sweetalert2'
import AppModal from "../components/AppModal";
import Spinner from "../components/custom/Spinner";

const AppContext = createContext()

export const AppProvider = ({ cache, children }) => {
    const [isBusy, setIsBusy] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [modalBody, setModalBody] = useState(null)
    const [modalTitle, setModalTitle] = useState(null)
    const [isLoginPermitted, setIsLoginPermitted] = useState(true)
    const [authorized, setAuthorized] = useState(null)
    const [validToken, setValidToken] = useState(null)
    const [adminGroup, setAdminGroup] = useState(null)
    const [isRegisterHidden, setIsRegisterHidden] = useState(false)
    const [uiAdminAuthorized, setUIAuthorized] = useState(false)
    const [sidebarVisible, setSidebarVisible] = useState(false)
    const [userWriteGroups, setUserWriteGroups] = useState([])
    const router = useRouter()
    const authKey = 'isAuthenticated'
    const pageKey = 'userPage'

    useEffect(() => {
        // Should only include: '/', '/search', '/logout', '/login', '/404'
        const noRedirectTo = Object.values(APP_ROUTES)

        let info = getCookie('info')
        let groups_token = ""
        if (info) {
            info = atob(info)
            setCookie(
                'groups_token',
                JSON.parse(info).groups_token,
                {sameSite: "Lax"},
            )
            groups_token = JSON.parse(info).groups_token
        } else {
            // Delete in the event info doesn't exist as might have been logged out the system elsewhere.
            deleteCookies()
        }

        if (noRedirectTo.indexOf(router.pathname) === -1) {
            // Set expiry for 10 minutes
            setLocalItemWithExpiry(pageKey, router.asPath, 600000)
        }

        if(groups_token  != "") {
            check_valid_token().then((response) => {
                if (typeof response == "boolean") {
                    setValidToken(response)
                } else {
                    setValidToken(false)
                }
            }).catch((error) => setValidToken(false));
        } else {
            setValidToken(true)
        }

        get_read_write_privileges()
            .then((response) => {
                if (response) {
                    setAuthorized(response.read_privs)
                    setIsRegisterHidden(!response.write_privs)
                }
            })
            .catch((error) => log.error(error))


        has_data_admin_privs()
            .then((response) => {
                setAdminGroup(response.has_data_admin_privs)
            })
            .catch((error) => log.error(error))


        get_user_write_groups()
            .then((response) => {
                setUserWriteGroups(response.user_write_groups)
            })
            .catch((e) => log.error(e))
    }, [])

    const setLocalItemWithExpiry = (key, value, ttl) => {
        const now = new Date()
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        }

        localStorage.setItem(key, JSON.stringify(item))
    }

    const getLocalItemWithExpiry = (key) => {
        const jsonItem = localStorage.getItem(key)

        // If the jsonItem doesn't exist, return null
        if (!jsonItem) {
            return null
        }

        const item = JSON.parse(jsonItem)
        const now = new Date()

        // Compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
            // If the item is expired, delete the item from storage
            localStorage.removeItem(key)
            return null
        }
        return item.value
    }

    const hasAuthenticationCookie = () => {
        return getCookie(authKey)
    }

    const isLoggedIn = () => {
        return authorized && hasAuthenticationCookie()
    }

    const hasInvalidToken = () => {
        return validToken === false
    }

    const validatingToken = () => {
        return validToken === null
    }

    const isUnauthorized = () => {
        return authorized === false  
    }

    const isAuthorizing = () => {
        return authorized === null  
    }

    const login = () => {
        get_read_write_privileges()
            .then((read_write_privileges) => {
                if (read_write_privileges.read_privs === true) {
                    setCookie(authKey, true, {sameSite: "Lax"})
                    let info = getCookie('info')
                    if (info) {
                        info = atob(info)
                        const {email, globus_id} = JSON.parse(info)
                        setCookie('user', {email, globus_id}, {sameSite: "Lax"})
                    }
                    // Redirect to home page without query string
                    const page = getLocalItemWithExpiry(pageKey)
                    if (page) {
                        window.location = page;
                    }
                    else {
                        goToSearch();
                    }

                } else {
                    router.replace('/', undefined, { shallow: true })
                    setIsLoginPermitted(false)
                }
                setIsBusy(false)
            })
            .catch((error) => {
                setIsBusy(false)
                log.error(error)
            })
    }

    const logout = () => {
        deleteCookies()
    }

    // TODO: change to handle locale
    const _t = (msg) => {
        return msg
    }

    const filterImageFilesToAdd = values => {
        if (!values.image_files_to_add) {
            return
        }
        const filtered = values.image_files_to_add.filter(i => i.temp_file_id !== undefined)
        if (filtered.length !== 0) {
            values['image_files_to_add'] = filtered
        } else {
            delete values.image_files_to_add
        }
    }

    const supportedMetadata = () => {
        let supported = {}
        supported[cache.entities.source] = {
            categories: [
                cache.sourceTypes.Mouse
            ]
        }
        supported[cache.entities.sample] = {
            categories: [
                cache.sampleCategories.Block,
                cache.sampleCategories.Section,
                cache.sampleCategories.Suspension,
            ]
        }
        return supported
    }

    const getGroupName = (data) => {
        if (data.group_name) return data.group_name
        for (let group of userWriteGroups) {
            if (data.group_uuid === group.uuid) {
                return group.displayname
            }
        }
    }

    const toggleBusyOverlay = (show, action) => {
        setShowModal(show)
        if (show && action) {
            setModalTitle(<span>One moment ...</span>)
            setModalBody(<div> <Spinner text={<>Currently handling your request to {action}...</>}  /></div>)
        }
    }

    const getBusyOverlay = () => {
        return (
            <AppModal
                className={`modal--busy`}
                showModal={showModal}
                modalTitle={modalTitle}
                modalBody={modalBody}
                showHomeButton={false}
                showCloseButton={false}
            />
        )
    }

    const handleSidebar = () => {
        setSidebarVisible(!sidebarVisible)
    }

    const promptForUIPasscode = async () => {
        const result = await Swal.fire({
            customClass: {
                container: 'c-help',
                title: 'c-help__title',
                confirmButton: 'c-help__btn'
            },
            width: 500,
            title: `Password Prompt`,
            input: 'password',
            inputLabel: 'Please enter admin password to continue...',
            inputValue: '',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write something!'
                }
            }
        })
        return result
    }

    const checkUIPassword = async () => {
        const uiAuthCookie = getCookie('adminUIAuthorized')

        if (!uiAuthCookie) {
            const result = await promptForUIPasscode()
            if (result.value === atob(getUIPassword())) {
                setCookie('adminUIAuthorized', true, {sameSite: "Lax"})
                setUIAuthorized(true)
            } else {
                await checkUIPassword()
            }
        } else {
            setUIAuthorized(true)
        }
    }
    
    return (
        <AppContext.Provider
            value={{
                authorized,
                isRegisterHidden,
                isLoginPermitted,
                isBusy,
                hasAuthenticationCookie,
                setIsBusy,
                isLoggedIn,
                isAuthorizing,
                isUnauthorized,
                hasInvalidToken,
                validatingToken,
                logout,
                login,
                _t,
                cache,
                router,
                filterImageFilesToAdd,
                uiAdminAuthorized,
                checkUIPassword,
                supportedMetadata,
                handleSidebar,
                sidebarVisible,
                adminGroup,
                getGroupName,
                getBusyOverlay,
                toggleBusyOverlay,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
