import React, {useEffect, useRef, useState, useContext} from 'react';
import {styled} from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import VerifiedIcon from '@mui/icons-material/Verified';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import StepConnector, {stepConnectorClasses} from '@mui/material/StepConnector';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Button} from "react-bootstrap";
import {Alert, Container, Grid} from "@mui/material";
import {getDocsRootURL, getIngestEndPoint} from "../../../config/config";
import Spinner, {SpinnerEl} from "../Spinner";
import GroupsIcon from '@mui/icons-material/Groups';
import GroupSelect from "../edit/GroupSelect";
import AppModal from "../../AppModal";
import {eq, getHeaders, getStatusColor} from "../js/functions";
import AppContext from "../../../context/AppContext";
import {get_headers, get_auth_header} from "../../../lib/services";
import JobQueueContext from "../../../context/JobQueueContext";

export default function BulkCreate({
                                       entityType,
                                       subType,
                                       userWriteGroups,
                                       handleHome,
                                       isMetadata=false,
                                   }) {
    const buttonVariant = "btn btn-outline-primary rounded-0"
    const inputFileRef = useRef(null)
    const [activeStep, setActiveStep] = useState(0)
    const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true)
    const [error, setError] = useState(null)
    const [isInSocket, setIsInSocket] = useState(false)
    const [validationSuccess, setValidationSuccess] = useState(null)
    const stepLabels = ['Attach Your File', 'Review Validation', 'Complete']
    const [steps, setSteps] = useState(stepLabels)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [showModal, setShowModal] = useState(true)
    const {cache} = useContext(AppContext)
    const [jobData, setJobData] = useState(null)
    const { intervalTimer,
        isLoading, setIsLoading, bulkData, setBulkData,
        file, setFile,
        fetchEntities,
        jobHasFailed,
        setIsMetadata,
        getVerb,
        getEntityModalBody,
        getMetadataModalBody} = useContext(JobQueueContext)

    const ColorlibConnector = styled(StepConnector)(({theme}) => ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 22,
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage:
                    'linear-gradient(128deg, rgba(0,212,255,1) 0%, rgba(154,102,167,1) 60%, rgba(154,102,167,1) 100%)',
            },
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage:
                    'linear-gradient(128deg, rgba(0,212,255,1) 0%, rgba(154,102,167,1) 60%, rgba(154,102,167,1) 100%)',
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            height: 3,
            border: 0,
            backgroundColor:
                theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
            borderRadius: 1,
        },
    }))

    const ColorlibStepIconRoot = styled('div')(({theme, ownerState}) => ({
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        ...(ownerState.active && {
            backgroundImage:
                'linear-gradient(128deg, rgba(0,212,255,1) 0%, rgba(154,102,167,1) 60%, rgba(154,102,167,1) 100%)',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        }),
        ...(ownerState.completed && {
            backgroundImage:
                'linear-gradient(128deg, rgba(0,212,255,1) 0%, rgba(154,102,167,1) 60%, rgba(154,102,167,1) 100%)',
        }),
    }))

    function ColorlibStepIcon(props) {
        const {active, completed, className} = props;
        let icons
        if (userWriteGroups && getUserWriteGroupsLength() > 1 && !isMetadata) {
            icons = {
                1: <AttachFileIcon/>,
                2: <GroupsIcon/>,
                3: <VerifiedIcon/>,
                4: <DoneOutlineIcon/>,
            }
        } else {
            icons = {
                1: <AttachFileIcon/>,
                2: <VerifiedIcon/>,
                3: <DoneOutlineIcon/>,
            }
        }

        return (
            <ColorlibStepIconRoot ownerState={{completed, active}} className={className}>
                {icons[String(props.icon)]}
            </ColorlibStepIconRoot>
        );
    }

    useEffect(() => {
        setIsMetadata(isMetadata)
        if (userWriteGroups && getUserWriteGroupsLength() > 1) {
            if (isMetadata) {
                setSteps(stepLabels)
            } else {
                let extraSteps = Array.from(stepLabels)
                extraSteps.splice(1, 0, 'Select group')
                setSteps(extraSteps)
            }
        }
        if (userWriteGroups && getUserWriteGroupsLength() === 1) {
            setSelectedGroup(userWriteGroups[0].uuid)
        }
    }, [userWriteGroups])

    const clearSocket = () => {
        clearInterval(intervalTimer.current)
        setIsInSocket(false)
    }

    const getEntityValidationUrl = () => {
        return `${getIngestEndPoint()}${entityType}s/bulk/validate`
    }

    const getEntityRegistrationUrl = () => {
        return `${getIngestEndPoint()}${entityType}s/bulk/register`
    }

    const getMetadataValidationUrl = () => {
        return `${getIngestEndPoint()}metadata/validate`
    }

    const getMetadataRegistrationUrl = () => {
        return `${getIngestEndPoint()}metadata/register`
    }

    const hasAlreadyRegistered = (data) => {
        if (!data) return false
        return data.register_job_id !== undefined && data.register_job_id !== null
    }

    const checkIfHasRegistered = (data) => {
        setValidationSuccess(true)
        if (hasAlreadyRegistered(data)) {
            setIsNextButtonDisabled(true)
        }
    }

    const updateValidationSuccess = (data) => {
        setValidationSuccess(true)
        mimicSocket(data, {cbAll: checkIfHasRegistered})
    }

    const mimicSocket = (data, {cb, cbFail, cbAll}) => {
        clearSocket()
        setJobData(data)
        setIsInSocket(true)
        setValidationSuccess(null)

        //TODO: stop use of setInterval; extract code within interval callback when actual server side socket is implemented
        intervalTimer.current = setInterval(async () => {
            let res = await fetch(getIngestEndPoint() + `jobs/${data.job_id}`, {method: 'GET', headers: getHeaders()})
            let job = await res.json()
            setJobData(job)
            if (eq(job.status, 'Complete')) {
                setIsLoading(false)
                if (cb) {
                    cb(job)
                }
                setIsNextButtonDisabled(false)
            }
            if (jobHasFailed(job)) {
                clearInterval(intervalTimer.current)
                if (cbFail) {
                    cbFail(job)
                }
                setIsLoading(false)
            }
            if (cbAll) {
                cbAll(job)
            }
        }, 1000)
    }

    async function metadataCommitComplete(data) {
        const {fails, passes} = await fetchEntities(data, {entityType})
        setBulkData({fails, passes})
    }

    function getValidateReferrer() {
        return {
            type: 'validate',
            path: window.location.pathname + window.location.search
        }
    }

    function getRegisterReferrer() {
        return {
            type: 'register',
            path: jobData.referrer.path + `&job_id=${jobData.job_id}`
        }
    }

    async function metadataValidation() {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('metadata', file)
        formData.append('entity_type', cache.entities[entityType])
        formData.append('sub_type', subType)
        formData.append('validate_uuids', '1')
        formData.append('referrer', JSON.stringify(getValidateReferrer()))
        const requestOptions = {
            method: 'POST',
            headers: get_auth_header(),
            body: formData
        }
        const response = await fetch(getMetadataValidationUrl(), requestOptions)
        const data = await response.json()
        mimicSocket(data, {cb: updateValidationSuccess})
    }

    async function metadataRegister() {
        clearSocket()
        setIsLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: get_headers(),
            body: JSON.stringify({
                job_id: jobData.job_id,
                referrer: getRegisterReferrer()
            })
        }
        let response = await fetch(getMetadataRegistrationUrl(), requestOptions)
        const data = await response.json()
        mimicSocket(data, {cb: metadataCommitComplete})
        setIsLoading(false)
    }

    async function entityRegistrationComplete(data) {
        const {fails, passes} = await fetchEntities(data, {entityType})
        setBulkData({fails, passes})
    }

    function entityRegistrationFail(data) {
        setError(getStepsLength() === 4 ? {3: true} : {2: true})
        setIsNextButtonDisabled(true)
    }

    // This makes a request to ingest-api, validating the upload
    async function entityValidation() {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('referrer', JSON.stringify(getValidateReferrer()))
        formData.append('group_uuid', selectedGroup)
        const requestOptions = {
            method: 'POST',
            headers: get_auth_header(),
            body: formData
        }
        const response = await fetch(getEntityValidationUrl(), requestOptions)
        const data = await response.json()
        mimicSocket(data, {cb: updateValidationSuccess})
    }

    async function entityRegistration() {
        clearSocket()
        setIsLoading(true)
        const body = {job_id: jobData.job_id, referrer: getRegisterReferrer()}
        const requestOptions = {
            method: 'POST',
            headers: get_headers(),
            body: JSON.stringify(body)
        }
        const response = await fetch(getEntityRegistrationUrl(), requestOptions)
        const data = await response.json()
        mimicSocket(data, {cb: entityRegistrationComplete, cbFail: entityRegistrationFail})
    }

    function getUserWriteGroupsLength() {
        return userWriteGroups.length
    }

    function getStepsLength() {
        return steps.length
    }

    const onChange = (e, fieldId, value) => {
        setSelectedGroup(value)
        setIsNextButtonDisabled(false)
    }

    const onEntityNext = () => {
        setIsNextButtonDisabled(true)

        if (getStepsLength() === 4) {
            if (activeStep === 1) {
                entityValidation()
            } else if (activeStep === 2) {
                if (!hasAlreadyRegistered(jobData)) {
                    entityRegistration()
                }
            } else if (activeStep === 3) {
                handleReset()
                return
            }
        } else {
            if (activeStep === 0) {
                entityValidation()
            } else if (activeStep === 1) {
                if (!hasAlreadyRegistered(jobData)) {
                    entityRegistration()
                }
            } else if (activeStep === 2) {
                handleReset()
                return
            }
        }
        setActiveStep(prevState => prevState + 1)
    }

    const onMetadataNext = () => {
        setIsNextButtonDisabled(true)
        if (getStepsLength() === 3) {
            if (activeStep === 0) {
                metadataValidation()
            }
            else if (activeStep === 1) {
                if (!hasAlreadyRegistered(jobData)) {
                    metadataRegister()
                }
            }
            else if (activeStep === 2) {
                handleReset()
                return
            }
        }
        setActiveStep(prevState => prevState + 1)
    }

    const handleNext = () => {
        if (isMetadata) {
            onMetadataNext()
        } else {
            onEntityNext()
        }
    }

    const handleBack = () => {
        clearSocket()
        setJobData(null)
        setIsNextButtonDisabled(true)
        setError(null)
        setFile(null)
        setSelectedGroup(null)
        if (activeStep !== 0) {
            setActiveStep(prevState => prevState - 1)
        }
    }

    const handleReset = () => {
        clearSocket()
        setActiveStep(0)
        setError(null)
        setFile(null)
        setValidationSuccess(null)
        setBulkData(null)
        setIsNextButtonDisabled(true)
        setSelectedGroup(null)
        setShowModal(true)
        setJobData(null)
    }

    function handleFileChange(event) {
        const fileObj = event.target.files && event.target.files[0]
        if (!fileObj) {
            return
        }
        setFile(fileObj)
        event.target.value = null
        setIsNextButtonDisabled(false)
    }

    function handleBrowseFilesClick() {
        inputFileRef.current.click()
    }

    function isStepFailed(index) {
        return error !== null && error[index] !== null && error[index] === true
    }

    function getModalTitle() {
        const inner = isMetadata ? "' Metadata" : ""
        return `${cache.entities[entityType]}s${inner} ${getVerb(true, true)}`
    }

    function getModalBody() {
        return isMetadata ? getMetadataModalBody(null, {entityType}) : getEntityModalBody(null, {entityType})
    }

    const isAtLastStep = () => {
        return (activeStep === 2 && getStepsLength() === 3 || activeStep === 3 && getStepsLength() === 4)
    }

    const isMouse = () => eq(subType, cache.sourceTypes.Mouse)

    const getTitle = () => {
        const entity = cache.entities[entityType]
        let title = `${getVerb()} ${entity}s`
        if (isMetadata) {
            const subTypeText = isMouse() ? "Murines'" : `${subType}s'`
            title = `${getVerb()} ${entity} ${subTypeText} Metadata`
        }
        return title
    }

    const getFilename = (variant = '') => {
        let filename = `example${variant}_${entityType}`
        return isMetadata ? `metadata/${filename}_${subType}_metadata` : `entities/${filename}`
    }

    const isCedarSupported = () => {
        return isMetadata && !subType.includes([cache.sourceTypes.Mouse])
    }

    const getDocsUrl = () => {
        const url = new URL(getDocsRootURL());
        url.pathname = isMetadata ? 'libraries/ingest-validation-tools/schemas' : 'registration/bulk-registration'
        const _subType = isMouse() ? 'murine' : subType
        url.pathname += isMetadata ? `/` : `/${entityType}`
        return url.href
    }

    const getDocsText  = () => {
        const type = isMetadata ? subType : cache.entities[entityType]
        const action = isMetadata ? 'Upload' : 'Registration'
        const docsUrl = getDocsUrl()

        return <>
            See the <a className='link' href={docsUrl}>{type} Bulk {action}</a> page for further details.
        </>
    }

    const isValidationStep = () => {
        return (isMetadata && activeStep === 1) || (getStepsLength() === 4 ? activeStep === 2 : activeStep === 1)
    }

    const jobDashboardUrl = (id) => `/user/jobs?q=${id}`

    const getSocketStatusDetails = () => {
        const hasFailed = jobHasFailed(jobData)
        return (<div>
            <div>Request {jobData.referrer && <span>to <code>{jobData.referrer?.type}</code> {isMetadata ? 'metadata' : 'entities'}</span>} sent to job queue with a current status of &nbsp;
                <span style={{position: 'relative'}}>
                    <span className={`${getStatusColor(jobData.status)} badge`}>{jobData.status}</span>
                    {eq(jobData.status, 'started') && <span style={{ position: 'absolute', right: '-18px', marginTop: '5px'}}><SpinnerEl /></span>}
                </span>
            </div>

            {!hasFailed && <div>You may remain on this page until the job has a <span className={`${getStatusColor('complete')} badge`}>Complete</span> status.</div>}
            <div>You {!hasFailed ? 'can also' : 'must'} further handle this job (and other jobs) by viewing the <a href={jobDashboardUrl(jobData?.job_id)}>Job Dashboard</a> page.</div>
        </div>)
    }

    return (
        <div className='main-wrapper' data-js-ada='modal'>
            <Container sx={{mt: 5}}>
                <Box sx={{
                    backgroundColor: 'white',
                    padding: 5,
                    boxShadow: 3,
                }}>
                    <div>
                        <a
                            download
                            className={buttonVariant}
                            href={isCedarSupported() ? `https://raw.githubusercontent.com/hubmapconsortium/dataset-metadata-spreadsheet/main/${entityType}-${subType.toLowerCase()}/latest/${entityType}-${subType.toLowerCase()}.tsv` : `/bulk/${getFilename().toLowerCase()}.tsv`}
                        >
                            <FileDownloadIcon/> {' '} <span>EXAMPLE.TSV {isCedarSupported() && <span>(CEDAR)</span>}</span>
                        </a>

                    </div>
                    <h1 className={'text-center'}>{getTitle()}</h1>

                    <div className={'p-4 text-center'}>
                        To register multiple items at one time, upload a <code>TSV</code> file in the format specified by the example file.<br/>
                        {getDocsText()}
                    </div>
                    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector/>}>
                        {
                            steps.map((label, index) => {
                                const labelProps = {}
                                if (isStepFailed(index)) {
                                    labelProps.optional = (
                                        <Typography variant="caption" color="error">
                                            Failed
                                        </Typography>
                                    )
                                    labelProps.error = true
                                }
                                return (<Step key={label}>
                                    <StepLabel StepIconComponent={ColorlibStepIcon} {...labelProps}>{label}</StepLabel>
                                </Step>)
                            })
                        }
                    </Stepper>
                    {isLoading && <Spinner/>}

                    {isValidationStep() && validationSuccess && !hasAlreadyRegistered(jobData) &&
                        <Alert severity="success" sx={{m: 2}}>
                         <div>Validation successful please continue onto the next step</div>
                        </Alert>}

                    {jobData && hasAlreadyRegistered(jobData) &&
                        <Alert severity="warning" sx={{m: 2}}>
                            <div>The validation job has already been registered. The job is available at the <a href={jobDashboardUrl(jobData?.register_job_id)}>Job Dashboard</a></div>
                        </Alert>}

                    {isInSocket && jobData && !validationSuccess && !hasAlreadyRegistered(jobData) &&
                        <Alert severity="info" sx={{m: 2}}>
                            {getSocketStatusDetails()}
                        </Alert> }

                    {
                        isAtLastStep() && bulkData &&
                        <AppModal
                            modalTitle={getModalTitle()}
                            modalBody={getModalBody()}
                            modalSize='lg'
                            showModal={showModal}
                            handleHome={handleHome}
                            handleClose={() => setShowModal(false)}
                            showCloseButton={true}
                        />
                    }
                    {
                        !isMetadata && activeStep === 1 && userWriteGroups && getUserWriteGroupsLength() > 1 &&
                        <Grid container className={'text-center mt-5'}>
                            <Grid item xs></Grid>
                            <Grid item xs>
                                <GroupSelect
                                    groups={userWriteGroups}
                                    onGroupSelectChange={onChange}
                                    entity_type={entityType}
                                    plural={true}
                                />
                            </Grid>
                            <Grid item xs></Grid>
                        </Grid>
                    }
                    <Grid container spacing={3} className={'text-center mt-3'}>
                        <Grid item xs>
                            <Button
                                variant={'outline-dark rounded-0'}
                                disabled={activeStep === 0 || activeStep === getStepsLength() - 1 || isValidationStep()}
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                        </Grid>
                        <Grid item xs>
                            {
                                activeStep === 0 &&
                                <>
                                    <input
                                        style={{display: 'none'}}
                                        type={'file'}
                                        accept={".tsv"}
                                        ref={inputFileRef}
                                        onChange={handleFileChange}
                                    />
                                    <Button variant={'outline-success rounded-0'}
                                            onClick={handleBrowseFilesClick}>
                                        Browse files
                                    </Button>{' '}
                                    {file && file.name}
                                </>
                            }
                        </Grid>
                        <Grid item xs>
                            <Button
                                variant={buttonVariant}
                                onClick={handleNext}
                                disabled={isNextButtonDisabled}
                            >
                                {activeStep === getStepsLength() - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </div>
    );
}
