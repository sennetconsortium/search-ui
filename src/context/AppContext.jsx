import { createContext, useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import { goToSearch } from '../components/custom/js/functions'
import { getCookie, setCookie } from 'cookies-next'
import log from 'loglevel'
import { get_read_write_privileges } from '../lib/services'
import {deleteCookies} from "../lib/auth";
import {APP_ROUTES} from "../config/constants";

const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [isBusy, setIsBusy] = useState(false)
    const [isLoginPermitted, setIsLoginPermitted] = useState(true)
    const [authorized, setAuthorized] = useState(null)
    const [isRegisterHidden, setIsRegisterHidden] = useState(false)
    const router = useRouter()
    const authKey = 'isAuthenticated'
    const pageKey = 'userPage'

    useEffect(() => {
        // Should only include: '/', '/search', '/logout', '/login', '/404'
        const noRedirectTo = Object.values(APP_ROUTES)
        if (noRedirectTo.indexOf(router.pathname) === -1) {
            localStorage.setItem(pageKey, router.asPath)
        }
        get_read_write_privileges()
            .then((response) => {
                setAuthorized(response.read_privs)
                setIsRegisterHidden(!response.write_privs)
            })
            .catch((error) => log.error(error))
    })

    const hasAuthenticationCookie = () => {
        return getCookie(authKey)
    }

    const isLoggedIn = () => {
        return authorized && hasAuthenticationCookie()
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
                    setCookie(authKey, true)
                    if (router.query.info) {
                        const {email, globus_id} = JSON.parse(router.query.info)
                        setCookie('user', {email, globus_id})
                    }
                    // Redirect to home page without query string
                    const page = localStorage.getItem(pageKey)
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
        localStorage.removeItem(pageKey)
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
                logout,
                login,
                _t,
                router,
                filterImageFilesToAdd,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
