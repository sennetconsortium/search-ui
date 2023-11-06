import React from 'react'
import PropTypes from 'prop-types'
import SenNetPopover, {SenPopoverOptions} from "./SenNetPopover";
import {displayBodyHeader} from "./custom/js/functions";

function StatusError({children, text, error, title, className, size = 12}) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(error)
    }

    return (
        <SenNetPopover text={<code>{error}</code>} trigger={SenPopoverOptions.triggers.hover} placement={"bottom"}
                       className={`${className} popover-status-error`}>
            <span title={title.replace('{error}', error)} onClick={copyToClipboard}>
                {displayBodyHeader(text)}
            </span>
        </SenNetPopover>
    )
}

StatusError.defaultProps = {
    className: '',
    title: 'Copy error message to clipboard'
}

StatusError.propTypes = {
    children: PropTypes.node,
    text: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
    title: PropTypes.string,
    className: PropTypes.string
}

export default StatusError