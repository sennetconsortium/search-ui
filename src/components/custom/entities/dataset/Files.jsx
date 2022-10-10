import React from 'react';
import {BoxArrowUpRight} from 'react-bootstrap-icons';
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
            this.setState({file_url: data})
        });
    }

    render() {
        if (this.state.file_url != null) {
            return (
                <li className="sui-result" id="Files">
                    <div className="sui-result__header">
                        <span className="sui-result__title">Files</span>
                    </div>
                    <div className="card-body">
                        Files are available through the Globus Research Data Management System. Access dataset <a
                        target="_blank"
                        href={this.state.file_url}
                        className="link_with_icon"><span
                        className="me-1">{this.props.sennet_id}</span> <BoxArrowUpRight/></a>
                    </div>
                </li>
            )
        } else {
            return(<></>)
        }
    }
}