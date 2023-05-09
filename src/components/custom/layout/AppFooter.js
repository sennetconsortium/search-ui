import React, {useContext} from 'react';
import {Container, Row, Col} from 'react-bootstrap'
import logo from "./sennet-text-logo.png";
import nih from "./nih-fund-logo.png"
import Image from "next/image";
import AppContext from "../../../context/AppContext";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {BoxArrowUpRight, EnvelopeFill} from 'react-bootstrap-icons';

const AppFooter = ({isFixedBottom}) => {
    const {_t} = useContext(AppContext)

    let fixedBottom = isFixedBottom ? 'fixed-bottom' : ''
    return (
        <div className={'sui-layout-body__inner bg--entityWhite border-top'}>
            <ToastContainer />

            <footer className={`py-3 ${fixedBottom} `}>
                <Row>
                    <Col sm={2}>
                        <p></p>
                    </Col>
                    <Col sm={10}>
                        <Row>
                            <Col sm={4}>
                                <ul className="nav pb-3 mb-3 nav--org" aria-label='Organization name'>
                                    <li className="nav-item">
                                        <a className="navbar-brand" href="https://sennetconsortium.org/">
                                            <Image
                                                className="d-inline-block align-text-top"
                                                src={logo}
                                                width="30"
                                                alt={_t("SenNet logo")}
                                            />
                                        </a>
                                    </li>
                                </ul>
                            </Col>
                            <Col sm={8}>
                                <ul className="nav pb-3 mb-3 nav--menu" aria-label='Menu'>

                                    <li className="nav-item"><a href="https://sennetconsortium.org/about-2/"
                                                                className="nav-link px-2 text-muted">About</a></li>
                                    <li className="nav-item"><a href="https://sennetconsortium.org/involvement/"
                                                                className="nav-link px-2 text-muted">Funded Research</a></li>
                                    <li className="nav-item"><a href="https://sennetconsortium.org/contact"
                                                                className="nav-link px-2 text-muted">Contact</a></li>
                                </ul>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}><div className=" text-muted">
                                <ul className="nav pb-3 mb-3" >
                                    <li className="nav-item">
                                        <a className="navbar-brand" href="https://commonfund.nih.gov/senescence">
                                            <Image
                                                className="d-inline-block align-text-top"
                                                src={nih}
                                                width="30"
                                                alt={_t("NIH logo")}
                                            />
                                        </a>
                                    </li>
                                </ul>



                            </div></Col>
                            <Col sm={8}>
                                <ul className="nav pb-3 mb-3 nav--copyright" aria-label='Copyright'>
                                    <li className="text-muted">
                                        Copyright <a className="text-muted lnk--ic" href="https://commonfund.nih.gov/senescence">
                                        NIH Cellular Senescence Network (SenNet) <BoxArrowUpRight/></a> 2023. All rights reserved.
                                    </li>
                                </ul>
                            </Col>
                        </Row>

                    </Col>
                </Row>

            </footer>
        </div>
    );
};

export default AppFooter;