import 'vitessce/dist/es/production/static/css/index.css';
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import 'bootstrap/dist/css/bootstrap.css';
import '../public/css/main.css'
import log from 'loglevel'
import ErrorBoundary from '../components/custom/error/ErrorBoundary'
import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {useIdleTimer} from 'react-idle-timer'
import {getCookie} from 'cookies-next'
import {getIngestEndPoint, getLogLevel, IDLE_TIMEOUT} from '../config/config'
import useGoogleTagManager from '../hooks/useGoogleTagManager'
import addons from "../components/custom/js/addons/addons"
import {AppProvider} from '../context/AppContext'
import {deleteCookies} from "../lib/auth";
import useCache from "../hooks/useCache";
import Spinner from "../components/custom/Spinner";

function MyApp({Component, pageProps}) {
    const router = useRouter()
    const [cache, setCache] = useState(null)
    const caching = useCache()
    useGoogleTagManager()

    useEffect(() => {
        const user = getCookie('user')

        caching.fetchData().then((response) => {
            addons('init', {data: {user}, router, entities: response.cache.entities})
            setCache(response.cache)
        }).catch((error) => console.error(error))
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
    if (!cache) {
        return <Spinner/>
    } else {
        return (
            <ErrorBoundary>
                <AppProvider cache={cache} >
                    {withWrapper(<Component {...pageProps} />)}
                </AppProvider>
            </ErrorBoundary>
        )
    }
}

export default MyApp
