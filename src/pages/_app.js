import '../public/css/main.css'
import log from "loglevel";
import ErrorBoundary from "../components/custom/error/ErrorBoundary";
import {useRouter} from 'next/router';
import {useIdleTimer} from 'react-idle-timer'
import {setCookie} from "cookies-next";
import {IDLE_TIMEOUT} from "../config/config";

function MyApp({Component, pageProps}) {
    const router = useRouter()

    const onIdle = () => {
        setCookie('isAuthenticated', false);
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