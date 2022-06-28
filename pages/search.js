import React, { useState, useEffect} from "react";
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {
  ErrorBoundary,
  Facet,
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
  Layout,
  SingleSelectFacet,
  SingleLinksFacet,
  BooleanFacet
} from "@elastic/react-search-ui-views";
import ClearSearchBox  from '../search-ui/components/core/ClearSearchBox';
import Facets from "../search-ui/components/core/Facets";
import { TableResults, TableRowDetail } from "../components/custom/TableResults";
import { FORM_FIELD_DEF } from '../config/formdefinitions';
import { Navbar, Nav, Container } from 'react-bootstrap';
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import 'bootstrap/dist/css/bootstrap.css';
import { config, connector, SORT_OPTIONS,APP_TITLE } from "../config/config";


//export default function Home() {
export default function search() {

   // setting the default form with is '0' in the formdefinition.js file
   const [currentPageData, setCurrentPageData] = useState(FORM_FIELD_DEF[0]);
   const [authorized, setAuthorized] = useState(true);
   const router = useRouter()

   if (authorized === true) {
  return (
    <div>
      <Head>
        <title>{APP_TITLE}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
 
   <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
          return (
            <div className="App">

              <Navbar className="navbar navbar-expand-lg navbar-light">
                <Container fluid={true}>
                  <Navbar.Brand href="#home">
                    {APP_TITLE}
                  </Navbar.Brand>

                    <Nav className="justify-content-end">
                    <Nav.Link href="/editform/?action=create">Register Dataset</Nav.Link> 
                    <Nav.Link href="http://localhost:8484/logout">| Sign-out</Nav.Link>
                    </Nav>
                </Container>
              </Navbar>
              <ErrorBoundary>

                <Layout
                  header={
                    <div>
                    <div>Data Explorer</div>
                    <SearchBox />
                    <ClearSearchBox />
                    </div>
                  }
                  sideContent={
                    <div>
                      {wasSearched && (
                      <Sorting
                        label={"Sort by"}
                        sortOptions={SORT_OPTIONS}
                      />
                    )}

                    <Facets fields={config.searchQuery} />
                 
                    </div>

                  }
                  bodyContent={
                    <Results
                      view={TableResults} resultView={TableRowDetail}
                    />
                  }
                  bodyHeader={
                    <React.Fragment>
                      {wasSearched && <PagingInfo />}
                      {<Paging />}
                      {wasSearched && <ResultsPerPage />}
                    </React.Fragment>
                  }
                  bodyFooter={<Paging />}
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