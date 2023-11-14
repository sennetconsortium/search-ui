import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import {getDataIngestBoardEndpoint, NAVBAR_TITLE} from '../../../config/config'
import {APP_ROUTES} from '../../../config/constants'
import React, {useContext, useState} from 'react'
import AppContext from '../../../context/AppContext'
import {equals} from "../js/functions";
import {getCookie} from "cookies-next";
import Joyride from "react-joyride";

const AppNavbar = ({hidden, signoutHidden}) => {
    const {_t, isLoggedIn, logout, cache, supportedMetadata} = useContext(AppContext)
    const userEmail = (isLoggedIn() ? JSON.parse(atob(getCookie('info')))['email'] : "")
    const stepsCount = isLoggedIn() ? 6 : 4
    let _steps = [
        {
            target: '#search',
            title: <span>Search Entities by Free Text (1/{stepsCount})</span>,
            content: 'To further narrow the relevant entities, type search terms or phrases into the Search bar. Entities containing any of the search terms will be returned.'
        },
        {
            target: '.sui-facet',
            title: <span>Filter Your Browsing (2/{stepsCount})</span>,
            content: 'The faceted search options on the left side allows filtering entities by any combination of categories. Search results update automatically as you edit the selection of filters.',
        },
        {
            target: '.sc-eDWCr',
            title: <span>Sort Search Results (3/{stepsCount})</span>,
            content: 'Clicking the header of any column will sort search results. A bolded arrow indicates the current sorting selection. Clicking again will reverse the order.'
        },
        {
            target: '#sui-tbl-checkbox-actions',
            title: <span>Download Search Results (4/{stepsCount})</span>,
            content: <span>Clicking on the checkboxes <input type={'checkbox'} role='presentation' disabled /> on the left side of the search results table allows selecting distinct entities for export. Clicking on the ellipsis <button
                role='presentation'
                className="dropdown-toggle btn btn-secondary-outline border-0">...</button> at the top of the search results table allows for exporting either only the selected entities or all entities in the table to a <code>JSON</code> or <code>TSV</code> format.</span>
        }
    ]
    if (isLoggedIn()){
        _steps.push({
            target: '#submenu-md-Single',
            title: <span>Registering entities (5/{stepsCount})</span>,
            content: <span>You may register individual and bulk entities by clicking on this menu. Then selecting under <i>Single</i> for single registration or under <i>Bulk</i> for bulk registration.</span>
        })

        _steps.push({
            target: '#nav-dropdown--bulkMetadata',
            title: <span>Bulk uploading metadata (6/{stepsCount})</span>,
            content: <span>Select this menu to bulk upload metadata. <br /> <small className='text-muted'>Note: You may also upload metadata for a single entity during registration. See previous step for details.</small></span>
        })
    }
    const [steps, setSteps] = useState(_steps)

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
                        {/*<NavDropdown active={false}*/}
                        {/*             variant={'primary'}*/}
                        {/*             hidden={hidden}*/}
                        {/*             title="Search"*/}
                        {/*             id="nav-dropdown--search">*/}
                        {/*    <NavDropdown.Item key={`dd-search-entity`} href={APP_ROUTES.search}>*/}
                        {/*        <span>Entity</span>*/}
                        {/*    </NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item key={`dd-search-file`} href={`${APP_ROUTES.search}/files`}>*/}
                        {/*        <span>File</span>*/}
                        {/*    </NavDropdown.Item>*/}
                        {/*</NavDropdown>*/}
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
                        {isLoggedIn() &&
                            <Nav.Link href={getDataIngestBoardEndpoint()} target='_blank'>Data Ingest Board</Nav.Link>
                        }
                    </Nav>
                    <Nav>
                        {isLoggedIn() &&
                            <Navbar.Text>
                                {userEmail}
                            </Navbar.Text>
                        }
                        <Nav.Link
                            className={'justify-content-end'}
                            hidden={signoutHidden}
                            href='#'
                            onClick={(e) => handleSession(e)}
                        >
                            {isLoggedIn() ? _t('Log out') : _t('Log in')}
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Joyride
                    steps={steps}
                    hideCloseButton={true}
                    showProgress={true}
                    showSkipButton={true}
                    styles={{
                        options: {
                            arrowColor: '#ffffff',
                            backgroundColor: '#ffffff',
                            overlayColor: 'rgba(255,253,253,0.4)',
                            primaryColor: '#0d6efd',
                            textColor: 'rgba(0, 0, 0, 0.87)',
                            width: 900,
                            zIndex: 1000,
                        }
                    }}
                />
            </Container>
        </Navbar>
    )
}

export default AppNavbar
