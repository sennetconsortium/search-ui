import {createContext, useContext, useEffect, useState} from "react";
import {APP_ROUTES} from "../config/constants";
import AppContext from "./AppContext";

const AdminContext = createContext()

export const AdminProvider = ({ children }) => {

    const { _t, authorized, isUnauthorized, checkUIAdminStatus, router} = useContext(AppContext)

    const [uiAdminAuthorized, setUIAdminAuthorized] = useState({
        authorized: false,
        loading: true,
    })

    useEffect(() => {
        if (isUnauthorized()) {
            router.push(APP_ROUTES.login)
            return
        }
    }, [authorized])

    useEffect(() => {
        checkUIAdminStatus()
            .then((adminUnauthorized) => {
                setUIAdminAuthorized({
                    authorized: adminUnauthorized,
                    loading: false,
                })
            })
    }, [])

    return (
        <AdminContext.Provider
            value={{
                uiAdminAuthorized
            }}
        >
        {children}
    </AdminContext.Provider>
    )
}

export default AdminContext