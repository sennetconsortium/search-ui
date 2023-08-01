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
import {TableResultsFiles} from '../../components/custom/TableResultsFiles'
import {APP_TITLE} from "../../config/config";
import {SEARCH_FILES} from "../../config/search/files"
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
import SelectedFacets from "../../components/custom/search/SelectedFacets";

function SearchFiles() {
    const {
        _t,
        cache,
        logout,
        isRegisterHidden,
        isAuthorizing,
        isUnauthorized,
        hasAuthenticationCookie
    } = useContext(AppContext);



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

                <SearchProvider config={SEARCH_FILES}>
                    <WithSearch mapContextToProps={({wasSearched, filters, addFilter, removeFilter, rawResponse}) => ({wasSearched, filters, addFilter, removeFilter, rawResponse})}>
                        {({wasSearched, filters, addFilter, removeFilter, rawResponse}) => {
                            return (
                                <div onLoad={() => Sui.applyFilters(addFilter, removeFilter, 'files')}>
                                    <AppNavbar hidden={isRegisterHidden}/>

                                    <ErrorBoundary>

                                        <Layout
                                            header={
                                                <>
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
                                                    <div className='sui-filters-summary'><SelectedFacets filters={filters} /></div>
                                                </>
                                            }
                                            sideContent={
                                                <div data-js-ada='facets'>
                                                    <CustomClearSearchBox clearFiltersClick={handleClearFiltersClick} />

                                                    <SelectedFilters/>

                                                    {wasSearched &&
                                                        <Facets fields={SEARCH_FILES.searchQuery}
                                                                filters={filters}
                                                                transformFunction={getUBKGFullName}
                                                                clearInputs={clearFacetInputs} />
                                                    }
                                                </div>

                                            }
                                            bodyContent={
                                                <div className="js-gtm--results sui-resultsTable" data-js-ada='tableResults' data-ada-data='{"trigger": ".rdt_TableCell", "tabIndex": ".rdt_TableRow"}'>
                                                    {wasSearched && <Results filters={filters} titleField={filters} rawResponse={rawResponse}
                                                                             view={TableResultsFiles}
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

export default SearchFiles