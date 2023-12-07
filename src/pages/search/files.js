import React, {useContext} from "react";
import {ErrorBoundary, SearchBox} from "@elastic/react-search-ui";
import {Layout} from "@elastic/react-search-ui-views";
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
import {getUBKGFullName} from "../../components/custom/js/functions";
import SelectedFacets from "../../components/custom/search/SelectedFacets";
import SearchUIContainer from "search-ui/components/core/SearchUIContainer";
import FacetsContent from "../../components/custom/search/FacetsContent";
import BodyContent from "../../components/custom/search/BodyContent";
import SearchDropdown from "../../components/custom/search/SearchDropdown";

function SearchFiles() {
    const {
        _t,
        logout,
        isRegisterHidden,
        isAuthorizing,
        isUnauthorized,
        hasAuthenticationCookie
    } = useContext(AppContext);

    function handleSearchFormSubmit(event, onSubmit) {
        onSubmit(event)
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

                <SearchUIContainer config={SEARCH_FILES} name='files'>
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
                                    <div className='sui-filters-summary'>
                                        <SelectedFacets />
                                    </div>
                                </>
                            }
                            sideContent={
                                <div data-js-ada='facets'>
                                    <SearchDropdown title='Files' />

                                    <CustomClearSearchBox />

                                    <SelectedFilters />

                                    <FacetsContent transformFunction={getUBKGFullName}/>
                                </div>

                            }
                            bodyContent={
                                <BodyContent view={TableResultsFiles} />
                            }
                        />
                    </ErrorBoundary>
                </SearchUIContainer>
                <AppFooter/>
            </>
        )
    }
}

export default SearchFiles
