import React, {useRef, useState} from 'react'
import {Button, Badge, Alert, CloseButton, OverlayTrigger, Tooltip} from 'react-bootstrap'
import {Paperclip} from "react-bootstrap-icons";
import {uploadFile} from "../../../lib/services";
import SenPopover from "../../SenPopover";


export default function ThumbnailSelector({ editMode, values, setValues }) {
    const thumbnailInputRef = useRef()
    const [thumbnail, setThumbnail] = useState(null)
    const [error, setError] = useState(null)
    
    const handleThumbnailChange = () => {
        const thumbnailFile = event.target.files && event.target.files[0]
        if (!thumbnailFile) return
        uploadFile(thumbnailFile).then(r => {
            setValues(prevState => ({...prevState, thumbnail_file_to_add: r}))
            setThumbnail(thumbnailFile)
        }).catch(() => setError(`${thumbnailFile.name} (${Math.floor(thumbnailFile.size / 1000)} kb) has exceeded the file size limit.`))

        event.target.value = null
    }

    const removeThumbnail = () => {
        setThumbnail(null)
        if (values.thumbnail_file_to_add) {
            delete values.thumbnail_file_to_add
            setValues(values)
        }
        if (editMode === 'Edit') {
            if (values.thumbnail_file) {
                setValues(prevState => {
                    const id = prevState.thumbnail_file.file_uuid
                    delete prevState.thumbnail_file
                    return {...prevState, thumbnail_file_to_remove: id}
                })
            }
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

        <SenPopover className={'thumbnail-selector'}  placement={'top'} text={'Click here to attach a single thumbnail image'}>
            <Button className={'mt-2 mb-2'} variant={'outline-primary rounded-0'} onClick={handleUploadThumbnailClick}>
                Upload a Thumbnail File
                <Paperclip className={'ms-2'}/>
            </Button>
        </SenPopover>
        
        <div className={'row'}>
            <div className={'col align-items-center d-flex'}>
                { thumbnail &&
                    <>
                        <Badge bg={'primary'} className={'badge rounded-pill text-bg-primary m-2 p-2'}>
                            <span className={'m-2'}>{thumbnail.name}</span>
                        </Badge>
                        <SenPopover className={'remove-thumb-1'} text={'Remove thumbnail'}>
                            <CloseButton className={'p-2'} onClick={removeThumbnail}/>
                        </SenPopover>
                    </>
                }
                {/* Edit mode */}
                { thumbnail === null && values.thumbnail_file &&
                    <>
                        <Badge bg={'primary'} className={'badge rounded-pill text-bg-primary m-2 p-2'}>
                            <span className={'m-2'}>{values.thumbnail_file.filename}</span>
                        </Badge>
                        <SenPopover className={'remove-thumb-edit'} text={'Remove thumbnail'}>
                            <CloseButton className={'p-2'} onClick={removeThumbnail}/>
                        </SenPopover>
                    </>
                }
            </div>
        </div>
    </div>
}