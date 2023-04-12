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
            <div className="accordion accordion-flush sui-result" id="Protocols">
                <div className="accordion-item ">
                    <div className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#protocol-collapse" aria-expanded="true"
                                aria-controls="protocol-collapse">Protocols

                        </button>
                    </div>
                    <div id="protocol-collapse" className="accordion-collapse collapse show">
                        <div className="accordion-body">
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
                                           className="icon_inline" target="_blank"><span
                                            className="me-1">{this.props.protocol_url}</span> <BoxArrowUpRight/></a>
                                    </td>
                                </tr>

                                {this.state.protocol_data != null &&
                                    <>
                                        <tr>
                                            <td>
                                                <span className={"title"}>Authors</span><br></br>
                                                <span>
                                        {this.state.protocol_data.authors.map((author, index, array) => {
                                            return (
                                                <span key={index}>
                                                    {author.username != "" ? (
                                                            <a href={`https://www.protocols.io/researchers/${author.username}`}
                                                               className="icon_inline" target="_blank">
                                                                <span className="me-1">{author.name}</span> <BoxArrowUpRight/>
                                                            </a>
                                                        ) :
                                                        <>{author.name}</>
                                                    }
                                                    {index !== array.length - 1 ? <>, </> : <></>}
                                                </span>
                                            );
                                        })}
                                    </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span className={"title"}>Abstract</span><br></br>
                                                {JSON.parse(this.state.protocol_data.description).blocks.map((block, index, array) => {
                                                    return (
                                                        <span key={index}>
                                                            {block.text != "" &&
                                                                <>{block.text}</>
                                                            }
                                                            {index !== array.length - 1 ? <br></br> : <></>}
                                                        </span>
                                                    )
                                                })}
                                            </td>
                                        </tr>
                                    </>
                                }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};