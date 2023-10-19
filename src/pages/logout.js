import { useEffect, useContext } from 'react'
import Spinner from '../components/custom/Spinner'
import AppContext from '../context/AppContext'
import { getLogoutURL } from '../config/config'

function logout() {
    const { logout } = useContext(AppContext)
    useEffect(() => {
        logout()
        window.location = getLogoutURL()
    })
    return <Spinner text="Logging you out, please wait... " />
}

export default logout
