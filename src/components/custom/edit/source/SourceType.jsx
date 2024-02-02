import {useContext, useEffect, useState} from 'react'
import {Form} from 'react-bootstrap';
import SenNetPopover from '../../../SenNetPopover'
import AppContext from '../../../../context/AppContext'

function SourceType( { data, onChange } ) {
    const { cache } = useContext(AppContext)

    useEffect(() => {
    }, [])

    return (
        //Source Type
        <>
            <Form.Group className="mb-3" controlId="source_type">
                <Form.Label>Source Type <span
                    className="required">* </span>
                    <SenNetPopover className={'source_type'} text={<>
                        The type of this <code>Source</code>. Choose from one of the available options.<br />
                        <small className='popover-note text-muted'>Note: CCF Registration User Interface (CCF-RUI) tool is only available for <code>{cache.sourceTypes.Human}</code> and <code>{cache.sourceTypes['Human Organoid']}</code> types.</small>
                    </>}>
                        <i className="bi bi-question-circle-fill"></i>
                    </SenNetPopover>
                </Form.Label>

                <Form.Select required aria-label="Source Type"
                             onChange={e => { onChange(e, e.target.id, e.target.value) }}
                             defaultValue={data?.source_type}>
                    <option value="">----</option>
                    {Object.entries(cache.sourceTypes).map(op => {
                        return (
                            <option key={op[0]} value={op[0]}>
                                {op[1]}
                            </option>
                        );

                    })}
                </Form.Select>
            </Form.Group>
        </>
    )
}

export default SourceType