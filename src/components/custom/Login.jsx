import React, {useEffect, useContext} from 'react'
import { APP_TITLE, getIngestLogin } from '../../config/config'
import { Row, Col, Container } from 'react-bootstrap'
import AppNavbar from './layout/AppNavbar'
import AppFooter from './layout/AppFooter'
import Header from './layout/Header'
import { getRootURL } from '../../config/config'
import { APP_ROUTES } from '../../config/constants'
import AppContext from '../../context/AppContext'

function Login() {
    const login_url = getIngestLogin()
    const {isLoggedIn} = useContext(AppContext);

    useEffect(() => {
        if (isLoggedIn()) {
            window.location.replace(getRootURL() + APP_ROUTES.search);
        }
    })

    return (
        <div>
            <Header title={APP_TITLE} />
            <AppNavbar hidden={true} signoutHidden={true} />
            <Container>
                <Row>
                    <Col></Col>
                    <Col xs={6}>
                        <div className={`card alert alert-info mt-4`}>
                            <div className="card-body">
                                <h3 className="card-title">{APP_TITLE}</h3>
                                <div className="card-text">
                                    User authentication is required to search
                                    the dataset catalog. Please click the button
                                    below and you will be redirected to a Globus
                                    page to select your institution. After
                                    selecting your institution, you will be
                                    redirected to your institutional login page
                                    to enter your credentials.
                                </div>
                                <hr />
                                <div
                                    className={'d-flex justify-content-center'}
                                >
                                    <a
                                        className="btn btn-outline-success rounded-0 btn-lg"
                                        href={login_url}
                                    >
                                        Log in with your institution credentials
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
            <AppFooter isFixedBottom={true} />
        </div>
    )
}

export default Login
