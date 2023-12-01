import {useContext, useEffect, useRef} from "react";
import Script from "next/script";
import {getCookie} from "cookies-next";
import AppContext from "../../../context/AppContext";

const EUIIntegration = ({ height }) => {
    const {isLoggedIn} = useContext(AppContext)
    const euiRef = useRef(null);

    useEffect(() => {
        const eui = euiRef.current;
         if (isLoggedIn()) {
             eui.hubmapToken = `SNT-${getCookie('groups_token')}`
         }
    }, []);

    return (
        <>
            <ccf-eui
                style={{ height: height }}
                ref={euiRef}
                theme="sennet"
                header="false"
                use-remote-api="true"
                remote-api-endpoint="https://apps.humanatlas.io/sennet-hra-api/v1"
                hubmap-data-url=""
                login-disabled="true"
                logo-tooltip=""
                home-url=""
            />

            <Script
                only="ccf-eui"
                src="https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3/wc.js"
            />
        </>
    );
};

export default EUIIntegration;
