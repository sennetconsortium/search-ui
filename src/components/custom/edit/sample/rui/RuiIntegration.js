import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import Spinner from "../../../Spinner";
import { parseJson } from "../../../../../lib/services";
import AppModal from "../../../../AppModal";
import Script from "next/script";

class RUIIntegration extends Component {
    constructor(props) {
        super(props);
        this.ruiRef = React.createRef();
        this.registerButtonRef = React.createRef();
        this.state = {
            ruiLoaded: false,
            viewHeight: "90vh",
            showCancelModal: false,
        };
    }

    /**
     * Update the ccf-rui config and add a resize screen event listener
     */
    componentDidMount() {
        console.log("RUI...", this.props);
        this.updateHeight();
        this.updateRUIConfig();
        window.addEventListener("resize", this.updateHeight.bind(this));

        const ruiRef = this.ruiRef.current;
        const ruiRefObserver = new MutationObserver((_) => {
            // Check if the register button is present, if so then the rui is loaded
            const element = ruiRef.getElementsByClassName("ccf-review-button");
            if (element.length) {
                this.ruiDidLoad();
                ruiRefObserver.disconnect();
            }
        });
        ruiRefObserver.observe(ruiRef, { childList: true });
    }

    /**
     * Update ccf-rui config
     * @param prevProps
     * @param prevState
     * @param snapShot
     */
    componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.ruiRef.current) {
            this.updateRUIConfig();
        }
    }

    /**
     * Remove event listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateHeight.bind(this));
    }

    updateHeight() {
        // Subtract navbar height from window height
        const navBars = document.getElementsByClassName("navbar");
        const footer = document.getElementById("rui-footer");
        if (navBars.length && footer) {
            const height = `${
                window.innerHeight -
                navBars[0].offsetHeight -
                footer.offsetHeight
            }px`;
            this.setState({ viewHeight: height });
        }
    }

    ruiDidLoad() {
        this.setState({ ruiLoaded: true });
        this.removeRegisterButton();
        this.updateHeight();
    }

    removeRegisterButton() {
        const ruiRef = this.ruiRef.current;
        const reviewButtons = ruiRef.getElementsByTagName("ccf-review-button");
        if (reviewButtons.length) {
            this.registerButtonRef.current = reviewButtons[0];
            reviewButtons[0].remove();
        }
    }

    updateRUIConfig() {
        const organ = this.props.cache.organTypes[this.props.organ];
        const [_, organType, organSide] = organ.match(
            /^((?:\w)+(?: \w+)?)(?: \((Right|Left)\))?$/
        );
        const sex = this.props.sex;
        const [firstName, lastName] = this.props.user.split(" ");
        const location = parseJson(this.props.blockStartLocation);
        const self = this;

        const rui = this.ruiRef.current;
        rui.organ = {
            ontologyId: organType.toLowerCase(),
            name: organType.toLowerCase(),
            sex: sex?.toLowerCase(),
            side: organSide?.toLowerCase(),
        };
        rui.user = {
            firstName: firstName || "",
            lastName: lastName || "",
        };
        rui.register = function (tissueBlockSpatialData) {
            console.log(tissueBlockSpatialData);
            self.props.setRuiLocation(tissueBlockSpatialData);
            self.props.setShowRui(false);
        };
        rui.cancelRegistration = function () {
            self.props.setShowRui(false);
        };
        rui.editRegistration = location;
        rui.useDownload = false;
        rui.skipUnsavedChangesConfirmation = true;
    }

    clickRegister() {
        console.log("clickRegister", this.registerButtonRef.current);
        const registerButton = this.registerButtonRef.current;
        if (registerButton) {
            registerButton.getElementsByTagName("button")[0].click();
        }
    }

    render() {
        return (
            <div className="webgl-content mat-typography rui">
                <div
                    id="unityContainer"
                    style={{ height: this.state.viewHeight }}
                >
                    <ccf-rui
                        ref={this.ruiRef}
                        base-href="https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3/rui/"
                        theme={"sennet"}
                        header={false}
                    />

                    {!this.state.ruiLoaded && (
                        <div
                            className="d-flex flex-column justify-content-center"
                            style={{ height: this.state.viewHeight }}
                        >
                            <Spinner style={{ margin: "auto" }} />
                        </div>
                    )}

                    <Modal.Footer id="rui-footer">
                        <Button
                            variant="outline-secondary rounded-0 my-3 mx-2"
                            onClick={() =>
                                this.setState({ showCancelModal: true })
                            }
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outline-primary rounded-0 my-3 mx-2"
                            disabled={!this.state.ruiLoaded}
                            onClick={() => this.clickRegister()}
                        >
                            Register
                        </Button>
                    </Modal.Footer>

                    <AppModal
                        modalTitle={"Cancel Registration?"}
                        modalBody={
                            "Any changes will be lost. Are you sure you want to cancel registration?"
                        }
                        modalSize="md"
                        showModal={this.state.showCancelModal}
                        showCloseButton={true}
                        closeButtonLabel={"Close"}
                        handleClose={() =>
                            this.setState({ showCancelModal: false })
                        }
                        showHomeButton={true}
                        actionButtonLabel={"Cancel Registration"}
                        handleHome={() => this.props.setShowRui(false)}
                    />

                    <Script
                        only="edit/sample"
                        src="https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3.7/rui/wc.js"
                    />
                </div>
            </div>
        );
    }
}

export default RUIIntegration;
