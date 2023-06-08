import {Alert} from 'react-bootstrap'
import { ShieldShaded } from 'react-bootstrap-icons'

const SenNetDangerAlert = ({ className, text }) => {

    return (
        <Alert variant='danger'>
            <span className={className}>
                <ShieldShaded /> - {text}
            </span>
        </Alert>
    )
}

export default SenNetDangerAlert
