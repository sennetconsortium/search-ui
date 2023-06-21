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
import {TableResultsEntities} from '../../components/custom/TableResultsEntities'
import {APP_TITLE} from "../../config/config";
import {SEARCH_ENTITIES} from "../../config/search/entities"
import AppNavbar from "../../components/custom/layout/AppNavbar";
import AppFooter from "../../components/custom/layout/AppFooter";
import Header from "../../components/custom/layout/Header";
import CustomClearSearchBox from "../../components/custom/layout/CustomClearSearchBox";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from "../../components/custom/Spinner";
import AppContext from "../../context/AppContext";
import SelectedFilters from "../../components/custom/layout/SelectedFilters";
import {getDataTypesByProperty, getUBKGFullName} from "../../components/custom/js/functions";
import {Sui} from "search-ui/lib/search-tools";

function SearchEntities() {
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
    SEARCH_ENTITIES['searchQuery']['excludeFilters'].push({
        keyword: "data_types.keyword",
        value: excludeDataTypes
    });

    const [clearFacetInputs, setClearFacetInputs] = useState(0)

    function handleClearFiltersClick() {
        Sui.clearFilters()
        setClearFacetInputs(clearFacetInputs + 1)
    }

    function handleSearchFormSubmit(event, onSubmit) {
        onSubmit(event)
        setClearFacetInputs(clearFacetInputs + 1)
    }

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

                <SearchProvider config={SEARCH_ENTITIES}>
                    <WithSearch mapContextToProps={({wasSearched, filters, addFilter, removeFilter}) => ({wasSearched, filters, addFilter, removeFilter})}>
                        {({wasSearched, filters, addFilter, removeFilter}) => {
                            return (
                                <div onLoad={() => Sui.applyFilters(addFilter, removeFilter)}>
                                    <AppNavbar hidden={isRegisterHidden}/>

                                    <ErrorBoundary>

                                        <Layout
                                            header={
                                                <div className="search-box-header js-gtm--search">
                                                    <SearchBox
                                                        view={({onChange, value, onSubmit}) => (
                                                            <Form onSubmit={e => handleSearchFormSubmit(e, onSubmit)}>
                                                                <Form.Group controlId="search">
                                                                    <InputGroup>
                                                                        <Form.Control
                                                                            value={value}
                                                                            onChange={(e) => onChange(e.currentTarget.value)}
                                                                            className="form-control form-control-lg rounded-0"
                                                                            placeholder="Search"
                                                                            autoFocus={false}
                                                                        />
                                                                        <Button variant="outline-primary"
                                                                                className={"rounded-0"}
                                                                                onClick={e => handleSearchFormSubmit(e, onSubmit)}>{_t('Search')}</Button>
                                                                    </InputGroup>
                                                                </Form.Group>
                                                            </Form>
                                                        )}
                                                    />
                                                </div>
                                            }
                                            sideContent={
                                                <div data-js-ada='facets'>
                                                    <CustomClearSearchBox clearFiltersClick={handleClearFiltersClick} />

                                                    <SelectedFilters/>

                                                    {wasSearched &&
                                                        <Facets fields={SEARCH_ENTITIES.searchQuery}
                                                                filters={filters}
                                                                transformFunction={getUBKGFullName}
                                                                clearInputs={clearFacetInputs} />
                                                    }
                                                </div>

                                            }
                                            bodyContent={
                                                <div className="js-gtm--results sui-resultsTable" data-js-ada='tableResults' data-ada-data='{"trigger": ".rdt_TableCell", "tabIndex": ".rdt_TableRow"}'>
                                                    {wasSearched && <Results filters={filters} titleField={filters}
                                                                             view={TableResultsEntities}
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

export default SearchEntities