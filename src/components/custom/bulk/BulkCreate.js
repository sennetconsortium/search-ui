import React, {useEffect, useRef, useState} from 'react';
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
import {getAuth} from "../../../config/config";
import Spinner from "../Spinner";
import AppFooter from "../layout/AppFooter";
import GroupsIcon from '@mui/icons-material/Groups';
import GroupSelect from "../edit/GroupSelect";
import AppModal from "../../AppModal";


export default function BulkCreate({
                                       entityType,
                                       exampleFileName,
                                       bulkUploadUrl,
                                       bulkUrl,
                                       userWriteGroups,
                                       handleHome,
                                   }) {
    const buttonVariant = "btn btn-outline-primary rounded-0"
    const inputFileRef = useRef(null)
    const [activeStep, setActiveStep] = useState(0)
    const [file, setFile] = useState(null)
    const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true)
    const [tempId, setTempId] = useState(null)
    const [error, setError] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [validationSuccess, setValidationSuccess] = useState(null)
    const [bulkSuccess, setBulkSuccess] = useState(null)
    const [bulkResponse, setBulkResponse] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [steps, setSteps] = useState(['Attach Your File', 'Review Validation', 'Complete'])
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [showModal, setShowModal] = useState(true)

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
        if (userWriteGroups && getUserWriteGroupsLength() > 1) {
            icons = {
                1: <AttachFileIcon/>,
                2: <VerifiedIcon/>,
                3: <GroupsIcon/>,
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
        if (userWriteGroups && getUserWriteGroupsLength() > 1) {
            setSteps(['Attach Your File', 'Review Validation', 'Select group', 'Complete'])
        }
        if (userWriteGroups && getUserWriteGroupsLength() === 1) {
            setSelectedGroup(userWriteGroups[0].uuid)
        }
    }, [userWriteGroups])

    async function postBulkUploads() {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('file', file)
        const requestOptions = {
            method: 'POST',
            headers: {'Authorization': 'Bearer ' + getAuth()},
            body: formData
        }
        const response = await fetch(bulkUploadUrl, requestOptions)
        const data = await response.json()
        if (!response.ok) {
            setError({1: true})
            setErrorMessage(data)
        } else {
            setTempId(data.temp_id)
            setValidationSuccess(true)
            setIsNextButtonDisabled(false)
        }
        setIsLoading(false)
    }

    async function postBulk() {
        setIsLoading(true)
        const body = {temp_id: tempId, group_uuid: selectedGroup}
        const requestOptions = {
            method: 'POST',
            headers: {'Authorization': 'Bearer ' + getAuth(), 'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        }
        const response = await fetch(bulkUrl, requestOptions)
        const data = await response.json()
        if (!response.ok) {
            setError(getStepsLength() === 3 ? {2: true} : {3: true})
            setIsNextButtonDisabled(true)
            setErrorMessage(data)
        } else {
            setBulkSuccess(true)
            setBulkResponse(data)
            setIsNextButtonDisabled(false)
        }
        setIsLoading(false)
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

    const handleNext = () => {
        setIsNextButtonDisabled(true)
        if (getStepsLength() === 3) {
            if (activeStep === 0) {
                postBulkUploads()
            } else if (activeStep === 1) {
                postBulk()
            } else if (activeStep === 2) {
                handleReset()
                return
            }
        } else {
            if (activeStep === 0) {
                postBulkUploads()
            } else if (activeStep === 2) {
                postBulk()
            } else if (activeStep === 3) {
                handleReset()
                return
            }
        }
        setActiveStep(prevState => prevState + 1)
    }

    const handleBack = () => {
        setIsNextButtonDisabled(true)
        setError(null)
        setErrorMessage(null)
        setFile(null)
        setSelectedGroup(null)
        if (activeStep !== 0) {
            setActiveStep(prevState => prevState - 1)
        }
    }

    const handleReset = () => {
        setActiveStep(0)
        setTempId(null)
        setError(null)
        setFile(null)
        setErrorMessage(null)
        setValidationSuccess(null)
        setBulkSuccess(null)
        setIsNextButtonDisabled(true)
        setSelectedGroup(null)
        setShowModal(true)
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

    function getModalBody() {
        let body = `Your ${entityType} were created:\n`
        if (entityType.toLowerCase() === 'sources') {
            body += `Source types: \n${Array.from(new Set(Object.values(bulkResponse.data).map(each =>
                each.source_type.charAt(0).toUpperCase() + each.source_type.slice(1) + '\n'
            )))}`
        } else if (entityType.toLowerCase() === 'samples') {
            body += `Sample categories: \n${Array.from(new Set(Object.values(bulkResponse.data).map(each => {
                    let organ_type = null
                    if (each.sample_category === 'organ') {
                        organ_type = each.organ
                    }
                    let result = each.sample_category.charAt(0).toUpperCase() + each.sample_category.slice(1)
                    if (organ_type !== null) {
                        result += ` (${organ_type})` + '\n'
                    } else {
                        result += '\n'
                    }
                    return result
                }
            )))}`
        } else if (entityType.toLowerCase() === 'datasets') {
            body += `Data types: \n${Array.from(new Set(Object.values(bulkResponse.data).map(each =>
                each.data_types[0].charAt(0).toUpperCase() + each.data_types[0].slice(1) + '\n'
            )))}`
        }
        body += 'Group Name: ' + bulkResponse.data[1].group_name + '\n' + 'SenNet IDs: \n' + Object.values(bulkResponse.data).map(each => each.sennet_id + '\n')
        return body.replace(/,/g, '')
    }

    return (
        <div>
            <Container sx={{mt: 5}}>
                <Box sx={{
                    backgroundColor: 'white',
                    padding: 5,
                    boxShadow: 3,
                }}>
                    <a
                        download
                        className={buttonVariant}
                        href={`/${exampleFileName}`}
                    >
                        <FileDownloadIcon/> {' '} EXAMPLE.TSV
                    </a>
                    <h1 className={'text-center'}>Upload {entityType}</h1>
                    <div className={'p-4 text-center'}>To register multiple items at one time, upload a tsv file in the
                        format specified by the example file.
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
                    {
                        errorMessage && Object.entries(errorMessage.data)
                            .map((value, key) => (
                                <Alert severity="error" className={'m-2'} key={key}>
                                    {value[1]}
                                </Alert>
                            ))
                    }
                    {activeStep === 1 && !errorMessage && validationSuccess &&
                        <Alert severity="success" sx={{m: 2}}>
                            Validation successful please continue onto the next step
                        </Alert>}
                    {
                        (activeStep === 2 && getStepsLength() === 3 || activeStep === 3 && getStepsLength() === 4) && !errorMessage && bulkSuccess &&
                        <AppModal
                            modalTitle={entityType + ' created'}
                            modalBody={getModalBody()}
                            showModal={showModal}
                            handleHome={handleHome}
                            handleClose={() => setShowModal(false)}
                            showCloseButton={true}
                        />
                    }
                    {
                        activeStep === 2 && userWriteGroups && getUserWriteGroupsLength() > 1 &&
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
                                disabled={activeStep === 0 || activeStep === getStepsLength() - 1}
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
            <AppFooter
                isFixedBottom={!error}
            />
        </div>
    );
}
