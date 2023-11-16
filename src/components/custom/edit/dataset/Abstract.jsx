import SenNetPopover, {SenPopoverOptions} from "../../../SenNetPopover";
import {QuestionCircleFill} from "react-bootstrap-icons";
import EntityFormGroup from "../../layout/entity/FormGroup";
import React from "react";
import { Form } from 'react-bootstrap'

export default class Abstract extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            abstract: this.props.data.abstract || ""
        };
    }

    onChange = (e, fieldId, value) => {
        this.props.onChange(e, fieldId, value);
        this.setState({"abstract": this.props.value?.purpose?.trim() + " " + this.props.data?.method?.trim() + " " + this.props.data?.result?.trim()});
    };

    render() {
        return (
            <>
                <h6>Abstract <SenNetPopover className={"abstract"}
                                            text={<>These fields will be combined to create a complete abstract during
                                                the publishing of this <code>Dataset</code> and minting of a DOI.
                                                <br></br>
                                                An example of a well formed abstract can be seen <a target="_blank"
                                                                                                    href="https://www.nlm.nih.gov/bsd/policy/structured_abstracts.html">here</a>.
                                            </>}>
                    <QuestionCircleFill/>
                </SenNetPopover>
                </h6>
                <Form.Group className={"mb-4"}>
                    <Form.Control as={"textarea"} rows={2} disabled value={this.state.abstract}/>
                </Form.Group>
                <div className={"card mb-4 bg-transparent"}>
                    <div className={"card-body"}>
                        <div className={"container-fluid px-4"}>
                            <div className={"row mt-4"}>
                                {/*Purpose*/}
                                <EntityFormGroup label='Purpose' type='textarea'
                                                 controlId='purpose'
                                                 isRequired={true}
                                                 value={this.props.data.purpose}
                                                 onChange={this.onChange}
                                                 row={2}
                                                 className={this.props.warningClasses.abstract_purpose}
                                                 warningClass={"warning-icon-trigger-textarea"}
                                                 warningText={<>This field is required for
                                                     publishing of this <code>Dataset</code>. This
                                                     will need to be filled out with at least 100
                                                     character prior to submission.</>}
                                                 onBlur={this.props.onBlur}
                                                 popoverTrigger={SenPopoverOptions.triggers.hoverOnClickOff}
                                                 text={<></>}/>

                                {/*Method*/}
                                <EntityFormGroup label='Method' type='textarea'
                                                 controlId='method'
                                                 isRequired={true}
                                                 value={this.props.data.method}
                                                 onChange={this.onChange}
                                                 row={2}
                                                 className={this.props.warningClasses.abstract_method}
                                                 warningClass={"warning-icon-trigger-textarea"}
                                                 warningText={<>This field is required for
                                                     publishing of this <code>Dataset</code>. This
                                                     will need to be filled out with at least 100
                                                     character prior to submission.</>}
                                                 onBlur={this.props.onBlur}
                                                 popoverTrigger={SenPopoverOptions.triggers.hoverOnClickOff}
                                                 text={<></>}/>

                                {/*Result*/}
                                <EntityFormGroup label='Result' type='textarea'
                                                 controlId='result'
                                                 isRequired={true}
                                                 value={this.props.data.result}
                                                 onChange={this.onChange}
                                                 row={2}
                                                 className={this.props.warningClasses.abstract_result}
                                                 warningClass={"warning-icon-trigger-textarea"}
                                                 warningText={<>This field is required for
                                                     publishing of this <code>Dataset</code>. This
                                                     will need to be filled out with at least 100
                                                     character prior to submission.</>}
                                                 onBlur={this.props.onBlur}
                                                 popoverTrigger={SenPopoverOptions.triggers.hoverOnClickOff}
                                                 text={<>Two or three sentences explaining what the <b>main
                                                     result</b> reveals
                                                     in direct
                                                     comparison to what was thought to be the case previously, or how
                                                     the
                                                     main result adds to previous knowledge.</>}/>

                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}