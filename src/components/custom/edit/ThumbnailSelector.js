import React, {useRef, useState} from 'react'
import {Button, Badge, Alert, CloseButton, OverlayTrigger, Tooltip} from 'react-bootstrap'
import {uploadFile} from "../../../lib/services";


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

    const handleUploadThumbnailClick = () => thumbnailInputRef.current.click()
    
    return <div>
        <input
            style={{display: 'none'}}
            type={'file'}
            ref={thumbnailInputRef}
            onChange={handleThumbnailChange}
        />
        
        { error && 
            <Alert className={'w-50'} variant={'danger'} onClose={() => setError(false)} dismissible>
                <Alert.Heading>File is too large</Alert.Heading>
                {error}
            </Alert>
        }
        
        <OverlayTrigger placement={'top'} overlay={<Tooltip>Click here to attach a single thumbnail image</Tooltip>}>
            <Button variant={'outline-primary rounded-0'} onClick={handleUploadThumbnailClick}>
                UPLOAD A THUMBNAIL
            </Button>
        </OverlayTrigger>
        
        <div className={'row'}>
            <div className={'col m-4 align-content-center d-flex'}>
                { thumbnail &&
                    <>
                        <Badge bg={'info'} className={'badge rounded-pill text-bg-primary m-2'}>
                            <span className={'m-2'}>{thumbnail.name}</span>
                        </Badge>
                        <OverlayTrigger overlay={<Tooltip>Remove thumbnail</Tooltip>}>
                            <CloseButton onClick={removeThumbnail}/>
                        </OverlayTrigger>
                    </>
                }
            </div>
        </div>
    </div>
}