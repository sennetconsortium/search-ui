import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import $ from "jquery";
import {OverlayTrigger, Popover} from 'react-bootstrap';

export const SenPopoverOptions = {
    placement: {
      top: 'top',
      right: 'right',
      left: 'left',
      bottom: 'bottom'
    },
    triggers: {
        hover: 'hover',
        click: 'click',
        hoverOnClickOff: 'hover-on-click-off'
    }

}

export const domMutation = (callback, sel = 'body') => {
    let observer = new MutationObserver(callback);
    observer.observe($(sel)[0], {
        childList: true})
}

export const handlePopoverDisplay = (className, stateCallback) => {
    const callback = (mutations) => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (!$(node).hasClass(className)) {
                    stateCallback(false)
                }
            }
        }
    }
    domMutation(callback)
}

function SenPopover({children, text, placement, className, trigger}) {

    const [showTooltip, setShowTooltip] = useState(false)

    useEffect(() => {
        if (trigger === SenPopoverOptions.triggers.hoverOnClickOff) {
            $(document).on('click', (e)=>{
                setShowTooltip(false)
            })

            handlePopoverDisplay(className, setShowTooltip)
        }

    }, [])

    const showPopover = () => {
        if (trigger === SenPopoverOptions.triggers.hoverOnClickOff) {
            setShowTooltip(true)
        }
    }

    return (

        <OverlayTrigger show={showTooltip} trigger={trigger} placement={placement} overlay={
            <Popover className={className}>
                <Popover.Body>
                    {text}
                </Popover.Body>
            </Popover>
        }>
            <span onMouseEnter={showPopover}>
                {children}
            </span>

        </OverlayTrigger>

    )
}

SenPopover.defaultProps = {
    placement: 'top'
}

SenPopover.propTypes = {
    children: PropTypes.node,
    placement: PropTypes.string
}

export default SenPopover