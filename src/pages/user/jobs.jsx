import React, {useContext, useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import Spinner from "../../components/custom/Spinner";
import Unauthorized from "../../components/custom/layout/Unauthorized";
import Header from "../../components/custom/layout/Header";
import AppNavbar from "../../components/custom/layout/AppNavbar";
import AppContext from "../../context/AppContext";
import Alert from 'react-bootstrap/Alert';
import {
    eq,
    getHeaders,
    getJobStatusDefinition,
    getStatusColor,
} from "../../components/custom/js/functions";
import SenNetPopover from "../../components/SenNetPopover";
import DataTable from "react-data-table-component";
import ColumnsDropdown from "../../components/custom/search/ColumnsDropdown";
import { Col, Container, Row, Button, Form, InputGroup } from "react-bootstrap";
import {getIngestEndPoint, RESULTS_PER_PAGE} from "../../config/config";
import {ResultsPerPage} from "../../components/custom/search/ResultsPerPage";
import AppModal from "../../components/AppModal";
import {tableColumns} from "../../components/custom/edit/AttributesUpload";
import Swal from 'sweetalert2'
import useDataTableSearch from "../../hooks/useDataTableSearch";
import {callService, get_headers} from "../../lib/services";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

function ViewJobs({children}) {


    const [data, setData] = useState([])
    const {router, isRegisterHidden, isUnauthorized, isAuthorizing, _t, cache} = useContext(AppContext)
    const [errorModal, setErrorModal] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const currentColumns = useRef([])
    const [hiddenColumns, setHiddenColumns] = useState(null)
    const [resultsPerPage, setResultsPerPage] = useState(RESULTS_PER_PAGE[1])
    const [showModal, setShowModal] = useState(false)
    const [modalBody, setModalBody] = useState(null)
    const [modalTitle, setModalTitle] = useState(null)
    let intervalTimer

    const onKeydown = (e) => {
        if (eq(e.key, 'enter')) {
            const params = new URLSearchParams(window.location.search)
            params.set('q', e.target.value);
            const query = params.toString()
            window.history.pushState(null, null, `?${query}`)
        }
    }

    const {filteredItems, setFilterText, searchBarComponent} = useDataTableSearch(
        {data, fieldsToSearch: ['job_id', 'description', 'status'], className: 'has-extraPadding', onKeydown})

    const successIcon = () => <TaskAltIcon color={'success'} />

    const errIcon = () => <WarningAmberIcon sx={{color: '#842029'}} />

    const getAction = (row) => {
        const status = row.status
        let actions = []
        const isValidate = row.description?.toLowerCase().includes('validation')
        if (eq(status, 'Complete')) {
            if (!row.errors?.length && isValidate) {
                actions.push('Register')
            }
            actions.push('Delete')
        } else if (eq(status, 'Error') && row.errors && isValidate) {
            actions.push('Resubmit')
            actions.push('Delete')
        } else if (eq(status, 'Started')) {
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

    const handleDelete = (e, row, action) => {
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
                handleResponseModal(e, row, getIngestEndPoint() + `/jobs/${row.job_id}`, 'DELETE', action, 'deleted')
                // Delete
            }
        }).catch(error => {
            // when promise rejected...
        });
    }

    const updateTableData = async (row, res, action) => {
        let job = await res.json()
        if (eq(action, 'delete')) {
            let _data = data.filter((item) => item.job_id !== row.job_id)
            setData(_data)
        }

        if (eq(action, 'register')) {
            fetch(`/api/jobs/${job.job_id}`).then(async (res)=>{
                let jobInfo = await res.json()
                setData([...data, jobInfo])
            }).catch((err)=>{

            })
        }

        if (eq(action, 'cancel')) {
            data.forEach((item) => {
                if (item.job_id === row.job_id) {
                    item.status = 'Canceled'
                }
            })
            setData([...data])
        }
    }

    const handleResponseModal = (e, row, url, method, action, verb, body = {}) => {
        fetch(url, {
            method: method,
            headers: get_headers(),
            body: JSON.stringify(body)
        }).then((res) =>{
            setErrorModal(false)
            setShowModal(true)
            setModalTitle(<h3>{successIcon()} Job {verb}</h3>)
            setModalBody(<div>The job has been {verb}.</div>)

            updateTableData(row, res, action)

        }).catch((err)=>{
            e.target.disabled = false
            setErrorModal(true)
            setShowModal(true)
            setModalTitle(<h3>{errIcon()} Job failed to be {verb}</h3>)

            setModalBody(
                <div>The job could not be {verb}. REASON:
                    <div>
                        <code>{err.message}</code>
                    </div>
            </div> )
        })
    }

    const handleAction = (e, action, row) => {

        if (eq(action, 'Delete')) {
            handleDelete(e, row, action)
        } else if (eq(action, 'Register')) {
            e.target.disabled = true
            const pathName = row.referrer?.path.includes('action=metadata') ? `metadata/register` : `entities/register`
            handleResponseModal(e, row, getIngestEndPoint() + pathName, 'POST', action, 'registered',
                {job_id: row.job_id, referrer: {type: 'register', path: row.referrer?.path + `&job_id=${row.job_id}`
                }})
        } else if (eq(action, 'Cancel')) {
            e.target.disabled = true
            handleResponseModal(e, row, getIngestEndPoint() + `/jobs/${row.job_id}/cancel`, 'PUT', action, 'cancelled')
        } else {
           window.location = row.referrer?.path
        }
    }

    const getActionUI = (row) => {
        const actions = getAction(row)
        let ui = [];
        for (let action of actions) {
            ui.push(<Button key={action} variant={getVariant(action)} className={'mx-1'} size="sm" onClick={(e) => handleAction(e, action, row)}>{action}</Button>)
        }

        return ui
    }

    const flatten = (array) => {
        if (!Array.isArray(array)) {
            if (!array.error) {
                return [{error: array.message  || array}]
            } else {
                return [array]
            }
        }
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
        setErrorModal(false)
        let errors = flatten(row.errors)
        setShowModal(true)
        setModalTitle(<h3>Task Error Details</h3>)
        setModalBody(<div className={'table-responsive has-error'}><DataTable columns={columns} data={errors} pagination /></div> )
    }

    const getJobType = (row) => {
        let type = row.referrer.type
        type = eq(type, 'validate') ? 'validation' : 'registration'
        return row.referrer?.path?.includes('action=metadata') ? `Metadata ${type}` : `Entity ${type}`
    }

    const getTableColumns = (hiddenColumns) => {
        let cols = [
            {
                name: 'Job ID',
                selector: row => row.job_id,
                sortable: true,
                reorder: true,
                format: row => <span data-field='job_id'>{row.job_id}</span>,
            },
            {
                name: 'Description',
                selector: row => row.description,
                sortable: true,
                reorder: true,
                format: row => <span data-field='job_id' title={row.description}>{row.description}</span>,
            },
            {
                name: 'Status',
                selector: row => row.status,
                format: (row) => {
                    return (<div>
                        <span className={`${getStatusColor(row.status)} badge`}>
                        <SenNetPopover text={getJobStatusDefinition(row.status)} className={`status-info-${row.job_id}`}>
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
                name: 'Type',
                selector: row => getJobType(row),
                sortable: true,
                reorder: true,
                omit: true,
                format: row => <span data-field='type'>{getJobType(row)}</span>,
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
        const response = await fetch('/api/jobs', getHeaders())
        const _data = await response.json();
        setData(_data)
    }

    useEffect(() => {
        clearInterval(intervalTimer)
        intervalTimer = setInterval(()=>{
            fetchData()
        }, 1000)

        const q = router.query.q
        if (q) {
            setFilterText(q)
        }

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

                    <DataTable
                        columns={getTableColumns(hiddenColumns)}
                        data={filteredItems}
                        fixedHeader={true}
                        subHeader
                        subHeaderComponent={
                        <>
                        {searchBarComponent}
                            <div className='sui-layout-main-header mt-4 mb-4'>
                                <div className='sui-layout-main-header__inner'>
                                    <div><Button variant={'outline-primary'} onClick={fetchData}><i className={'bi bi-arrow-clockwise mx-1'} role={'presentation'}></i>Refresh</Button></div>
                                    {data.length > 0 && <ColumnsDropdown searchContext={searchContext} defaultHiddenColumns={['Start Date', 'End Date']} getTableColumns={getTableColumns} setHiddenColumns={setHiddenColumns}
                                                                         currentColumns={currentColumns} />}
                                    <ResultsPerPage resultsPerPage={resultsPerPage} setResultsPerPage={setResultsPerPage} totalRows={data.length}  />
                                </div>
                            </div>
                        </>
                        }
                        pagination />
                        <AppModal className={`modal--ctaConfirm ${errorModal ? 'is-error' : ''}`} showHomeButton={false} showCloseButton={true} handleClose={() => setShowModal(false)} showModal={showModal} modalTitle={modalTitle} modalBody={modalBody} />
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