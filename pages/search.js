import React, {useState, useEffect} from "react";
import {useRouter} from 'next/router'
import Head from 'next/head'
import {
    ErrorBoundary,
    SearchProvider,
    SearchBox,
    Results,
    PagingInfo,
    ResultsPerPage,
    Paging,
    Sorting,
    WithSearch
} from "@elastic/react-search-ui";
import {
    Layout
} from "@elastic/react-search-ui-views";
import ClearSearchBox from '../search-ui/components/core/ClearSearchBox';
import Facets from "../search-ui/components/core/Facets";
import {TableResults, TableRowDetail} from "../components/custom/TableResults";
import {Navbar, Nav, Container} from 'react-bootstrap';
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import 'bootstrap/dist/css/bootstrap.css';
import {config, SORT_OPTIONS, APP_TITLE, getFilters, getAuth} from "../config/config";
import log from "loglevel";


function Search() {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(true);

    useEffect(() => {
        log.debug('ROUTER CHANGED: useEffect: query:', router.query)

        if (router.query.hasOwnProperty("filters[0][values][0]")) {
            log.debug("QUERY FILTERS: " + router.query["filters[0][values][0]"])
        }
    }, [router.query]);


    if (authorized === true) {
        return (
            <div>
                <Head>
                    <title>{APP_TITLE}</title>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>

                <SearchProvider config={config}>
                    <WithSearch mapContextToProps={({wasSearched}) => ({wasSearched})}>
                        {({wasSearched}) => {
                            return (
                                <div className="App">

                                    <Navbar className="navbar navbar-expand-lg navbar-light">
                                        <Container fluid={true}>
                                            <Navbar.Brand href="#home">
                                                {APP_TITLE}
                                            </Navbar.Brand>

                                            <Nav className="justify-content-end">
                                                <Nav.Link href="/edit/sample?uuid=create">Register Sample</Nav.Link>
                                                <Nav.Link href="http://localhost:8484/logout">Sign-out</Nav.Link>
                                            </Nav>
                                        </Container>
                                    </Navbar>
                                    <ErrorBoundary>

                                        <Layout
                                            header={
                                                <div>
                                                    <div>Data Explorer</div>
                                                    <SearchBox/>
                                                    <ClearSearchBox/>
                                                </div>
                                            }
                                            sideContent={
                                                <>
                                                    {wasSearched && (
                                                        <Sorting
                                                            label={"Sort by"}
                                                            sortOptions={SORT_OPTIONS}
                                                        />
                                                    )}

                                                    <Facets fields={config.searchQuery}/>

                                                </>

                                            }
                                            bodyContent={
                                                <Results
                                                    view={TableResults} resultView={TableRowDetail}
                                                />
                                            }
                                            bodyHeader={
                                                <React.Fragment>
                                                    {wasSearched && <PagingInfo/>}
                                                    {<Paging/>}
                                                    {wasSearched && <ResultsPerPage/>}
                                                </React.Fragment>
                                            }
                                            bodyFooter={<Paging/>}
                                        />
                                    </ErrorBoundary>
                                </div>
                            );
                        }}
                    </WithSearch>
                </SearchProvider>
            </div>
        )
    } else {
        return (<div>Loading...</div>)
    }
}

export default Search