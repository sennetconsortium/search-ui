import '../public/css/main.css'
import log from 'loglevel'
import ErrorBoundary from '../components/custom/error/ErrorBoundary'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useIdleTimer } from 'react-idle-timer'
import {deleteCookie, getCookie, setCookie} from 'cookies-next'
import { getIngestEndPoint, IDLE_TIMEOUT } from '../config/config'
import useGoogleTagManager from '../hooks/useGoogleTagManager'
import addons from "../components/custom/js/addons/addons"
import { AppProvider } from '../context/AppContext'
import {ENTITIES, ORGAN_TYPES} from '../config/constants'
import {deleteCookies} from "../lib/auth";

function MyApp({ Component, pageProps }) {
    const router = useRouter()
    useGoogleTagManager()

    useEffect(() =>{
        const user = getCookie('user')
        addons('init', {data: {facets: ORGAN_TYPES, user}, router, entities: ENTITIES})
    }, [])

    const onIdle = () => {
        deleteCookies()
        // Call Ingest API logout to revoke token
        fetch(getIngestEndPoint() + 'logout').then()
        router.push('/')
    }

    const idleTimer = useIdleTimer({ timeout: IDLE_TIMEOUT, onIdle })

    // log.enableAll()
    log.setLevel("debug")

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
