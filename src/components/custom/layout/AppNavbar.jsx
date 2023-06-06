import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import {APP_TITLE, getLogoutURL} from '../../../config/config'
import {APP_ROUTES} from '../../../config/constants'
import {useContext} from 'react'
import logo from './sennet-logo.png'
import Image from 'next/image'
import AppContext from '../../../context/AppContext'

const AppNavbar = ({hidden, signoutHidden}) => {
    const {_t, isLoggedIn, logout, cache, supportedMetadata} = useContext(AppContext)


    const handleSession = (e) => {
        e.preventDefault()
        let url = APP_ROUTES.login
        if (isLoggedIn()) {
            logout()
            url = APP_ROUTES.logout //getLogoutURL()
        }
        window.location.replace(url)
    }

    const supportedBulkRegister = () => {
        let entities = Object.keys(cache.entities)
        let notSupported = ['publication']
        return entities.filter(entity => !notSupported.includes(entity))
    }


    return (
        <Navbar
            variant={'dark'}
            expand="lg"
            className={`sticky-top bg--navBarGrey`}
        >
            <Container fluid={true}>
                <Navbar.Brand
                    href={APP_ROUTES.search}
                    className={'d-flex align-items-center'}
                >
                    <Image
                        src={logo}
                        width="42"
                        height="42"
                        alt={_t("SenNet logo")}
                    />
                    <div className={'ms-2 fs-3'}>{APP_TITLE}</div>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse>
                    <Nav className={'me-auto'}>
                        <NavDropdown
                            active={false}
                            variant={'primary'}
                            hidden={hidden}
                            title={_t("Register entity")}
                            id="nav-dropdown"
                        >
                            {Object.keys(cache.entities).map((entity) => (
                                <NavDropdown.Item key={entity} href={`/edit/${entity}?uuid=register`}>
                                    {_t(entity)}
                                </NavDropdown.Item>
                            ))}

                        </NavDropdown>
                        <NavDropdown
                            active={false}
                            variant={'primary'}
                            hidden={hidden}
                            title="Bulk register entities"
                            id="nav-dropdown--bulkCreate">
                            {supportedBulkRegister().map((entity) => (
                                <NavDropdown.Item key={entity} href={`/edit/bulk/${entity}?action=register`}>
                                    {entity}s
                                </NavDropdown.Item>
                            ))}

                        </NavDropdown>
                        <NavDropdown
                            active={false}
                            variant={'primary'}
                            hidden={hidden}
                            title="Bulk upload metadata"
                            id="nav-dropdown--bulkMetadata">
                            {Object.keys(supportedMetadata()).map((entity, key) => (
                                <div key={`dropdownItem-md-${entity}`}>
                                { key !== 0 && <NavDropdown.Divider  /> }
                                    <NavDropdown.Item className='dropdown-item is-heading' aria-controls={`submenu-md-${entity}`}>
                                        {entity}s
                                    </NavDropdown.Item>

                                   <div className={'submenu'} id={`submenu-md-${entity}`}>
                                       {Object.entries(supportedMetadata()[entity].categories).map((type, typekey) => (
                                           <NavDropdown.Item key={`submenuItem-md-${type[1]}`} href={`/edit/bulk/${entity.toLowerCase()}?action=metadata&category=${type[1]}`} className={'is-subItem'}>
                                               <span>{type[1]}</span>
                                           </NavDropdown.Item>

                                       ))}
                                   </div>
                                </div>
                            ))}
                        </NavDropdown>
                    </Nav>
                    <Nav>
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
            </Container>
        </Navbar>
    )
}

export default AppNavbar
