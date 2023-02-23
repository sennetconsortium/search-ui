import React, {useState, useEffect, useRef} from 'react'
import {Button, Badge} from 'react-bootstrap';
import {get_auth_header} from "../../../lib/services";
import {getIngestEndPoint} from "../../../config/config";
import {XCircle} from "react-bootstrap-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';



export default function ImageSelector({ tempFileIds, setTempFileIds}) {
    const imageInputRef = useRef()
    const [images, setImages] = useState([])
    
    const uploadFile = async image => {
        const formData = new FormData()
        formData.append('file', image)
        const requestOptions = {
            headers: get_auth_header(),
            method: 'POST',
            body: formData
        }
        const response = await fetch(getIngestEndPoint() + 'file-upload', requestOptions)
        const tempFileId = await response.json()
        setTempFileIds(prevState => [...prevState, tempFileId])
    }

    const handleFileChange = () => {
        const image = event.target.files && event.target.files[0]
        if (!image) return
        uploadFile(image)
        setImages(prevState => [...prevState, image])
        event.target.value = null
    }

    const handleBrowseFilesClick = () => imageInputRef.current.click()

    const removeImage = index => {
        setImages(images.filter((_, i) => i !== index))
        setTempFileIds(tempFileIds.filter((_, i) => i !== index))
    }

    return (<div className={'row'}>
        <div className={'col mb-2'}>
            <input
                style={{display: 'none'}}
                type={'file'}
                ref={imageInputRef}
                onChange={handleFileChange}
            />
            <Button variant={'outline-secondary rounded-0'} onClick={handleBrowseFilesClick}>
                Add images
            </Button>
            {images && images.map((img, index) => (
                <Badge style={{fontSize:'.9rem'}} key={img.name} className={'badge rounded-pill text-bg-primary ms-2'}>
                    <span className={'m-2'}>{img.name}</span>
                    <OverlayTrigger placement={'top'} overlay={<Tooltip id={'light-theme-tooltip'}>Remove image</Tooltip>}>
                        <XCircle style={{cursor: 'pointer'}} className={'m-2'} onClick={() => removeImage(index)}/>
                    </OverlayTrigger>
                </Badge>)
                )
            }
        </div>
    </div>)
}

