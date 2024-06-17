import dynamic from "next/dynamic";
import {useContext, useEffect} from 'react'
import AppContext from '@/context/AppContext'
import {getLogoutURL} from '@/config/config'

const Spinner = dynamic(() => import("@/components/custom/Spinner"))

function logout() {
    const {logout} = useContext(AppContext)
    useEffect(() => {
        logout()
        window.location = getLogoutURL()
    })
    return <Spinner text="Logging you out, please wait... "/>
}

export default logout
