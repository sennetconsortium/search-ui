import {useContext} from 'react'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { QuestionCircleFill } from 'react-bootstrap-icons'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import AppContext from '../../../../context/AppContext'

function EntityFormGroup({ controlId, label, text, onChange, value, type, placeholder, isRequired, pattern }) {
  const {_t } = useContext(AppContext)
  const isTextarea = (type === 'textarea')

  return (
    <>
    
        <Form.Group className="mb-3" controlId={controlId}>
            <Form.Label>{_t(label)} {isRequired && <span className="required">* </span>} {!isRequired && <span> </span>}
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Popover>
                            <Popover.Body>
                                {_t(text)}
                            </Popover.Body>
                        </Popover>
                    }
                >
                    <QuestionCircleFill/>
                </OverlayTrigger>
            </Form.Label>
            {!isTextarea && <Form.Control type={type}  defaultValue={value} placeholder={_t(placeholder)} required={isRequired}
                        pattern={pattern}
                        onChange={e => onChange(e, e.target.id, e.target.value)} /> }

            {isTextarea && <Form.Control as={type} rows={4} defaultValue={value}
                        onChange={e => onChange(e, e.target.id, e.target.value)} /> }

        </Form.Group>
    </>
    
  )
}

EntityFormGroup.defaultProps = {
    type: 'text',
    isRequired: false,
    placeholder: ''
}

EntityFormGroup.propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool
}

export default EntityFormGroup