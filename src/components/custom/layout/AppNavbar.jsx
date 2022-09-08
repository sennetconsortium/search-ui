import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {APP_TITLE, getIngestEndPoint} from "../../../config/config";
import React from "react";
import {setCookie} from "cookies-next";

export default class AppNavbar extends React.Component {
    render() {
        return (
            <Navbar className="navbar navbar-expand-lg navbar-light">
                <Container fluid={true}>
                    <Navbar.Brand href="/search">
                        {APP_TITLE}
                    </Navbar.Brand>

                    <Nav className="justify-content-end">
                        <NavDropdown hidden={this.props.hidden} title="Register" id="basic-nav-dropdown">
                            <NavDropdown.Item
                                href="/edit/sample?uuid=create">Sample</NavDropdown.Item>
                            <NavDropdown.Item
                                href="/edit/source?uuid=create">Source</NavDropdown.Item>
                            <NavDropdown.Item
                                href="/edit/dataset?uuid=create">Dataset</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href={getIngestEndPoint() + 'logout'} onClick={()=>setCookie('isAuthenticated', false)}>Sign-out</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        )
    }
}