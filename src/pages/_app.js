import 'vitessce/dist/es/production/static/css/index.css';
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import 'bootstrap/dist/css/bootstrap.css';
import '../public/css/main.css'
import log from 'loglevel'
import ErrorBoundary from '../components/custom/error/ErrorBoundary'
import {useEffect} from 'react'
import {useRouter} from 'next/router'
import {useIdleTimer} from 'react-idle-timer'
import {getCookie} from 'cookies-next'
import {getIngestEndPoint, getLogLevel, IDLE_TIMEOUT} from '../config/config'
import useGoogleTagManager from '../hooks/useGoogleTagManager'
import addons from "../components/custom/js/addons/addons"
import {AppProvider} from '../context/AppContext'
import {ENTITIES} from '../config/constants'
import {deleteCookies} from "../lib/auth";

function MyApp({Component, pageProps}) {
    const router = useRouter()
    useGoogleTagManager()

    useEffect(() => {
        const user = getCookie('user')
        addons('init', {data: {user}, router, entities: ENTITIES})
    }, [])

    const onIdle = () => {
        deleteCookies()
        // Call Ingest API logout to revoke token
        fetch(getIngestEndPoint() + 'logout').then()
        router.push('/')
    }

    const idleTimer = useIdleTimer({timeout: IDLE_TIMEOUT, onIdle})

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
