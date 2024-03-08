import React, {useEffect, useContext, useState} from 'react'
import { Row, Col, Container, Card, Button } from 'react-bootstrap'
import AppNavbar from "../../components/custom/layout/AppNavbar";
import AppFooter from "../../components/custom/layout/AppFooter";
import Header from "../../components/custom/layout/Header";
import AppContext from "../../context/AppContext";
import {APP_TITLE, getIngestLogin} from "../../config/config";
import Spinner, {SpinnerEl} from "../../components/custom/Spinner";
import {toast} from "react-toastify";
import Unauthorized from '../../components/custom/layout/Unauthorized';

function Login() {
    const { _t, authorized, isUnauthorized, checkUIAdminStatus, router} = useContext(AppContext)

    const [busy, setBusy] = useState(false)
    const [uiAdminAuthorized, setUIAdminAuthorized] = useState({
        authorized: false,
        loading: true,
    })

    useEffect(() => {
        checkUIAdminStatus()
        .then((adminUnauthorized) => {
            setUIAdminAuthorized({
                authorized: adminUnauthorized,
                loading: false,
            })
        })
    }, [])

    useEffect(() => {
        if (isUnauthorized()) {
            const loginUrl = getIngestLogin()
            router.push(loginUrl)
            return
        }
    }, [authorized])

    const clearCache = async () => {
        const url = '/api/ontology'
        try {
            setBusy(true)
            await toast.promise(
                fetch(url, { method: 'DELETE' }),
                {
                    pending: 'Attempting to clear cache...',
                    success: 'Cache cleared 👌',
                    error: 'Something went wrong with clearing the cache. 🤯'
                }
            )
        } catch (error) {
            console.error(`ONTOLOGY: cache could not be cleared`)
        }
        setBusy(false)
    }

    if (!authorized || uiAdminAuthorized.loading) {
        return <Spinner />
    }

    if (!uiAdminAuthorized.authorized) {
        return <Unauthorized />
    }

    return (
        <div>
            <Header title={APP_TITLE}/>
            <AppNavbar hidden={true}/>
            <Container>
                <Row md={12} className={'mt-3 mb-3'}>
                    <h4>{_t(`Administrative`)}</h4>
                </Row>
                <Row>
                    <Col>
                        <Card className={'px-2 py-2 tooly'} style={{width: '18rem'}}>
                            <Card.Img variant="top" src="clear-cache.jpeg"/>
                            <Card.Body className={'mt-2 mb-2'}>
                                <Card.Title>Clear Cache</Card.Title>
                                <Card.Text>
                                    Quickly refresh ontology cache.
                                </Card.Text>
                                <Row>
                                    <Col sm={10}><Button variant="primary" onClick={clearCache}>Clear Cache</Button></Col>
                                    <Col sm={2}>{busy && <SpinnerEl />}</Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <AppFooter />
        </div>
    )
}

export default Login
