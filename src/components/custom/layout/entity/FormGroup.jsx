import {useContext} from 'react'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { QuestionCircleFill } from 'react-bootstrap-icons'
import AppContext from '../../../../context/AppContext'
import SenPopover from "../../../SenPopover";

function EntityFormGroup({ controlId, label, text, onChange, value, type, placeholder, isRequired, pattern, popoverTrigger }) {
  const {_t } = useContext(AppContext)
  const isTextarea = (type === 'textarea')

  return (
    <>
    
        <Form.Group className="mb-3" controlId={controlId}>
            <Form.Label>{_t(label)} {isRequired && <span className="required">* </span>} {!isRequired && <span> </span>}
                <SenPopover text={text} trigger={popoverTrigger} className={`popover-${controlId}`}>
                    <QuestionCircleFill/>
                </SenPopover>

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
    isRequired: PropTypes.bool,
    popoverTrigger: PropTypes.string
}

export default EntityFormGroup