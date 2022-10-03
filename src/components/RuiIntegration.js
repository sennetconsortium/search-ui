import React, {Component} from "react";
import {ORGAN_TYPES} from "../config/constants";
import Script from 'next/script'


class RUIIntegration extends Component {

    constructor(props) {
        super(props)
        this.state = {
            hide: false, width: 1820, height: 1012
        }
        this.ruiRef = React.createRef()
    }

    /**
     * Calculate & Update state of new dimensions
     */
    updateDimensions() {
        if (window.innerWidth < 1100) {
            this.setState({width: 1000, height: 647})
        } else {
            const update_width = Math.min(window.innerWidth - 50, 2000)
            const update_height = Math.round(window.innerHeight - 50, 2000)
            this.setState({width: update_width, height: update_height, margin_left: 20})
        }
    }

    /**
     * Update the ccf-rui config and add a resize screen event listener
     */
    componentDidMount() {
        console.log('RUI...', this.props)
        this.updateRUIConfig()
        this.updateDimensions()
        window.addEventListener("resize", this.updateDimensions.bind(this))
    }

    /**
     * Update ccf-rui config
     * @param prevProps
     * @param prevState
     * @param snapShot
     */
    componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.ruiRef.current) {
            this.updateRUIConfig()
        }
    }

    /**
     * Remove event listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this))
    }

    updateRUIConfig() {
        const organ = ORGAN_TYPES[this.props.organ]
        const organ_info = ORGAN_TYPES[this.props.organ].split("(")
        const organ_side = organ_info[1]?.replace(/\(|\)/g, "").toLowerCase()
        const sex = this.props.sex
        const user_name = this.props.user || ""
        const location = this.props.blockStartLocation === "" ? null : JSON.parse(this.props.blockStartLocation)
        const self = this

        const rui = this.ruiRef.current;
        rui.user = {
            firstName: user_name.split(" ")[0], lastName: user_name.split(" ")[1]
        }
        rui.organ = {
            ontologyId: organ,
            name: organ,
            sex: sex || "female",
            side: 'left'
        }
        rui.register = function (tissueBlockSpatialData) {
            console.log(tissueBlockSpatialData)
            self.props.handleJsonRUI(tissueBlockSpatialData)
            self.props.setShowRui(false)
        }
        rui.fetchPreviousRegistrations = function () {
            // IEC TODO: Fetch previous registrations for this user/organization to the same organ
            return [];
        }
        rui.cancelRegistration = function () {
            self.props.setShowRui(false)
        }
        if (location && // Don't re-set the registration if it's the same as before
            (!rui.editRegistration || location['@id'] !== rui.editRegistration['@id'])) {
            rui.editRegistration = location
        }
        rui.useDownload = false
    }

    render() {
        return (<>
            <Script async src={'https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3/rui/wc.js'}/>
            <div className='webgl-content rui mat-typography'>
                {
                    this.state.hide
                        ? null
                        : (
                            <div id='unityContainer'
                                 style={{
                                     width: this.state.width,
                                     height: this.state.height,
                                     marginLeft: this.state.margin_left,
                                 }}>
                                <ccf-rui
                                    ref={this.ruiRef}
                                    base-href="https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3/rui/"
                                    theme={'sennet'}
                                />
                            </div>
                        )
                }
            </div>
        </>)
    }
}

export default RUIIntegration
