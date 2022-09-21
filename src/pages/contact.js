import React from 'react';
import AppNavbar from "../components/custom/layout/AppNavbar";
import AppFooter from "../components/custom/layout/AppFooter";
import {Container, Row, Col} from 'react-bootstrap'
import styles from '../public/css/contact.module.css'

const contact = () => {
    return (
        <>
            <AppNavbar
                hidden={true}
                signoutHidden={true}
            />
            <Container className={'mt-5 justify-content-center d-flex'}>
                <Row>
                    <Col></Col>
                    <Col xs={6}>
                        <h1>Contact Us</h1>
                        <h3>Have a question or comment? Send us an email at <a className={styles.link} href="mailto:sennetconsortium.org">help@sennetconsortium.org</a></h3>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
            <AppFooter
                isFixedBottom={true}
            />
        </>
    );
};

export default contact;