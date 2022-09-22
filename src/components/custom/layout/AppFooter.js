import React from 'react';
import {Container} from 'react-bootstrap'

const AppFooter = ({isFixedBottom}) => {
    let fixedBottom = isFixedBottom ? 'fixed-bottom' : ''
    return (
        <Container>
            <footer className={`py-3 my-4 ${fixedBottom}`}>
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                    <li className="nav-item"><a href="https://sennetconsortium.org/"
                                                className="nav-link px-2 text-muted">SenNet Consortium</a></li>
                    <li className="nav-item"><a href="https://sennetconsortium.org/about-2/"
                                                className="nav-link px-2 text-muted">About</a></li>
                    <li className="nav-item"><a href="https://sennetconsortium.org/involvement/"
                                                className="nav-link px-2 text-muted">Involvement</a></li>
                    <li className="nav-item"><a href="https://sennetconsortium.org/contact"
                                                className="nav-link px-2 text-muted">Contact</a></li>
                </ul>
                <div className="text-center text-muted"><a href="https://commonfund.nih.gov/senescence"
                                                           className={'nav-link px-2 text-muted'}>NIH Common Fund</a>
                </div>
            </footer>
        </Container>
    );
};

export default AppFooter;