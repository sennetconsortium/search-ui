import { useContext } from 'react'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.css'
import AppContext from '../../context/AppContext'

function Alert({ message }) {
  const { _t } = useContext(AppContext)
  return (
    <div className="alert alert-warning" role="alert">{_t(message)}</div>
  )
}

Alert.defaultProps = {
  message: 'Something went wrong.',
}

Alert.propTypes = {
  message: PropTypes.string,
}


export default Alert