import { useRouter } from 'next/router'
import { useEffect, useContext } from 'react'
import log from 'loglevel'
import { getCookie, setCookie } from 'cookies-next'
import { goToSearch } from '../components/custom/js/functions'
import Unauthorized from '../components/custom/layout/Unauthorized'
import Spinner from '../components/custom/Spinner'
import AppContext from '../context/AppContext'

export default function Home() {
    const router = useRouter()
    const { setIsBusy, login, isLoginPermitted } = useContext(AppContext)

    useEffect(() => {
        if (router.isReady) {
            let info = getCookie('info')
            if (info) {
                setIsBusy(true)
                info = atob(info)
                setCookie(
                    'groups_token',
                    JSON.parse(info).groups_token,
                    {sameSite: "Lax"},
                )

                log.debug(router.query)
                login()
            } else {
                goToSearch()
            }
        }
    }, [router.isReady])

    if (!isLoginPermitted) {
        return <Unauthorized />
    } else {
        return <Spinner />
    }
}
