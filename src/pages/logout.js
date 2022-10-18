import { useEffect, useContext } from 'react'
import Spinner from '../components/custom/Spinner'
import AppContext from '../context/AppContext'
import { getIngestEndPoint, getRootURL } from '../config/config'
import { APP_ROUTES } from '../config/constants'

function logout() {
    const { logout } = useContext(AppContext)
    useEffect(async () => {
        await fetch(getIngestEndPoint() + APP_ROUTES.logout.slice(1))
        logout()
        window.location.replace(getRootURL() + APP_ROUTES.login)
    }, [])
    return <Spinner text="Logging you out, please wait... " />
}

export default logout
