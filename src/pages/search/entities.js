import React, {useContext} from "react";
import {ErrorBoundary, SearchBox} from "@elastic/react-search-ui";
import {Layout} from "@elastic/react-search-ui-views";
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
import {Search} from "react-bootstrap-icons";
import SelectedFacets from "../../components/custom/search/SelectedFacets";
import SearchUIContainer from "search-ui/components/core/SearchUIContainer";
import FacetsContent from "../../components/custom/search/FacetsContent";
import BodyContent from "../../components/custom/search/BodyContent";
import {TableResultsEntities} from "../../components/custom/TableResultsEntities";
import InvalidToken from "../../components/custom/layout/InvalidToken";

function SearchEntities() {
    const {
        _t,
        logout,
        isRegisterHidden,
        hasInvalidToken,
        validatingToken,
        isAuthorizing,
        isUnauthorized,
        hasAuthenticationCookie
    } = useContext(AppContext);

    // Return an array of data types that should be excluded from search
    // const excludeDataTypes = getDataTypesByProperty("vis-only", true)
    const excludeNonPrimaryTypes = getDataTypesByProperty("primary", false)
    SEARCH_ENTITIES['searchQuery']['excludeFilters'].push({
        keyword: "data_types.keyword",
        value: excludeNonPrimaryTypes
    });

    // Define here because we need auth state from AppContext
    SEARCH_ENTITIES['searchQuery']['conditionalFacets']['rui_location'] = ({filters}) => {
        return hasAuthenticationCookie() && !isUnauthorized() && 
            filters.some((filter) => filter.field === "entity_type" && filter.values.includes("Sample"))
    }

    SEARCH_ENTITIES['searchQuery']['conditionalFacets']['ancestors.rui_location'] = ({filters}) => {
        return hasAuthenticationCookie() && !isUnauthorized() && 
            filters.some((filter) => filter.field === "entity_type" && filter.values.includes("Dataset"))
    }

    function handleSearchFormSubmit(event, onSubmit) {
        onSubmit(event)
    }

    if (validatingToken() || isAuthorizing()) {
        return <Spinner/>
    } else if (hasInvalidToken()) {
        return <InvalidToken/>
    } else {
        if (isUnauthorized() && hasAuthenticationCookie()) {
            // This is a scenario in which the GLOBUS token is expired but the token still exists in the user's cookies
            logout()
            window.location.reload()
        }
        return (
            <>
                <Header title={APP_TITLE}/>

                <SearchUIContainer config={SEARCH_ENTITIES} name='entities'>
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
                                                                className="right-border-none form-control form-control-lg rounded-0"
                                                                placeholder="Search"
                                                                autoFocus={false}
                                                            />
                                                            <InputGroup.Text
                                                                className={"transparent"}><Search/></InputGroup.Text>
                                                            <Button variant="outline-primary"
                                                                    className={"rounded-0"}
                                                                    onClick={e => handleSearchFormSubmit(e, onSubmit)}>{_t('Search')}</Button>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Form>
                                            )}
                                        />
                                    </div>
                                    <div className='sui-filters-summary'>
                                        <SelectedFacets />
                                    </div>
                                </>
                            }
                            sideContent={
                                <div data-js-ada='facets'>
                                    <CustomClearSearchBox />

                                    <SelectedFilters />

                                    <FacetsContent transformFunction={getUBKGFullName}/>
                                </div>
                            }
                            bodyContent={
                                <BodyContent view={TableResultsEntities} />
                            }
                        />
                    </ErrorBoundary>
                </SearchUIContainer>

                <AppFooter/>
            </>
        )
    }
}

export default SearchEntities