import React from 'react';
import {fetchProtocols, getClickableLink} from "../../js/functions";
import {Table} from 'react-bootstrap';
import {BoxArrowUpRight} from "react-bootstrap-icons";
import SenNetAccordion from "../../layout/SenNetAccordion";

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
            <SenNetAccordion title={'Protocols'}>
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
            </SenNetAccordion>
        )
    }
};