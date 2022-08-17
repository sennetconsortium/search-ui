import '../public/css/main.css'
import log from "loglevel";
import ErrorBoundary from "../components/custom/error/ErrorBoundary";

function MyApp({Component, pageProps}) {
    // log.enableAll()
    log.setLevel("debug")
    return (<ErrorBoundary>
        <Component {...pageProps} />
    </ErrorBoundary>)
}

export default MyApp