import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import {getDataIngestBoardEndpoint, NAVBAR_TITLE} from '../../../config/config'
import {APP_ROUTES} from '../../../config/constants'
import React, {useContext, useState, useEffect} from 'react'
import AppContext from '../../../context/AppContext'
import {equals} from "../js/functions";
import {getCookie} from "cookies-next";

const AppNavbar = ({hidden, signoutHidden, innerRef}) => {
    const {_t, isLoggedIn, logout, cache, supportedMetadata} = useContext(AppContext)
    const userEmail = (isLoggedIn() ? JSON.parse(atob(getCookie('info')))['email'] : "")

    const handleSession = (e) => {
        e.preventDefault()
        let url = APP_ROUTES.login
        if (isLoggedIn()) {
            logout()
            url = APP_ROUTES.logout //getLogoutURL()
        }
        window.location.replace(url)
    }

    const supportedSingleRegister = () => {
        let entities = Object.keys(cache.entities)
        let notSupported = ['publication entity', 'upload', 'organ']
        return entities.filter(entity => !notSupported.includes(entity))
    }

    const supportedBulkRegister = () => {
        let entities = Object.keys(cache.entities)

        let notSupported = ['publication entity', 'organ']
        entities = entities.filter(entity => !notSupported.includes(entity))

        const elem = entities.shift()
        // Insert upload before dataset
        entities.splice(3, 0, elem)
        return entities
    }

    const formatRegisterUrl = (entity, range) => {
        if (equals(entity, 'upload') || equals(range, 'single')) {
            return `/edit/${entity}?uuid=register`
        } else {
            return `/edit/bulk/${entity}?action=register`
        }
    }

    return (
        <Navbar
            ref={innerRef}
            variant={'dark'}
            expand="lg"
            className={`sticky-top bg--navBarGrey`}
        >
            <Container fluid={true}>
                <Navbar.Brand href={APP_ROUTES.search}>
                    <img
                        alt={_t("SenNet logo")}
                        src={'/static/sennet-logo.png'}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    {NAVBAR_TITLE}
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse>
                    <Nav className={'me-auto'}>
                        <NavDropdown
                            active={false}
                            variant={'primary'}
                            hidden={hidden || !isLoggedIn()}
                            title={_t("Register entity")}
                            id="nav-dropdown"
                        >
                            {['Single', 'Bulk'].map((range, key) => (
                                <div key={`dropdownItem-register-${range}`} id={`dropdownItem-register-${range}`}>
                                    {key !== 0 && <NavDropdown.Divider/>}
                                    <NavDropdown.Item className='dropdown-item is-heading'
                                                      aria-controls={`submenu-md-${range}`}>
                                        {range}
                                    </NavDropdown.Item>

                                    <div className={'submenu'} id={`submenu-md-${range}`}>
                                        {equals(range, 'single') && supportedSingleRegister().map((entity) => (
                                            <NavDropdown.Item key={entity} href={formatRegisterUrl(entity, range)}>
                                                {equals(entity, cache.entities.upload) ? 'Data Upload' : _t(entity)}
                                            </NavDropdown.Item>
                                        ))}

                                        {equals(range, 'bulk') && supportedBulkRegister().map((entity) => (
                                            <NavDropdown.Item key={entity} href={formatRegisterUrl(entity, range)}>
                                                {equals(entity, 'upload') ? 'Data (IDs and Data Files)' : equals(entity, 'dataset') ? 'Data (IDs Only)' : `${entity}s`}
                                            </NavDropdown.Item>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </NavDropdown>

                        <NavDropdown
                            active={false}
                            variant={'primary'}
                            hidden={hidden || !isLoggedIn()}
                            title="Upload metadata"
                            id="nav-dropdown--bulkMetadata">
                            {Object.keys(supportedMetadata()).map((entity, key) => (
                                <div key={`dropdownItem-md-${entity}`}>
                                    {key !== 0 && <NavDropdown.Divider/>}
                                    <NavDropdown.Item className='dropdown-item is-heading'
                                                      aria-controls={`submenu-md-${entity}`}>
                                        {entity}s
                                    </NavDropdown.Item>

                                    <div className={'submenu'} id={`submenu-md-${entity}`}>
                                        {Object.entries(supportedMetadata()[entity].categories).map((type, typekey) => (
                                            <NavDropdown.Item key={`submenuItem-md-${type[1]}`}
                                                              href={`/edit/bulk/${entity.toLowerCase()}?action=metadata&category=${type[1]}`}
                                                              className={'is-subItem'}>
                                                <span>{type[1]}</span>
                                            </NavDropdown.Item>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </NavDropdown>

                        <NavDropdown active={false}
                                     variant={'primary'}
                                     title="Documentation"
                                     id="nav-dropdown--docs">
                            <NavDropdown.Item key={`dd-getting-started`}
                                              href='https://docs.sennetconsortium.org/libraries/ingest-validation-tools/upload-guidelines/getting-started/'>
                                <span>Getting started</span>
                            </NavDropdown.Item>
                            <NavDropdown.Item key={`dd-search-md-schema`}
                                              href='https://docs.sennetconsortium.org/libraries/ingest-validation-tools/'>
                                <span>Metadata schemas & upload guidelines</span>
                            </NavDropdown.Item>
                            <NavDropdown.Item key={`dd-prov-ui`}
                                              href='https://docs.sennetconsortium.org/libraries/provenance-ui/'>
                                <span>Provenance UI</span>
                            </NavDropdown.Item>
                            <NavDropdown.Item key={`dd-apis`} href='https://docs.sennetconsortium.org/apis/'>
                                <span>APIs</span>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <NavDropdown active={false}
                                     variant={'primary'}
                                     align={{ lg: 'end' }}
                                     title="Atlas & Tools"
                                     id="nav-dropdown--atlas">
                            <NavDropdown.Item key={`dd-ccf-eui`}
                                              href='/ccf-eui'>
                                <span>Exploration User Interface (EUI)</span>
                            </NavDropdown.Item>
                            {isLoggedIn() &&
                                <NavDropdown.Item key={`dd-data-board`}
                                                  href={getDataIngestBoardEndpoint()}
                                                  target='_blank'>
                                    <span>Data Ingest Board</span>
                                </NavDropdown.Item>
                        }
                        </NavDropdown>
                        {isLoggedIn() ?
                            (
                                <NavDropdown active={false}
                                             variant={'primary'}
                                             title={userEmail}
                                             id="nav-dropdown--user">
                                    <NavDropdown.Item key={`dd-user-logout`}
                                                      hidden={signoutHidden}
                                                      href='#'
                                                      onClick={(e) => handleSession(e)}>
                                        {_t('Log out')}
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link
                                    className={'justify-content-end'}
                                    hidden={signoutHidden}
                                    href='#'
                                    onClick={(e) => handleSession(e)}
                                >{_t('Log in')}
                                </Nav.Link>
                            )
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar
