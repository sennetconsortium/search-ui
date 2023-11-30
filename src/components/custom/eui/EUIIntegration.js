import { useEffect, useRef } from "react";
import Script from "next/script";

const EUIIntegration = ({ height }) => {
    const euiRef = useRef(null);

    useEffect(() => {
        const eui = euiRef.current;
        eui.dataSources = [
            "https://apps.humanatlas.io/hra-api/v1/sennet/rui_locations.jsonld",
        ];
    }, []);

    return (
        <>
            <ccf-eui
                style={{ height: height }}
                ref={euiRef}
                theme="sennet"
                header="false"
                use-remote-api="false"
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
