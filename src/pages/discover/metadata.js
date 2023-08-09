import React, { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import Header from "../../components/custom/layout/Header"
import { APP_TITLE } from "../../config/config"
import { SEARCH_METADATA } from "../../config/search/metadata"
import AppContext from "../../context/AppContext"
import Spinner from "../../components/custom/Spinner"
import AppNavbar from "../../components/custom/layout/AppNavbar"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import { Sui } from "search-ui/lib/search-tools"

function Metadata() {
    const { logout, isRegisterHidden, isAuthorizing, isUnauthorized, hasAuthenticationCookie } = useContext(AppContext)
    const router = useRouter()

    useEffect(() => {
        Sui.keyPrefix = "metadata"
    }, [])

    function handleBrowseButtonClicked(event, filters) {
        event.preventDefault()
        Sui.saveFilters(filters)
        router.push({
            pathname: "/search/metadata"
        })
    }

    if (isAuthorizing()) {
        return <Spinner />
    } else {
        if (isUnauthorized() && hasAuthenticationCookie()) {
            // This is a scenario in which the GLOBUS token is expired but the token still exists in the user"s cookies
            logout()
            window.location.reload()
        }
        return (
            <>
                <Header title={APP_TITLE} />
                <AppNavbar hidden={isRegisterHidden} />
                <Container className="mb-5">
                    <Row>
                        <div className="py-5 d-flex bd-highlight align-items-center">
                            <h1 className="m-0 flex-grow-1 bd-highlight">Browse by Popular Searches</h1>
                            <div className="bd-highlight">
                                <button className="btn btn-outline-primary rounded-0 clear-filter-button"
                                        onClick={(e) => handleBrowseButtonClicked(e, {})}>
                                    Browse All Metadata
                                </button>
                            </div>
                        </div>
                    </Row>

                    <Row xs={1} s={2} md={3} className="gy-4">
                        {SEARCH_METADATA.discover.map((item) => {
                            return (
                                <Col key={item.title} style={{ maxHeight: "350px" }}>
                                    <Card className="p-5 rounded-0 h-100">
                                        <Card.Body className="d-flex flex-column justify-content-between">
                                            <div>
                                                <div className={`mb-4 circle ${item.entityType}-background`} />
                                                <Card.Title className="mb-3">{item.title}</Card.Title>
                                                <Card.Text className="mb-4">{item.description}</Card.Text>
                                            </div>
                                            <Button variant="primary rounded-0"
                                                    onClick={(e) => handleBrowseButtonClicked(e, item.filters)}>
                                                Browse
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
            </>
        )
    }
}

export default Metadata
