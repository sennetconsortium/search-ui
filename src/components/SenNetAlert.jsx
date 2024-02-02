import {Alert} from 'react-bootstrap'

const SenNetAlert = ({className, variant = 'danger', icon = <i className="bi bi-shield-shaded"></i>, text}) => {

    return (
        <Alert variant={variant}>
            <span className={className}>
                {icon} - {text}
            </span>
        </Alert>
    )
}

export default SenNetAlert
