import React from 'react';
import {BoxArrowUpRight, EnvelopeFill} from 'react-bootstrap-icons';
import {fetchGlobusFilepath} from "../../../../lib/services";
import SenNetAccordion from "../../layout/SeNetAccordion";


export default class Files extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file_url: null
        };
    }

    async componentDidMount() {
        await fetchGlobusFilepath(this.props.sennet_id).then((data) => {
            this.setState(data)
        });
    }

    render() {
        return (
            <SenNetAccordion title={'Files'}>
                    {this.state.status === 200 && this.state.filepath && <p>Files are available through the Globus Research Data Management System. Access dataset <a
                        target="_blank"
                        href={this.state.filepath}
                        className="icon_inline"><span
                        className="me-1">{this.props.sennet_id}</span> <BoxArrowUpRight/></a></p>}

                    {this.state.status > 200 && <p>Access to the files on the Globus Research Management system is restricted. You may not have access to these files because the Consortium
                    is still curating data and/or the data is protected data that requires you to be a member of the Consortium "Protected Data Group".
                        Such protected data will be available via dbGaP in the future.
                        If you believe this to be an error, please contact <a className={'lnk--ic'} href={'mailto:help@sennetconsortium.org'}>help@sennetconsortium.org <EnvelopeFill/></a></p>}
            </SenNetAccordion>
        )
    }
}