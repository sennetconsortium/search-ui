import { useEffect, useContext } from 'react'
import Spinner from '../components/custom/Spinner'
import AppContext from '../context/AppContext'
import { gotToLogin } from '../components/custom/js/functions'
import { getLogoutURL } from '../config/config'

function logout() {
    const { logout } = useContext(AppContext)
    useEffect(() => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', getLogoutURL(), true)
        logout()
        gotToLogin()
    })
    return <Spinner text="Logging you out, please wait... " />
}

export default logout
