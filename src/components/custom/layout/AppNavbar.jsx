import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {APP_TITLE, getIngestEndPoint} from "../../../config/config";
import React from "react";
import {deleteCookie, setCookie} from "cookies-next";
import styles from '../appNavbar.module.css'
import logo from './sennet-logo.png'
import Image from 'next/image'

const AppNavbar = ({hidden, signoutHidden}) => {
    return (
        <Navbar variant={'dark'} expand="lg" className={`sticky-top ${styles.navbar_custom}`}>
            <Container fluid={true}>
                <Navbar.Brand href="/search" className={'d-flex align-items-center'}>
                    <Image
                        src={logo}
                        width="42"
                        height="42"
                        alt="SenNet logo"
                    />
                    <div className={'ms-2 fs-3'}>{APP_TITLE}</div>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse>
                    <Nav className={"me-auto"}>
                        <NavDropdown
                            active={true}
                            variant={'primary'}
                            hidden={hidden}
                            title="Register an Entity"
                            id="basic-nav-dropdown">
                            <NavDropdown.Item
                                href="/edit/source?uuid=create">Source</NavDropdown.Item>
                            <NavDropdown.Item
                                href="/edit/sample?uuid=create">Sample</NavDropdown.Item>
                            <NavDropdown.Item
                                href="/edit/dataset?uuid=create">Dataset</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link
                            className={'justify-content-end'}
                            hidden={signoutHidden}
                            href={getIngestEndPoint() + 'logout'}
                            onClick={() => {
                                setCookie('isAuthenticated', false);
                                deleteCookie('groups_token');
                                deleteCookie('info');
                            }}>Sign-out</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar