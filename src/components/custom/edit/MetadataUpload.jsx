import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Upload} from "react-bootstrap-icons";
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import {getIngestEndPoint} from "../../../config/config";


function MetadataUpload({children}) {
    useEffect(() => {
    }, [])
    const [fileName, setFileName] = useState('')

    const handleUpload = (e) => {

        const file = e.currentTarget.files[0]
        let formData = new FormData()
        console.log(file)
        setFileName(file.name)
        formData.append('metadata', file)
        fetch(getIngestEndPoint() + 'validation', { method: 'POST', body: formData })
    }

    return (
        <div className={`c-metadataUpload`}>
            <InputGroup className="mb-3">

                <label htmlFor='entity_metadata' className='btn btn-outline-primary rounded-0 mt-1 btn--fileUpload'>
                    Upload Metadata
                    <input onChange={handleUpload} type='file' id='entity_metadata' name='entity_metadata' />
                    <Upload />
                </label>
                <span className='c-metadataUpload__fileInfo js-fileInfo'>{fileName}</span>
            </InputGroup>
        </div>
    )
}

MetadataUpload.defaultProps = {}

MetadataUpload.propTypes = {
    children: PropTypes.node
}

export default MetadataUpload