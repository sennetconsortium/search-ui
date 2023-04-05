import { useContext } from 'react'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.css'

export function SpinnerEl({className = '', variant = 'ic'}) {
    return (<span className={`spinner spinner-border ${variant} alert alert-info ${className}`}></span>)
}

function Spinner({ text }) {
    return (
        <div className="text-center p-3">
            <span>{text}</span>
            <br></br>
            <SpinnerEl variant={'spinner-border-lg align-center'} />
        </div>
    )
}

Spinner.defaultProps = {
    text: 'Loading, please wait...',
}

Spinner.propTypes = {
    text: PropTypes.string,
}

export default Spinner
