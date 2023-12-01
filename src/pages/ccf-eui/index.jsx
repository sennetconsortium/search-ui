import { useEffect, useRef, useState } from "react";

import AppNavbar from "../../components/custom/layout/AppNavbar";
import EUIIntegration from "../../components/custom/eui/EUIIntegration";

const EUIExploration = () => {
    const navBarRef = useRef(null);
    const [euiHeight, setEUIHeight] = useState("50vh");

    useEffect(() => {
        resizeEUI();
        window.addEventListener("resize", resizeEUI);

        return () => {
            window.removeEventListener("resize", resizeEUI);
        };
    }, []);

    function resizeEUI() {
        const navBar = navBarRef.current;
        if (!navBar) return;
        const euiHeight = `${window.innerHeight - navBar.offsetHeight - 10}px`;
        setEUIHeight(euiHeight);
    }

    return (
        <div className="m-0 h-100 overflow-hidden">
            <AppNavbar innerRef={navBarRef} />
            <EUIIntegration height={euiHeight} />
        </div>
    );
};

export default EUIExploration;
