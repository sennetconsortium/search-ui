import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router'
import Head from 'next/head'
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
import ClearSearchBox from '../search-ui/components/core/ClearSearchBox';
import Facets from "../search-ui/components/core/Facets";
import {TableResults, TableRowDetail} from "../components/custom/TableResults";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import 'bootstrap/dist/css/bootstrap.css';
import {APP_TITLE, config, RESULTS_PER_PAGE, SORT_OPTIONS} from "../config/config";
import log from "loglevel";
import AppNavbar from "../components/custom/layout/AppNavbar";
import cookieCutter from "cookie-cutter";


function Search() {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(cookieCutter().get('isAuthenticated'));

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
                    <WithSearch mapContextToProps={({wasSearched, filters}) => ({wasSearched, filters})}>
                        {({wasSearched, filters}) => {
                            return (
                                <div>
                                    <AppNavbar/>

                                    <ErrorBoundary>

                                        <Layout
                                            header={
                                                <div>
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
                </SearchProvider>
            </div>
        )
    } else {
        return (<div className={'login-container container'}>
            {!authorized && <div className={'alert alert-danger text-center'}>You have not been granted access to use the SenNet Data Sharing Portal</div>}
        </div>)
    }
}

export default Search