import {Head, Html, Main, NextScript} from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                {/* RUI styles */}
                <link rel="stylesheet" href={"https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3/rui/styles.css"}/>
                {/* RUI fonts */}
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap"
                      rel="stylesheet"/>
                {/* RUI Icons */}
                <link rel="stylesheet"
                      href={"https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Sharp|Material+Icons+Outlined"}/>
                {/* Bootstrap CSS */}
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
                      integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
                      crossOrigin="anonymous"/>
            </Head>
            <body>
            {/* Bootstrap JS */}
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3"
                    crossOrigin="anonymous"></script>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}
