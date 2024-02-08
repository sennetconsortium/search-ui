import React, {Fragment} from 'react';
import {fetchProtocols, getClickableLink} from "../../js/functions";
import SenNetAccordion from "../../layout/SenNetAccordion";
import Card from 'react-bootstrap/Card';

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
                {this.state.protocol_data != null &&
                    <Card border={'0'} className={'pb-3'}>
                        <Card.Body>
                            <Card.Subtitle
                                dangerouslySetInnerHTML={{__html: this.state.protocol_data.title?.stripTags()}}/>
                        </Card.Body>
                    </Card>
                }

                <Card border={'0'} className={'pb-3'}>
                    <Card.Body>
                        <Card.Subtitle className={"title"}>DOI</Card.Subtitle>
                        <Card.Text>
                            <a href={getClickableLink(this.props.protocol_url)}
                               className="icon_inline" target="_blank"><span
                                className="me-1">{this.props.protocol_url}</span> <i className="bi bi-box-arrow-up-right"></i></a>
                        </Card.Text>
                    </Card.Body>
                </Card>

                {this.state.protocol_data != null &&
                    <Fragment>
                        <Card border={'0'} className={'pb-3'}>
                            <Card.Body>
                                <Card.Subtitle className={"title"}>Authors</Card.Subtitle>
                                <Card.Text>
                                    {this.state.protocol_data.authors.map((author, index, array) => {
                                        return (
                                            <span key={index}>
                                        {author.username != "" ? (
                                                <a href={`https://www.protocols.io/researchers/${author.username}`}
                                                   className="icon_inline" target="_blank">
                                                    <span className="me-1">{author.name}</span> <i className="bi bi-box-arrow-up-right"></i>
                                                </a>
                                            ) :
                                            <>{author.name}</>
                                        }
                                                {index !== array.length - 1 ? <>, </> : <></>}
                                    </span>
                                        );
                                    })}
                                </Card.Text>
                            </Card.Body>
                        </Card>

                        <Card border={'0'} className={'pb-3'}>
                            <Card.Body>
                                <Card.Subtitle className={"title"}>Abstract</Card.Subtitle>
                                <Card.Text>
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
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Fragment>
                }

            </SenNetAccordion>
        )
    }
};