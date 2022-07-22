import '../public/css/main.css'
import log from "loglevel";

function MyApp({Component, pageProps}) {
    // log.enableAll()
    log.setLevel("debug")
    return <Component {...pageProps} />
}

export default MyApp