import React, {useState} from 'react'
import PropTypes from 'prop-types'
import SenNetPopover, {SenPopoverOptions} from "./SenNetPopover";
import {Clipboard} from "react-bootstrap-icons";

function ClipboardCopy({children, text, title, className}) {

    const [showTooltip, setShowTooltip] = useState(false)
    const copyToClipboard = () => {
        navigator.clipboard.writeText(text)
        setShowTooltip(true)
        let st
        clearTimeout(st)
        st = setTimeout(()=>{
            setShowTooltip(false)
        }, 2000)
    }

    return (
        <SenNetPopover text={'Copied!'} show={showTooltip} trigger={SenPopoverOptions.triggers.click} className={`${className} popover-clipboard`}>
            <sup title={title.replace('{text}', text)} role={'button'} onClick={copyToClipboard}>
                {!children && <Clipboard size={12} />}
                {children}
            </sup>
        </SenNetPopover>
    )
}

ClipboardCopy.defaultProps = {
    className: '',
    title: 'Copy SenNet ID to clipboard'
}

ClipboardCopy.propTypes = {
    children: PropTypes.node,
    text: PropTypes.string.isRequired,
    title: PropTypes.string,
    className: PropTypes.string
}

export default ClipboardCopy