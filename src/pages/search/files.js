import {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'

function SearchFiles({children}) {
    useEffect(() => {
    }, [])

    return (
        <div className={`c-SearchFiles`}>{children}</div>
    )
}

SearchFiles.defaultProps = {}

SearchFiles.propTypes = {
    children: PropTypes.node
}

export default SearchFiles