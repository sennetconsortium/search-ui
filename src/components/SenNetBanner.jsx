import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {getBanner} from "../config/config"
import {Alert} from 'react-bootstrap'

function SenNetBanner({name}) {
    const [banner, setBanner] = useState(null)
    const [showBanner, setShowBanner] = useState(true)

    const handleCloseBanner = () => {
        if (banner.dismissible) {
            setShowBanner(false)
        }
    }

    useEffect(() => {
        setBanner(getBanner(name))
    }, [])

    return (
        <>
            {banner && <div className={`c-SenNetBanner ${banner.wrapperClassName || ''}`} role='section' aria-label={banner.ariaLabel}>
                {banner.beforeBanner && <div className={banner.beforeBannerClassName} dangerouslySetInnerHTML={{__html: banner.beforeBanner}}></div>}
                <div className={banner.innerWrapperClassName}>
                    <Alert variant={banner.theme || 'info'} show={showBanner} onClose={handleCloseBanner} dismissible={banner.dismissible} className={banner.className}>
                        {banner.title && <Alert.Heading><span dangerouslySetInnerHTML={{__html: banner.title}}></span></Alert.Heading>}
                        <div dangerouslySetInnerHTML={{__html: banner.content}}></div>
                    </Alert>
                </div>
                {banner.afterBanner && <div className={banner.afterBannerClassName}  dangerouslySetInnerHTML={{__html: banner.afterBanner}}></div>}
            </div>}
        </>
    )
}

SenNetBanner.defaultProps = {
    name: 'login'
}

SenNetBanner.propTypes = {
    name: PropTypes.string.isRequired
}

export default SenNetBanner