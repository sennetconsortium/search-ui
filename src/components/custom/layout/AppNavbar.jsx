import {Container, Nav, Navbar, NavDropdown, Row} from 'react-bootstrap';
import {APP_TITLE, getIngestEndPoint} from "../../../config/config";
import React from "react";
import {setCookie} from "cookies-next";
import styles from '../appNavbar.module.css'
import logo from './sennet-logo.png'
import Image from 'next/image'

const AppNavbar = ({hidden, signoutHidden}) => {
    return (
        <Navbar variant={'dark'} expand="lg" className={`sticky-top ${styles.navbar_custom}`}>
            <Container fluid={true}>
                <Row className={'ms-5'}>
                    <Navbar.Brand href="/search" className={'d-flex align-items-center'}>
                        <Image
                            src={logo}
                            width="50"
                            height="50"
                            alt="SenNet logo"
                        />
                        <div className={'ms-2 fs-2'}>{APP_TITLE}</div>
                    </Navbar.Brand>
                </Row>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-end me-5">
                    <Nav>
                        <NavDropdown
                            variant={'primary'}
                            hidden={hidden}
                            title="Register"
                            id="basic-nav-dropdown">
                            <NavDropdown.Item
                                href="/edit/sample?uuid=create">Sample</NavDropdown.Item>
                            <NavDropdown.Item
                                href="/edit/source?uuid=create">Source</NavDropdown.Item>
                            <NavDropdown.Item
                                href="/edit/dataset?uuid=create">Dataset</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link
                            hidden={signoutHidden}
                            href={getIngestEndPoint() + 'logout'}
                            onClick={() => setCookie('isAuthenticated', false)}>Sign-out</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar