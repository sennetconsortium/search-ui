import React from "react";
import {Col, Container, Row} from 'react-bootstrap'
import {APP_ROUTES} from "../../../config/constants";
import {getCookie} from "cookies-next";

const Unauthorized = () => {
    const email = JSON.parse(atob(getCookie('info')))['email']
    return (
        <Container className={'mt-5'}>
            <Row>
                <Col md={{span: 8, offset:2}}>
                    <div className={'alert alert-danger'}>
                        <p>
                            You are trying to access the Data Portal, logged in as <b>{email}</b>.
                            You are not authorized to log into this portal with that account. Please check that
                            you have registered via the <a href={"https://profile.sennetconsortium.org/profile"}>Member
                            Registration Page</a>, have provided Globus account
                            information and are logging in with that account.
                        </p>
                        <p>
                            Once you have confirmed your registration information you can <a href={APP_ROUTES.login}>log in</a> again.
                            Without login you can view the public facing <a href={APP_ROUTES.search}>Data Portal</a>.
                        </p>
                        <p>
                            If you continue to have issues accessing this site please contact the <a
                            href={"mailto:help@sennetconsortium.org"}>SenNet Help Desk</a>.
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Unauthorized