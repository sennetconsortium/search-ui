import React, {useState, useRef} from 'react'
import {Button, Badge, Alert, Form, InputGroup, CloseButton, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {Paperclip} from "react-bootstrap-icons";
import {uploadFile} from "../../../lib/services";


export default function ImageSelector({ imageFilesToAdd, setImageFilesToAdd}) {
    const imageInputRef = useRef()
    const [images, setImages] = useState([])
    const [error, setError] = useState(null)
    const [inputInformation, setInputInformation] = useState(null)
    
    const handleFileChange = (index, description) => {
        const image = event.target.files && event.target.files[0]
        if (!image) return
        uploadFile(image)
            .then(r => {
                const merged = {
                    ...r,
                    ...description
                }
                const imageFilesToAddCopy = [...imageFilesToAdd]
                imageFilesToAddCopy[index] = merged
                setImageFilesToAdd(imageFilesToAddCopy)
                
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
        setImageFilesToAdd(prevState => [...prevState, { description: "" }])
    }

    const removeFile = index => {
        setImages(images.filter((_, i) => i !== index))
        setImageFilesToAdd(imageFilesToAdd.filter((_, i) => i !== index))
    }
    
    const handleImageDescriptionChange = (index, description) => {
        const imageFilesToAddCopy = [...imageFilesToAdd]
        imageFilesToAddCopy[index].description = description
        setImageFilesToAdd(imageFilesToAddCopy)
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
                { imageFilesToAdd && imageFilesToAdd.map((fileDetail, index) => {
                    return <div key={'input' + index}>
                        <Badge bg={'primary'} className={'badge rounded-pill text-bg-primary m-2 p-2'}>
                            { images[index] && images[index].name &&
                                <span className={'m-2'}>
                                    {images[index].name}
                                </span>
                            }
                        </Badge>
                        <InputGroup className="m-2 w-75">
                            <Button variant="outline-secondary" onClick={() => handleChooseFileClick(index, fileDetail)}>
                                Choose file
                            </Button>
                            <Form.Control
                                placeholder={'Description'}
                                onChange={e => handleImageDescriptionChange(index, e.target.value)}
                                value={fileDetail.description}
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

