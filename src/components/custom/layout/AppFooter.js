import React, {useContext} from 'react';
import {Container} from 'react-bootstrap'
import logo from "./sennet-logo.png";
import nih from "./nih-logo.png"
import Image from "next/image";
import AppContext from "../../../context/AppContext";

const AppFooter = ({isFixedBottom}) => {
    const {_t} = useContext(AppContext)

    let fixedBottom = isFixedBottom ? 'fixed-bottom' : ''
    return (
        <Container>
            <footer className={`py-3 my-4 ${fixedBottom}`}>
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                    <li className="nav-item">
                        <a className="navbar-brand" href="https://sennetconsortium.org/">
                            <Image
                                className="d-inline-block align-text-top"
                                src={logo}
                                width="35"
                                height="35"
                                alt={_t("SenNet logo")}
                            />
                        </a>
                    </li>
                    <li className="nav-item"><a href="https://sennetconsortium.org/"
                                                className="nav-link px-2 text-muted">SenNet Consortium</a></li>
                    <li className="nav-item"><a href="https://sennetconsortium.org/about-2/"
                                                className="nav-link px-2 text-muted">About</a></li>
                    <li className="nav-item"><a href="https://sennetconsortium.org/involvement/"
                                                className="nav-link px-2 text-muted">Funded Research</a></li>
                    <li className="nav-item"><a href="https://sennetconsortium.org/contact"
                                                className="nav-link px-2 text-muted">Contact</a></li>
                </ul>
                <div className="text-center text-muted"><a href="https://commonfund.nih.gov/senescence"
                                                           className={'nav-link px-2 text-muted'}>NIH Common Fund</a>
                    <a className="navbar-brand" href="https://commonfund.nih.gov/senescence">
                        <Image
                            className="d-inline-block align-text-top"
                            src={nih}
                            width="100"
                            height="50"
                            alt={_t("SenNet logo")}
                        />
                    </a>
                </div>
                <div className="text-center text-muted">
                    Copyright <a className="text-muted link_with_icon" href="https://commonfund.nih.gov/senescence">
                        NIH Cellular Senescence Network (SenNet)</a> 2023. All rights reserved.
                </div>
            </footer>
        </Container>
    );
};

export default AppFooter;