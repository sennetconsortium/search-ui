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
                            Access denied
                        </p>
                        <p>
                            Check your permissions and log in <a href={APP_ROUTES.login}>here</a>
                        </p>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}

export default Unauthorized