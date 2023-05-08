import React, {useContext, useState} from "react";
import {
    ErrorBoundary,
    Results,
    SearchBox,
    SearchProvider,
    WithSearch
} from "@elastic/react-search-ui";
import {Layout} from "@elastic/react-search-ui-views";
import Facets from "search-ui/components/core/Facets";
import {TableResults} from '../components/custom/TableResults'
import {APP_TITLE, config, RESULTS_PER_PAGE, SORT_OPTIONS} from "../config/config";
import AppNavbar from "../components/custom/layout/AppNavbar";
import AppFooter from "../components/custom/layout/AppFooter";
import Header from "../components/custom/layout/Header";
import CustomClearSearchBox from "../components/custom/layout/CustomClearSearchBox";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from "../components/custom/Spinner";
import AppContext from "../context/AppContext";
import SelectedFilters from "../components/custom/layout/SelectedFilters";
import {getDataTypesByProperty, getUBKGFullName} from "../components/custom/js/functions";

function Search() {
    const {
        _t,
        cache,
        logout,
        isRegisterHidden,
        isAuthorizing,
        isUnauthorized,
        hasAuthenticationCookie
    } = useContext(AppContext);

    // Return an array of data types that should be excluded from search
    const excludeDataTypes = getDataTypesByProperty("vis-only", true)
    console.log(excludeDataTypes)
    config['searchQuery']['excludeFilters'].push({
        keyword: "data_types.keyword",
        value: excludeDataTypes
    });

    if (isAuthorizing()) {
        return <Spinner/>
    } else {
        if (isUnauthorized() && hasAuthenticationCookie()) {
            // This is a scenario in which the GLOBUS token is expired but the token still exists in the user's cookies
            logout()
            window.location.reload()
        }
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
                                                <div className="search-box-header js-gtm--search">
                                                    <SearchBox
                                                        view={({onChange, value, onSubmit}) => (
                                                            <Form onSubmit={onSubmit}>
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
                                                                                onClick={onSubmit}>{_t('Search')}</Button>
                                                                    </InputGroup>
                                                                </Form.Group>
                                                            </Form>
                                                        )}
                                                    />
                                                </div>
                                            }
                                            sideContent={
                                                <div data-js-ada='facets'>
                                                    <CustomClearSearchBox/>
                                                    <SelectedFilters/>

                                                    <Facets fields={config.searchQuery} filters={filters}
                                                            transformFunction={getUBKGFullName}/>

                                                </div>

                                            }
                                            bodyContent={
                                                <div className="js-gtm--results" data-js-ada='tableResults' data-ada-data='{"trigger": ".rdt_TableCell", "tabIndex": ".rdt_TableRow"}'>
                                                    {wasSearched && <Results filters={filters} titleField={filters}
                                                             view={TableResults}
                                                    />}
                                                    {!wasSearched && <Spinner /> }
                                                </div>

                                            }
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
    }
}

export default Search