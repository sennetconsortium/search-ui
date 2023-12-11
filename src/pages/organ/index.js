import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Spinner from "../../components/custom/Spinner";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import Header from "../../components/custom/layout/Header";
import { APP_TITLE } from "../../config/config";
import { APP_ROUTES } from "../../config/constants";
import AppContext from "../../context/AppContext";
import useOrganList from "../../hooks/organ/useOrganList";

const AllOrgans = () => {
    const {
        logout,
        isRegisterHidden,
        isAuthorizing,
        isUnauthorized,
        hasAuthenticationCookie,
    } = useContext(AppContext);

    const { organs } = useOrganList();

    const getDisplayQty = (qty) => {
        if (qty === 1) {
            return "1 dataset";
        } else {
            return `${qty} datasets`;
        }
    };

    if (isAuthorizing()) {
        return <Spinner />;
    }

    if (isUnauthorized() && hasAuthenticationCookie()) {
        // This is a scenario in which the GLOBUS token is expired but the token still exists in the user"s cookies
        logout();
        window.location.reload();
    }

    return (
        <>
            <Header title={APP_TITLE} />
            <AppNavbar hidden={isRegisterHidden} signoutHidden={false} />
            <Container fluid className="mb-5 d-block">
                <Row>
                    <div className="py-4 bd-highlight">
                        <h2 className="m-0 flex-grow-1 bd-highlight">Organs</h2>
                    </div>
                </Row>

                <Row xs={1} s={2} md={4} className="gy-2">
                    {organs.map((organ) => (
                        <Col key={organ.ruiCode}>
                            <Card className="p-4 rounded-0 h-100">
                                <Card.Body className="d-flex flex-row justify-content-between">
                                    <div>
                                        <div className="mb-1 h4">
                                            {organ.term}
                                        </div>
                                        <div className="mb-1">
                                            {organ.organUberon}
                                        </div>
                                        {organ.datasetQty != undefined && (
                                            <Link href={organ.searchUrl}>
                                                <div className="title_badge">
                                                    <span className="badge bg-dataset p-2 text-dark">
                                                        {getDisplayQty(organ.datasetQty)}
                                                    </span>
                                                </div>
                                            </Link>
                                        )}
                                        <Link
                                            href={`${APP_ROUTES.organ}/${organ.urlParamName}`}
                                        >
                                            <Button variant="primary mt-4 rounded-0">
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                    <Image
                                        src={organ.icon}
                                        alt={organ.term}
                                        width="75"
                                        height="75"
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default AllOrgans;
