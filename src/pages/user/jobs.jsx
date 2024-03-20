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
import AppModal from "../../components/AppModal";
import {tableColumns} from "../../components/custom/edit/AttributesUpload";
import Swal from 'sweetalert2'

function ViewJobs({children}) {


    const [data, setData] = useState([])
    const {router, isRegisterHidden, isUnauthorized, isAuthorizing, _t, cache} = useContext(AppContext)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const currentColumns = useRef([])
    const [hiddenColumns, setHiddenColumns] = useState(null)
    const [resultsPerPage, setResultsPerPage] = useState(RESULTS_PER_PAGE[1])
    const [showModal, setShowModal] = useState(false)
    const [modalBody, setModalBody] = useState(null)
    const [modalTitle, setModalTitle] = useState(null)

    const getAction = (row) => {
        const status = row.status
        let actions = []
        const isValidate = row.description.includes('validation')
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

    const handleDelete = (row) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This cannot be undone once deleted.',
            dangerMode: true,
            buttons: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            customClass: {
                cancelButton: 'btn btn-secondary',
                confirmButton: 'btn btn-danger',
            },
            didOpen: () => {
                // run when swal is opened...
            },
            didClose: () => {
                // run when swal is closed...
            }
        }).then(result => {
            if (result.isConfirmed) {
                // Delete
            }
        }).catch(error => {
            // when promise rejected...
        });
    }

    const handleAction = (action, row) => {
        console.log(action)
        if (eq(action, 'Delete')) {
            handleDelete(row)
        } else if (eq(action, 'Register')) {

        } else if (eq(action, 'Cancel')) {

        } else {
           window.location = `/edit/bulk/${row.entity}?action=metadata&category=${row.subType}`
        }
    }

    const getActionUI = (row) => {
        const actions = getAction(row)
        let ui = [];
        for (let action of actions) {
            ui.push(<Button key={action} variant={getVariant(action)} className={'mx-1'} size="sm" onClick={() => handleAction(action, row)}>{action}</Button>)
        }

        return ui
    }

    const flatten = (array) => {
        if (!Array.isArray(array)) return [array]
        if (Array.isArray(array) && array.length && array[0].row !== undefined) return array
        let result = []
        for (let item of array) {
            for (let k in item) {
                if (Array.isArray(item[k]) && item[k].length && item[k][0].row === undefined) {
                    result = flatten(item[k])
                } else {
                    result = result.concat(item[k])
                }
            }
        }
        return result
    }

    const handleViewErrorDetails = (row) => {
        const columns = tableColumns()
        let errors = flatten(row.errors)
        setShowModal(true)
        setModalTitle(<h3>Task Error Details</h3>)
        setModalBody(<div className={'table-responsive has-error'}><DataTable columns={columns} data={errors} pagination /></div> )
    }

    const getTableColumns = (hiddenColumns) => {
        let cols = [
            {
                name: 'Task ID',
                selector: row => row.task_id,
                sortable: true,
                reorder: true,
                format: row => <span data-field='task_id'>{row.task_id}</span>,
            },
            {
                name: 'Description',
                selector: row => row.description,
                sortable: true,
                reorder: true,
                format: row => <span data-field='task_id'>{row.description}</span>,
            },
            {
                name: 'Status',
                selector: row => row.status,
                format: (row) => {
                    return (<div>
                        <span className={`${getStatusColor(row.status)} badge`}>
                        <SenNetPopover text={getStatusDefinition(row.status)} className={`status-info-${row.task_id}`}>
                            {row.status}
                        </SenNetPopover>
                        </span>
                            {eq(row.status, 'Error') && <a className={'mx-2'} href={'#'} onClick={() => handleViewErrorDetails(row)}><small>View details</small></a>}
                    </div>

                    )
                },
                sortable: true,
                reorder: true,
            },
            {
                name: 'Start Date',
                selector: row => row.started_timestamp,
                sortable: true,
                reorder: true,
                omit: true,
                format: row => <span data-field='start-date'>{new Date(row.started_timestamp).toLocaleDateString()}</span>,
            },
            {
                name: 'End Date',
                selector: row => row.ended_timestamp,
                sortable: true,
                reorder: true,
                omit: true,
                format: row => <span data-field='action'>{new Date(row.ended_timestamp).toLocaleDateString()}</span>,
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
    const fetchData = async () => {
        const response = await fetch('/api/socket', getHeaders())
        const data = await response.json();

        setData(data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const searchContext = () => `jobs-queue`

    if ((isAuthorizing() || isUnauthorized()) || !data) {
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
                            <h2 className="m-0 flex-grow-1 bd-highlight">Current Jobs</h2>
                        </div>
                    </Row>

                    <Row>
                    <div className='sui-layout-main-header mt-4 mb-4'>
                        <div className='sui-layout-main-header__inner'>
                            <div><Button variant={'outline-primary'} onClick={fetchData}><i className={'bi bi-arrow-clockwise mx-1'} role={'presentation'}></i>Refresh</Button></div>
                            {data.length > 0 && <ColumnsDropdown searchContext={searchContext} defaultHiddenColumns={['Start Date', 'End Date']} getTableColumns={getTableColumns} setHiddenColumns={setHiddenColumns}
                                                                 currentColumns={currentColumns} />}
                            <ResultsPerPage resultsPerPage={resultsPerPage} setResultsPerPage={setResultsPerPage} totalRows={data.length}  />
                        </div>
                    </div>
                    <DataTable columns={getTableColumns(hiddenColumns)} data={data} fixedHeader={true} pagination />
                        <AppModal showHomeButton={false} showCloseButton={true} handleClose={() => setShowModal(false)} showModal={showModal} modalTitle={modalTitle} modalBody={modalBody} />
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