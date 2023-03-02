import React, {useState, useRef} from 'react'
import {Button, Badge, Alert, Form, InputGroup, CloseButton, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {Paperclip} from "react-bootstrap-icons";
import {uploadFile} from "../../../lib/services";


export default function ImageSelector({ editMode, values, setValues}) {
    const imageInputRef = useRef()
    const [images, setImages] = useState([])
    const [error, setError] = useState(null)
    const [inputInformation, setInputInformation] = useState(null)
    
    const handleFileChange = (index, description) => {
        const image = event.target.files && event.target.files[0]
        if (!image) return
        uploadFile(image)
            .then(temp_file_id => {
                const merged = {
                    ...temp_file_id,
                    ...description
                }
                
                const imageFilesToAddCopy = [...values.image_files_to_add]
                imageFilesToAddCopy[index] = merged
                setValues(prevState => ({...prevState, image_files_to_add: imageFilesToAddCopy}))
                
                const c = [...images]
                c[index] = image
                setImages(c)
            })
            .catch(() => setError(`${image.name} (${Math.floor(image.size / 1000)} kb) has exceeded the file size limit.`))
        event.target.value = null
    }

    const handleChooseFileClick = (index, fileDetail) => {
        setInputInformation({index, fileDetail})
        imageInputRef.current.click()
    }
    
    const handleUploadImagesClick = () => {
        setImages(prevState => [...prevState, {}])
        setValues(prevState => {
            if (prevState.image_files_to_add === undefined) {
                return {...values, image_files_to_add: [{ description: "" }]}
            } else {
                const copy = [...prevState.image_files_to_add]
                copy.push({description: ''})
                return {...values, image_files_to_add: copy}
            }
        })
    }

    const removeFile = index => {
        setImages(images.filter((_, i) => i !== index))
        let imageFilesToAdd = []
        let imageFiles = []
        
        setValues(prevState => {

            if (prevState.image_files) {
                imageFiles = prevState.image_files.filter((_, i) => i !== index)

                if (prevState.image_files && prevState.image_files[index]) {
                    if (prevState.image_files_to_remove) {
                        const imageFilesToRemoveCopy = [...prevState.image_files_to_remove]
                        imageFilesToRemoveCopy.push(prevState.image_files[index].file_uuid)
                        if (imageFiles.length === 0) {
                            delete prevState.image_files
                            return {...prevState, image_files_to_remove: imageFilesToRemoveCopy}
                        } else {
                            return {...prevState, image_files_to_remove: imageFilesToRemoveCopy, image_files: imageFiles}
                        }
                    } else {
                        const fileToRemove = []
                        fileToRemove.push(prevState.image_files[index].file_uuid)
                        if (imageFiles.length === 0) {
                            delete prevState.image_files
                            return {...prevState, image_files_to_remove: fileToRemove}
                        } else {
                            return {...prevState, image_files_to_remove: fileToRemove, image_files: imageFiles}
                        }
                    }
                }
            } else if (prevState.image_files_to_add) {
                imageFilesToAdd = prevState.image_files_to_add.filter((_, i) => i !== index)
                if (imageFilesToAdd.length === 0) {
                    delete prevState.image_files_to_add
                    return prevState
                }
                return {...prevState, image_files_to_add: imageFilesToAdd}
            }

            if (imageFiles.length === 0) {
                delete prevState.image_files
                return {...prevState, image_files_to_add: imageFilesToAdd}
            }
        })
    }
    
    const handleImageDescriptionChange = (index, description, isAddingAnImage) => {
        if (isAddingAnImage) {
            const imageFilesToAddCopy = [...values.image_files_to_add]
            imageFilesToAddCopy[index].description = description
            setValues(prevState => ({
                ...prevState,
                image_files_to_add: imageFilesToAddCopy
            }))
        } else {
            const imageFilesCopy = [...values.image_files]
            imageFilesCopy[index].description = description
            setValues(prevState => ({
                ...prevState,
                image_files: imageFilesCopy
            }))
        }
    }

    return (
        <div className={'row'}>
            <div className={'col mb-2'}>
                { error && 
                    <Alert className={'w-50'} variant={'danger'} onClose={() => setError(false)} dismissible>
                        <Alert.Heading>File is too large</Alert.Heading>
                        {error}
                    </Alert>
                }
                <OverlayTrigger placement={'top'} overlay={<Tooltip>Click here to attach a single image or multiple images</Tooltip>}>
                    <Button variant={'outline-primary rounded-0'} onClick={handleUploadImagesClick}>
                        Upload Image Files
                        <Paperclip className={'ms-2'}/>
                    </Button>
                </OverlayTrigger>
            </div>
            <input
                style={{display: 'none'}}
                type={'file'}
                ref={imageInputRef}
                onChange={() => handleFileChange(inputInformation.index, inputInformation.fileDetail)}
            />
            { editMode === 'Edit' && values.image_files && values.image_files.map((i, index) => (
                <div key={'image_files' + index}>
                    <Badge bg={'primary'} className={'badge rounded-pill text-bg-primary m-2 p-2'}>
                        <span className={'m-2'}>
                            {i.filename}
                        </span>
                    </Badge>
                    <InputGroup className="m-2 w-75">
                        <Button variant="outline-secondary" onClick={() => handleChooseFileClick(index, i)}>
                            Choose file
                        </Button>
                        <Form.Control
                            placeholder={'Description'}
                            onChange={e => handleImageDescriptionChange(index, e.target.value, false)}
                            value={i.description}
                            className={'me-2'}
                        />
                        <OverlayTrigger overlay={<Tooltip>Remove image</Tooltip>}>
                            <CloseButton className={'mt-2'} onClick={() => removeFile(index)}/>
                        </OverlayTrigger>
                    </InputGroup>
                </div>
            ))
            }
            { values && values.image_files_to_add && values.image_files_to_add.map((image_file_to_add, index) => {
                return <div key={'image_files_to_add' + index}>
                    <Badge bg={'primary'} className={'badge rounded-pill text-bg-primary m-2 p-2'}>
                        { images[index] && images[index].name &&
                            <span className={'m-2'}>
                                {images[index].name}
                            </span>
                        }
                    </Badge>
                    <InputGroup className="m-2 w-75">
                        <Button variant="outline-secondary" onClick={() => handleChooseFileClick(index, image_file_to_add)}>
                            Choose file
                        </Button>
                        <Form.Control
                            placeholder={'Description'}
                            onChange={e => handleImageDescriptionChange(index, e.target.value, true)}
                            value={image_file_to_add.description}
                            className={'me-2'}
                        />
                        <OverlayTrigger overlay={<Tooltip>Remove image</Tooltip>}>
                            <CloseButton className={'mt-2'} onClick={() => removeFile(index)}/>
                        </OverlayTrigger>
                    </InputGroup>
                </div>
            })
            }
        </div>
    )
}

