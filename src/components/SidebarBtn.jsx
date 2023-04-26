import React, {useContext} from 'react'
import {ChevronLeft, ChevronRight} from "react-bootstrap-icons";
import AppContext from "../context/AppContext";

function SidebarBtn() {
    const {sidebarVisible, handleSidebar} = useContext(AppContext)

    return (
        <div className="d-none d-md-block sticky-top" id="sections-button">
            <a href="#" onClick={handleSidebar} data-bs-target="#sidebar" data-bs-toggle="collapse" title={'Toggle menu sidebar'}
               className={`btn sidebar-drawer-btn ${sidebarVisible ? 'is-open' : ''} icon_inline mb-2`}>
                {!sidebarVisible && <ChevronRight />} {sidebarVisible && <ChevronLeft />}</a>
        </div>
    )
}

export default SidebarBtn