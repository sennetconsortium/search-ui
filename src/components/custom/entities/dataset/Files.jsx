import React from 'react';
import {BoxArrowUpRight, EnvelopeFill} from 'react-bootstrap-icons';
import {fetchGlobusFilepath} from "../../../../lib/services";


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
            <li className="sui-result sui-result--padded" id="Files">
                <div className="sui-result__header">
                    <span className="sui-result__title">Files</span>
                </div>
                <div className="card-body">

                    {this.state.status === 200 && this.state.filepath && <>Files are available through the Globus Research Data Management System. Access dataset <a
                        target="_blank"
                        href={this.state.filepath}
                        className="icon_inline"><span
                        className="me-1">{this.props.sennet_id}</span> <BoxArrowUpRight/></a></>}

                    {this.state.status > 200 && <>Access to the files on the Globus Research Management system is restricted. You may not have access to these files because the Consortium
                    is still curating data and/or the data is protected data that requires you to be a member of the Consortium "Protected Data Group".
                        Such protected data will be available via dbGaP in the future.
                        If you believe this to be an error, please contact <a className={'lnk--ic'} href={'mailto:help@sennetconsortium.org'}>help@sennetconsortium.org <EnvelopeFill/></a></>}
                </div>
            </li>
        )
    }
}