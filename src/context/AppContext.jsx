import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { goToSearch } from '../components/custom/js/functions'
import { getCookie, deleteCookie, setCookie } from 'cookies-next'
import log from 'loglevel'
import { get_read_write_privileges } from '../lib/services'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [isBusy, setIsBusy] = useState(false)
    const [isLoginPermitted, setIsLoginPermitted] = useState(true)
    const [authorized, setAuthorized] = useState(null)
    const [isRegisterHidden, setIsRegisterHidden] = useState(false)
    const router = useRouter()
    const authKey = 'isAuthenticated'

    useEffect(() => {
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
                    console.log('Author', hasAuthenticationCookie())
                    // Redirect to home page without query string
                    goToSearch()
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
        setCookie(authKey, false)
        deleteCookie('groups_token')
        deleteCookie('info')
    }

    // TODO: change to handle locale
    const _t = (msg) => {
        return msg
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
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
