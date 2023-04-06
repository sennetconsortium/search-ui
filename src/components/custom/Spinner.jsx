import { useContext } from 'react'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.css'
import AppContext from '../../context/AppContext'

export function SpinnerEl({className = '', variant = 'ic'}) {
    return (<span className={`spinner spinner-border ${variant} alert alert-info ${className}`}></span>)
}

function Spinner({ text }) {
    const { _t } = useContext(AppContext)

    return (
        <div className="text-center p-3">
            <span>{_t(text)}</span>
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
