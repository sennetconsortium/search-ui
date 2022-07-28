import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {APP_TITLE} from "../../../config/config";
import React from "react";

export default class AppNavbar extends React.Component {
    render() {
        return (
            <Navbar className="navbar navbar-expand-lg navbar-light">
                <Container fluid={true}>
                    <Navbar.Brand href="/search">
                        {APP_TITLE}
                    </Navbar.Brand>

                    <Nav className="justify-content-end">
                        <NavDropdown title="Register" id="basic-nav-dropdown">
                            <NavDropdown.Item
                                href="/edit/sample?uuid=create">Sample</NavDropdown.Item>
                            <NavDropdown.Item
                                href="/edit/donor?uuid=create">Donor</NavDropdown.Item>
                        </NavDropdown>
                        {/*<Nav.Link href="/edit/sample?uuid=create">Register Sample</Nav.Link>*/}
                        <Nav.Link href="http://localhost:8484/logout">Sign-out</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        )
    }
}