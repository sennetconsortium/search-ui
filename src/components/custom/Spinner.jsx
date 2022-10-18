import { useContext } from 'react'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.css'
import AppContext from '../../context/AppContext'

function Spinner({ text }) {
    const { _t } = useContext(AppContext)

    return (
        <div className="text-center p-3">
            <span>{_t(text)}</span>
            <br></br>
            <span className="spinner-border spinner-border-lg align-center alert alert-info"></span>
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
