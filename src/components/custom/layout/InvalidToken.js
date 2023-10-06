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
                    <div className={'alert alert-danger text-center'}>
                        <p>
                            The token you are using is either expired or invalid. Please <a href={APP_ROUTES.logout}>log out</a> then try to log in again.
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