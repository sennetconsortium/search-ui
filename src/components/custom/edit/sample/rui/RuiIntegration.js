import React, {Component} from "react";
import {ORGAN_TYPES} from "../../../../../config/constants";
import Script from 'next/script'
import {parseJson} from "../../../../../lib/services";


class RUIIntegration extends Component {

    constructor(props) {
        super(props)
        this.state = {
            width: 1905, height: 1012
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
            const update_width = Math.min(window.innerWidth - 15, 2000)
            const update_height = Math.round(window.innerHeight - 15, 2000)
            this.setState({width: update_width, height: update_height})
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
        const location = parseJson(this.props.blockStartLocation)
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
            self.props.setRuiLocation(tissueBlockSpatialData)
            self.props.setShowRui(false)
        }
        rui.cancelRegistration = function () {
            self.props.setShowRui(false)
        }
        rui.editRegistration = location
        rui.useDownload = false
        rui.skipUnsavedChangesConfirmation = true
    }

    render() {
        return (<>
            <Script src={'https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3/rui/wc.js'}/>
            <div className='webgl-content rui mat-typography'>
                {
                    <div id='unityContainer'
                         style={{
                             width: this.state.width,
                             height: this.state.height,
                         }}>
                        <ccf-rui
                            ref={this.ruiRef}
                            base-href="https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3/rui/"
                            theme={'sennet'}
                        />
                    </div>
                }
            </div>
        </>)
    }
}

export default RUIIntegration
