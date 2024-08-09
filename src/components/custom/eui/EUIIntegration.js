import {useEffect, useRef} from "react";
import Script from "next/script";
import {getCookie} from "cookies-next";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {getRootURL} from "../../../config/config";

const EUIIntegration = () => {
    const euiRef = useRef(null);

    useEffect(() => {
        const eui = euiRef.current;
        if (getCookie('groups_token')) {
            eui.hubmapToken = `SNT-${getCookie('groups_token')}`
        }
    }, []);

    return (
        <HelmetProvider>
            <Helmet>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&amp;display=swap"
                      rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined"
                      rel="stylesheet"/>
                <link href="https://cdn.humanatlas.io/ui/ccf-eui/styles.css" rel="stylesheet"/>
            </Helmet>
            <ccf-eui
                ref={euiRef}
                theme="sennet"
                header="true"
                use-remote-api="true"
                remote-api-endpoint="https://apps.humanatlas.io/api"
                login-disabled="true"
                home-url={getRootURL() + "search"}
            />

            <Script
                only="ccf-eui"
                src="https://cdn.humanatlas.io/ui/ccf-eui/wc.js"
            />
        </HelmetProvider>
    );
};

export default EUIIntegration;
