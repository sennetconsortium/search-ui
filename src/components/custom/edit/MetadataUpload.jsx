import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { Upload, CheckCircleFill, XCircleFill, Download} from "react-bootstrap-icons";
import InputGroup from 'react-bootstrap/InputGroup';
import {getIngestEndPoint} from "../../../config/config";


function MetadataUpload({children}) {
    useEffect(() => {
    }, [])
    const [file, setFile] = useState('')
    const [fileStatus, setFileStatus] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)


    const handleUpload = async (e) => {
        const upload = e.currentTarget.files[0]
        let formData = new FormData()
        setFile(upload.name)
        setFileStatus(upload.name)
        formData.append('metadata', upload)
        try {
            const response = await fetch(getIngestEndPoint() + 'validation', { method: 'POST', body: formData })
            const details = await response.json()
            if (details.code !== 200) {
                setError(details.description)
                setFileStatus(details.name)
                setSuccess(false)
            } else {
                setError(false)
                setFileStatus(upload.name)
                setSuccess(true)
            }
        } catch(e) {
            console.error(e)
        }
    }

    const downloadDetails = (e) => {
        try {
            if (!error) return
            const a = document.createElement('a')
            const obj = JSON.parse(error)
            const url = window.URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2)],
                {type: "application/json"}))
            a.href = url
            a.download = `${file}-upload-results.json`
            document.body.append(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className={`c-metadataUpload`}>
            <InputGroup className="mb-3">

                <label htmlFor='entity_metadata' className='btn btn-outline-primary rounded-0 mt-1 btn--fileUpload'>
                    Upload Metadata
                    <input onChange={handleUpload} type='file' id='entity_metadata' name='entity_metadata' />
                    <Upload />
                </label>
                <span className={`c-metadataUpload__fileInfo js-fileInfo ${error ? 'has-error' : ''}`}>
                    {error && <XCircleFill color='#842029' />}
                    {success && <CheckCircleFill color='#0d6efd' />}
                    <small onClick={downloadDetails} title={`${error ? 'Download error report' : ''}`}>{fileStatus} {error && <Download />}</small>
                </span>
            </InputGroup>
        </div>
    )
}

MetadataUpload.defaultProps = {}

MetadataUpload.propTypes = {
    children: PropTypes.node
}

export default MetadataUpload