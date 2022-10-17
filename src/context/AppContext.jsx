import { createContext, useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import log from 'loglevel'
import { get_read_write_privileges } from '../lib/services'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [authorized, setAuthorized] = useState(null)
    const [isRegisterHidden, setIsRegisterHidden] = useState(false)

    useEffect(() => {
        get_read_write_privileges()
            .then((response) => {
                setAuthorized(response.read_privs)
                setIsRegisterHidden(!response.write_privs)
            })
            .catch((error) => log.error(error))
    })

    const hasAuthenticationCookie = () => {
        return getCookie('isAuthenticated')
    }

    const isLoggedIn = () => {
        return authorized && hasAuthenticationCookie()
    }

    const isLoading = () => {
        return authorized === null
    }

    return (
        <AppContext.Provider
            value={{
                authorized,
                isRegisterHidden,
                hasAuthenticationCookie,
                isLoggedIn,
                isLoading
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
