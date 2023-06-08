import {Alert} from 'react-bootstrap'
import {ShieldShaded} from 'react-bootstrap-icons'

const SenNetAlert = ({ className, variant = 'danger', icon = <ShieldShaded />, text }) => {

    return (
        <Alert variant={variant}>
            <span className={className}>
                {icon} - {text}
            </span>
        </Alert>
    )
}

export default SenNetAlert
