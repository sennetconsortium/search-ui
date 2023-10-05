import React from "react";
import {getRootURL} from "../../../config/config";
import {Col, Container, Row} from 'react-bootstrap'
import { APP_ROUTES } from "../../../config/constants";

const Unauthorized = () => {
    return (
        <Container className={'mt-5'}>
            <Row>
                <Col></Col>
                <Col xs={6}>
                    <div className={'alert alert-danger text-center'}>
                        <p>
                            You are trying to access the Data Portal. In order to do so, you must have provided a Globus
                            account during member registration. If you have not provided a Globus account, please go to <a href={"https://profile.sennetconsortium.org/profile"}>https://profile.sennetconsortium.org/profile</a> and
                            provide your SenNet Data Via Globus.

                            <br></br>With any other questions, please reach out to the <a
                            href={"mailto:help@sennetconsortium.org"}>SenNet Help Desk</a>.
                        </p>
                        <p>
                            Once you have completed these steps you may log in again <a href={APP_ROUTES.login}>here</a>.
                        </p>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}

export default Unauthorized