import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'

function SenNetAccordion({children, title}) {
    useEffect(() => {
    }, [])

    return (
        <div className="accordion accordion-flush sui-result" id={title}>
            <div className="accordion-item ">
                <div className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse"
                            data-bs-target={`#${title}-collapse`} aria-expanded="true"
                            aria-controls={`${title}-collapse`}>{title}
                    </button>
                </div>
                <div id={`${title}-collapse`} className="accordion-collapse collapse show">
                    <div className="accordion-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

SenNetAccordion.defaultProps = {}

SenNetAccordion.propTypes = {
    children: PropTypes.node
}

export default SenNetAccordion