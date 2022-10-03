import '../public/css/main.css'
import log from "loglevel";
import ErrorBoundary from "../components/custom/error/ErrorBoundary";
import {useRouter} from 'next/router';
import {useIdleTimer} from 'react-idle-timer'
import {deleteCookie, setCookie} from "cookies-next";
import {getIngestEndPoint, IDLE_TIMEOUT} from "../config/config";

function MyApp({Component, pageProps}) {
    const router = useRouter()

    const onIdle = () => {
        setCookie('isAuthenticated', false);
        deleteCookie('groups_token');
        deleteCookie('info');
        // Call Ingest API logout to revoke token
        fetch(getIngestEndPoint() + 'logout').then();
        router.push('/');
    }

    const idleTimer = useIdleTimer({timeout: IDLE_TIMEOUT, onIdle})

    // log.enableAll()
    log.setLevel("debug")
    return (<ErrorBoundary>
        <Component {...pageProps} />
    </ErrorBoundary>)
}

export default MyApp