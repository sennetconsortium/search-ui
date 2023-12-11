import { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Spinner from "../../components/custom/Spinner";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import Header from "../../components/custom/layout/Header";
import OrganCard from "../../components/custom/organ/OrganCard";
import { APP_TITLE } from "../../config/config";
import AppContext from "../../context/AppContext";
import useOrganList from "../../hooks/organ/useOrganList";
import Link from "next/link";
import { APP_ROUTES } from "../../config/constants";

const AllOrgans = () => {
    const {
        logout,
        isRegisterHidden,
        isAuthorizing,
        isUnauthorized,
        hasAuthenticationCookie,
    } = useContext(AppContext);

    const { organs } = useOrganList();

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
                            <Link
                                className="text-decoration-none"
                                href={`${APP_ROUTES.organ}/${organ.urlParamName}`}
                            >
                                <OrganCard organ={organ} />
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default AllOrgans;
