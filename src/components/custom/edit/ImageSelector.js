import React, {useState, useRef} from 'react'
import {Button, Badge, Alert} from 'react-bootstrap';
import {XCircle} from "react-bootstrap-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {uploadFile} from "../../../lib/services";



export default function ImageSelector({ imageFilesToAdd, setImageFilesToAdd}) {
    const imageInputRef = useRef()
    const [images, setImages] = useState([])
    const [error, setError] = useState(null)
    
    const handleFileChange = () => {
        const image = event.target.files && event.target.files[0]
        if (!image) return
        uploadFile(image)
            .then(r => {
                setImageFilesToAdd(prevState => [...prevState, r])
                setImages(prevState => [...prevState, image])
            })
            .catch(() => setError(`${image.name} (${Math.floor(image.size / 1000)} kb) has exceeded the file size limit.`))
        event.target.value = null
    }

    const handleBrowseFilesClick = () => imageInputRef.current.click()

    const removeImage = index => {
        setImages(images.filter((_, i) => i !== index))
        setImageFilesToAdd(imageFilesToAdd.filter((_, i) => i !== index))
    }

    return (
        <div className={'row'}>
            <div className={'col'}>
                <input
                    style={{display: 'none'}}
                    type={'file'}
                    ref={imageInputRef}
                    onChange={handleFileChange}
                />
                {error && <Alert className={'w-50'} variant={'danger'} onClose={() => setError(false)} dismissible><Alert.Heading>File is too large</Alert.Heading>{error}</Alert>}
                <Button variant={'outline-primary rounded-0'} onClick={handleBrowseFilesClick}>
                    UPLOAD IMAGES
                </Button>
            </div>
            <div className={'row'}>
                <div className={'col m-4'}>
                    {images && images.map((img, index) => (
                        <Badge key={img.name} bg={'info'} className={'badge rounded-pill text-bg-primary ms-2'}>
                            <span className={'m-2'}>{img.name}</span>
                            <OverlayTrigger placement={'top'} overlay={<Tooltip id={'light-theme-tooltip'}>Remove image</Tooltip>}>
                                <XCircle style={{cursor: 'pointer'}} className={'m-2'} onClick={() => removeImage(index)}/>
                            </OverlayTrigger>
                        </Badge>)
                    )}
                </div>
            </div>
        </div>
    )
}

