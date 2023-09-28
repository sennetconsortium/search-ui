import { useEffect, useRef, useState } from "react";

import AppNavbar from "../../components/custom/layout/AppNavbar";
import EUIIntegration from "../../components/custom/eui/EUIIntegration";

const EUIExploration = () => {
    const navBarRef = useRef(null);
    const [ruiHeight, setRuiHeight] = useState("50vh");

    useEffect(() => {
        resizeRui();
        window.addEventListener("resize", resizeRui);

        return () => {
            window.removeEventListener("resize", resizeRui);
        };
    }, []);

    function resizeRui() {
        const navBar = navBarRef.current;
        if (!navBar) return;
        const ruiHeight = `${window.innerHeight - navBar.offsetHeight - 10}px`;
        setRuiHeight(ruiHeight);
    }

    return (
        <div className="m-0 h-100 overflow-hidden">
            <AppNavbar innerRef={navBarRef} />
            <EUIIntegration height={ruiHeight} />
        </div>
    );
};

export default EUIExploration;
