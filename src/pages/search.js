import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router'
import {
    ErrorBoundary,
    Paging,
    PagingInfo,
    Results,
    ResultsPerPage,
    SearchBox,
    SearchProvider,
    Sorting,
    WithSearch
} from "@elastic/react-search-ui";
import {Layout} from "@elastic/react-search-ui-views";
import Facets from "../search-ui/components/core/Facets";
import {TableResults, TableRowDetail} from "../components/custom/TableResults";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import 'bootstrap/dist/css/bootstrap.css';
import {APP_TITLE, config, RESULTS_PER_PAGE, SORT_OPTIONS} from "../config/config";
import log from "loglevel";
import AppNavbar from "../components/custom/layout/AppNavbar";
import {get_read_write_privileges} from "../lib/services";
import {getCookie} from "cookies-next";
import Unauthorized from "../components/custom/layout/Unauthorized";
import AppFooter from "../components/custom/layout/AppFooter";
import Header from "../components/custom/layout/Header";
import CustomClearSearchBox from "../components/custom/layout/CustomClearSearchBox";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ux from "../components/custom/js/ux/ux";

function Search() {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(null);
    const [isRegisterHidden, setIsRegisterHidden] = useState(false)

    useEffect(() => {
        get_read_write_privileges().then(response => {
            setAuthorized(response.read_privs)
            setIsRegisterHidden(!response.write_privs)
            ux('init')
        }).catch(error => log.error(error))
    });


    if (authorized === null) {
        return (
            <div className="text-center p-3">
                <span>Loading, please wait...</span>
                <br></br>
                <span className="spinner-border spinner-border-lg align-center alert alert-info"></span>
            </div>
        )
    } else if (authorized && getCookie('isAuthenticated')) {
        return (
            <>
                <Header title={APP_TITLE}/>

                <SearchProvider config={config}>
                    <WithSearch mapContextToProps={({wasSearched, filters}) => ({wasSearched, filters})}>
                        {({wasSearched, filters}) => {
                            return (
                                <div>
                                    <AppNavbar hidden={isRegisterHidden}/>

                                    <ErrorBoundary>

                                        <Layout
                                            header={
                                                <div className="search-box-header">
                                                    <SearchBox
                                                        view={({onChange, value, onSubmit}) => (
                                                            <Form onSubmit={onSubmit} className="js-gtm--search">
                                                                <Form.Group controlId="search">
                                                                    <InputGroup>
                                                                        <Form.Control
                                                                            value={value}
                                                                            onChange={(e) => onChange(e.currentTarget.value)}
                                                                            className="form-control form-control-lg rounded-0"
                                                                            placeholder="Search"
                                                                            autoFocus={true}
                                                                        />
                                                                        <Button variant="outline-primary"
                                                                                className={"rounded-0"}
                                                                                onClick={onSubmit}>Search</Button>
                                                                    </InputGroup>
                                                                </Form.Group>
                                                            </Form>
                                                        )}
                                                    />
                                                </div>
                                            }
                                            sideContent={
                                                <>
                                                    <CustomClearSearchBox/>

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
                                                <Results filters={filters} titleField={filters}
                                                         view={TableResults} resultView={TableRowDetail}
                                                />
                                            }
                                            bodyHeader={
                                                <React.Fragment>
                                                    {wasSearched && <PagingInfo/>}
                                                    {<Paging/>}
                                                    {wasSearched && <ResultsPerPage options={RESULTS_PER_PAGE}/>}
                                                </React.Fragment>
                                            }
                                            bodyFooter={<Paging/>}
                                        />
                                    </ErrorBoundary>
                                </div>
                            );
                        }}
                    </WithSearch>
                    <AppFooter/>
                </SearchProvider>
            </>
        )
    } else {
        return (
            <Unauthorized/>
        )
    }
}

export default Search