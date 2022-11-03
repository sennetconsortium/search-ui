import '../public/css/main.css'
import log from 'loglevel'
import ErrorBoundary from '../components/custom/error/ErrorBoundary'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useIdleTimer } from 'react-idle-timer'
import { deleteCookie, setCookie } from 'cookies-next'
import {getIngestEndPoint, getLogLevel, IDLE_TIMEOUT} from '../config/config'
import useGoogleTagManager from '../hooks/useGoogleTagManager'
import addons from "../components/custom/js/addons/addons"
import { AppProvider } from '../context/AppContext'
import { ORGAN_TYPES } from '../config/constants'

function MyApp({ Component, pageProps }) {
    const router = useRouter()
    useGoogleTagManager()

    useEffect(() =>{
        addons('init', {data: {facets: ORGAN_TYPES}})
    }, [])

    const onIdle = () => {
        setCookie('isAuthenticated', false)
        deleteCookie('groups_token')
        deleteCookie('info')
        // Call Ingest API logout to revoke token
        fetch(getIngestEndPoint() + 'logout').then()
        router.push('/')
    }

    const idleTimer = useIdleTimer({ timeout: IDLE_TIMEOUT, onIdle })

    log.setLevel(getLogLevel())

    const withWrapper = Component.withWrapper || ((page) => page)
    return (
        <ErrorBoundary>
            <AppProvider>
                {withWrapper(<Component {...pageProps} />)}
            </AppProvider>
        </ErrorBoundary>
    )
}

export default MyApp
