import React, {useContext, useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import Spinner from "../../components/custom/Spinner";
import Unauthorized from "../../components/custom/layout/Unauthorized";
import Header from "../../components/custom/layout/Header";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import AppContext from "../../context/AppContext";
import Alert from 'react-bootstrap/Alert';
import {eq, getHeaders, getStatusColor, getStatusDefinition} from "../../components/custom/js/functions";
import SenNetPopover from "../../components/SenNetPopover";
import DataTable from "react-data-table-component";
import ColumnsDropdown from "../../components/custom/search/ColumnsDropdown";
import { Col, Container, Row, Button } from "react-bootstrap";
import {RESULTS_PER_PAGE} from "../../config/config";
import {ResultsPerPage} from "../../components/custom/search/ResultsPerPage";
function ViewJobs({children}) {


    const [data, setData] = useState([])
    const {router, isRegisterHidden, isUnauthorized, isAuthorizing, _t, cache} = useContext(AppContext)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const currentColumns = useRef([])
    const [hiddenColumns, setHiddenColumns] = useState(null)
    const [resultsPerPage, setResultsPerPage] = useState(RESULTS_PER_PAGE[1])

    const getAction = (row) => {
        const status = row.status
        let actions = []
        const isValidate = row.hitPath.includes('/bulk/validate')
        if (eq(status, 'Complete')) {

            if (!row.errors.length && isValidate) {
                actions.push('Register')
            }
            actions.push('Delete')
        } else if (eq(status, 'Error') && row.errors.length && isValidate) {
            actions.push('Resubmit')
        } else if (eq(status, 'Processing')) {
            actions.push('Cancel')
        }
        return actions
    }

    const getVariant = (action) => {
        switch (action) {
            case 'Delete':
                return 'danger'
            case 'Register':
                return 'success'
            case 'Cancel':
                return 'warning'
            default:
                return 'primary'
        }
    }

    const getActionUI = (row) => {
        const actions = getAction(row)
        let ui = [];
        for (let action of actions) {
            ui.push(<Button key={action} variant={getVariant(action)} className={'mx-1'} size="sm">{action}</Button>)
        }

        return ui
    }

    const getTableColumns = (hiddenColumns) => {
        let cols = [
            {
                name: 'Run ID',
                selector: row => row.run_id,
                sortable: true,
                reorder: true,
                format: row => <span data-field='run_id'>{row.run_id}</span>,
            },
            {
                name: 'Description',
                selector: row => row.description,
                sortable: true,
                reorder: true,
                format: row => <span data-field='run_id'>{row.description}</span>,
            },
            {
                name: 'Status',
                selector: row => row.status,
                format: (row) => {
                    return (<div>
                        <span className={`${getStatusColor(row.status)} badge`}>
                        <SenNetPopover text={getStatusDefinition(row.status)} className={`status-info-${row.run_id}`}>
                            {row.status}
                        </SenNetPopover>
                        </span>
                            {eq(row.status, 'Error') && <a className={'mx-2'} href={'#'}><small>View details</small></a>}
                    </div>

                    )
                },
                sortable: true,
                reorder: true,
            },
            {
                name: 'Start Date',
                selector: row => row.created_timestamp,
                sortable: true,
                reorder: true,
                omit: true,
                format: row => <span data-field='start-date'>{new Date(row.created_timestamp).toLocaleDateString()}</span>,
            },
            {
                name: 'End Date',
                selector: row => row.updated_timestamp,
                sortable: true,
                reorder: true,
                omit: true,
                format: row => <span data-field='action'>{new Date(row.updated_timestamp).toLocaleDateString()}</span>,
            },
            {
                name: 'Action',
                selector: row => getAction(row),
                sortable: true,
                reorder: true,
                format: row => <span data-field='action'>{getActionUI(row)}</span>,
            }
        ]

        if (hiddenColumns) {
            for (let col of cols) {
                col.omit = hiddenColumns[col.name] || false
            }
        }
        currentColumns.current = cols;
        return cols;
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/socket', getHeaders())
            const data = await response.json();

            setData([{
                run_id: 'SOME UUID 0',
                description: 'Validating somethings',
                status: 'Complete',
                hitPath: '/bulk/validate',
                errors: []
            },
            {
                run_id: 'SOME UUID 1',
                description: 'Validating somethings',
                status: 'Error',
                hitPath: '/bulk/validate',
                errors: [1,3]
            },
            {
                run_id: 'SOME UUID 2',
                description: 'Registering somethings',
                status: 'Complete',
                hitPath: '/bulk/register',
                errors: []
            },
            {
                run_id: 'SOME UUID 3',
                description: 'Validating somethings',
                status: 'Processing',
                hitPath: '/bulk/validate',
                errors: []
            }])
        }

        fetchData()
    }, [])

    const searchContext = () => `jobs-queue`

    if ((isAuthorizing() || isUnauthorized()) && !data) {
        return (
            data == null ? <Spinner/> : <Unauthorized/>
        )
    } else {
        return (
            <>
                {data && <Header title={`User | Jobs | SenNet`}></Header>}

                <AppNavbar hidden={isRegisterHidden} signoutHidden={false}/>

                {error &&
                    <div><Alert variant='warning'>{_t(errorMessage)}</Alert></div>
                }
                {data && !error && <Container fluid className="mb-5 d-block">
                    <Row>
                        <div className="py-4 bd-highlight">
                            <h2 className="m-0 flex-grow-1 bd-highlight">Current Tasks</h2>
                        </div>
                    </Row>

                    <Row>
                    <div className='sui-layout-main-header mt-4 mb-4'>
                        <div className='sui-layout-main-header__inner'>
                            <div><Button variant={'outline-primary'}><i className={'bi bi-arrow-clockwise mx-1'} role={'presentation'}></i>Refresh</Button></div>
                            {data.length > 0 && <ColumnsDropdown searchContext={searchContext} defaultHiddenColumns={['Start Date', 'End Date']} getTableColumns={getTableColumns} setHiddenColumns={setHiddenColumns}
                                                                 currentColumns={currentColumns} />}
                            <ResultsPerPage resultsPerPage={resultsPerPage} setResultsPerPage={setResultsPerPage} totalRows={data.length}  />
                        </div>
                    </div>
                    <DataTable columns={getTableColumns(hiddenColumns)} data={data} fixedHeader={true} pagination />
                    </Row>
                </Container>}
                </>
        )
    }
}

ViewJobs.defaultProps = {}

ViewJobs.propTypes = {
    children: PropTypes.node
}

export default ViewJobs