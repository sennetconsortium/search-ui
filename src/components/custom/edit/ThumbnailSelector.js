import React, {useRef, useState} from 'react'
import {Button, Badge, Alert, CloseButton, OverlayTrigger, Tooltip} from 'react-bootstrap'
import {Paperclip} from "react-bootstrap-icons";
import {uploadFile} from "../../../lib/services";


export default function ThumbnailSelector({ editMode, values, thumbnailFileToAdd, setThumbnailFileToAdd, setThumbnailFileToRemove }) {
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
        if (editMode === 'Edit') {
            setThumbnailFileToRemove(values.thumbnail_file.file_uuid)
        }
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
            <Button className={'mt-2 mb-2'} variant={'outline-primary rounded-0'} onClick={handleUploadThumbnailClick}>
                Upload a Thumbnail File
                <Paperclip className={'ms-2'}/>
            </Button>
        </OverlayTrigger>
        
        <div className={'row'}>
            <div className={'col align-items-center d-flex'}>
                { thumbnail &&
                    <>
                        <Badge bg={'primary'} className={'badge rounded-pill text-bg-primary m-2 p-2'}>
                            <span className={'m-2'}>{thumbnail.name}</span>
                        </Badge>
                        <OverlayTrigger overlay={<Tooltip>Remove thumbnail</Tooltip>}>
                            <CloseButton className={'p-2'} onClick={removeThumbnail}/>
                        </OverlayTrigger>
                    </>
                }
                {/* Edit mode */}
                { thumbnail === null && thumbnailFileToAdd &&
                    <>
                        <Badge bg={'primary'} className={'badge rounded-pill text-bg-primary m-2 p-2'}>
                            <span className={'m-2'}>{thumbnailFileToAdd.filename}</span>
                        </Badge>
                        <OverlayTrigger overlay={<Tooltip>Remove thumbnail</Tooltip>}>
                            <CloseButton className={'p-2'} onClick={removeThumbnail}/>
                        </OverlayTrigger>
                    </>
                }
            </div>
        </div>
    </div>
}