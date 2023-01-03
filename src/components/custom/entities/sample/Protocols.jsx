import React from 'react';
import {fetchProtocols, getClickableLink} from "../../js/functions";
import {Table} from 'react-bootstrap';
import {BoxArrowUpRight} from "react-bootstrap-icons";

export default class Protocols extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            protocol_data: null
        };
    }

    async componentDidMount() {
        await fetchProtocols(this.props.protocol_url).then((data) => {
            this.setState({protocol_data: data})
        });
    }

    render() {
        return (
            <li className="sui-result" id="Protocols">
                <div className="sui-result__header">
                    <span className="sui-result__title">Protocols</span>
                </div>

                <div className="card-body">
                    <Table borderless>
                        {this.state.protocol_data != null &&
                            <thead>
                            <tr>
                                <th>{this.state.protocol_data.title}</th>
                            </tr>
                            </thead>
                        }

                        <tbody>
                        <tr>
                            <td>
                                <span className={"title"}>DOI</span><br></br>
                                <a href={getClickableLink(this.props.protocol_url)}
                                   className="link_with_icon" target="_blank"><span
                                    className="me-1">{this.props.protocol_url}</span> <BoxArrowUpRight/></a>
                            </td>
                        </tr>

                        {this.state.protocol_data != null &&
                            <>
                                <tr>
                                    <span className={"title"}>Authors</span><br></br>
                                    <span>
                                        {this.state.protocol_data.authors.map((author, index, array) => {
                                            return (
                                                <>
                                                    {author.name}
                                                    {index !== array.length - 1 ? <>, </> : <></>}
                                                </>
                                            );
                                        })}
                                    </span>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={"title"}>Abstract</span><br></br>
                                        <span>{JSON.parse(this.state.protocol_data.description).blocks[0].text}</span>
                                    </td>
                                </tr>
                            </>
                        }
                        </tbody>
                    </Table>
                </div>
            </li>
        )
    }
};