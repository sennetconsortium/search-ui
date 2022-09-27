import {Head, Html, Main, NextScript} from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="stylesheet" href={"https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3/rui/styles.css"}/>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap"
                      rel="stylesheet"/>
                <link rel="stylesheet"
                      href={"https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Sharp|Material+Icons+Outlined"}/>
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}
