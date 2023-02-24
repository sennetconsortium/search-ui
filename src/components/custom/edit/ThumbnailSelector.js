import React, {useRef, useState} from 'react'
import {Button, Badge, Alert} from 'react-bootstrap'
import {uploadFile} from "../../../lib/services";
import {XCircle} from "react-bootstrap-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


export default function ThumbnailSelector({ setThumbnailFileToAdd }) {
    const thumbnailInputRef = useRef()
    const [thumbnail, setThumbnail] = useState(null)
    const [error, setError] = useState(null)
    
    const handleThumbnailChange = () => {
        const thumbnailFile = event.target.files && event.target.files[0]
        if (!thumbnailFile) return
        uploadFile(thumbnailFile).then(r => {
            setThumbnailFileToAdd(r)
            setThumbnail(thumbnailFile)
        }).catch(() => setError(`${thumbnailFile.name} (${Math.floor(thumbnailFile.size / 1000)} kb) has exceeded the file size limit.`))

        event.target.value = null
    }

    const removeThumbnail = () => {
        setThumbnail(null)
        setThumbnailFileToAdd(null)
    }

    const handleAddThumbnailClick = () => thumbnailInputRef.current.click()
    
    return <div>
        <input
        style={{display: 'none'}}
        type={'file'}
        ref={thumbnailInputRef}
        onChange={handleThumbnailChange}
        />
        {error && <Alert className={'w-50'} variant={'danger'} onClose={() => setError(false)} dismissible><Alert.Heading>File is too large</Alert.Heading>{error}</Alert>}
        <Button variant={'outline-primary rounded-0'} onClick={handleAddThumbnailClick}>
            UPLOAD A THUMBNAIL
        </Button>
        <div className={'row'}>
            <div className={'col m-4'}>
                { thumbnail &&
        
                    <Badge bg={'info'} className={'badge rounded-pill text-bg-primary ms-2'}>
                        <span className={'m-2'}>{thumbnail.name}</span>
                        <OverlayTrigger placement={'top'} overlay={<Tooltip id={'light-theme-tooltip'}>Remove thumbnail</Tooltip>}>
                            <XCircle style={{cursor: 'pointer'}} className={'m-2'} onClick={() => removeThumbnail()}/>
                        </OverlayTrigger>
                    </Badge>
                }
            </div>
        </div>
    </div>
}