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

    const [showTooltip, setShowTooltip] = useState(undefined)

    const isHoverOnClickOff = () => {
        if  (trigger === SenPopoverOptions.triggers.hoverOnClickOff) {
            return true
        } else {
            return undefined
        }
    }

    useEffect(() => {
        if (isHoverOnClickOff()) {
            setShowTooltip(false)

            $(document).on('click', (e)=> {
                setShowTooltip(false)
            })

            $(`.${className}-pc`).on('mouseover', (e)=>{
                setShowTooltip(true)
            })

            handlePopoverDisplay(className, setShowTooltip)
        }

    }, [])

    return (

        <OverlayTrigger show={showTooltip}  trigger={trigger} placement={placement} overlay={
            <Popover className={className}>
                <Popover.Body>
                    {text}
                </Popover.Body>
            </Popover>
        }>
            <span className={`${className}-pc`}>
                {children}
            </span>

        </OverlayTrigger>

    )
}

SenPopover.defaultProps = {
    placement: 'top',
    className: 'sen-popover'
}

SenPopover.propTypes = {
    children: PropTypes.node,
    placement: PropTypes.string,
    className: PropTypes.string
}

export default SenPopover