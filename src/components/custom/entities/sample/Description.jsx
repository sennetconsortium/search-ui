import React from 'react';
import SenNetAccordion from "../../layout/SenNetAccordion";
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

export default class Description extends React.Component {
    render() {
        return (
            <SenNetAccordion title={'Summary'}>
                {this.props?.data?.description &&
                    <Card border={'0'} className={'pb-3'}>
                        <Card.Body>
                            <Card.Subtitle>DOI Abstract</Card.Subtitle>
                            <Card.Text>{this.props.data.description}</Card.Text>
                        </Card.Body>
                    </Card>
                }
                <CardGroup>
                    {this.props.labId &&
                        <Card border={'0'} className={'pb-3'}>
                            <Card.Body>
                                <Card.Subtitle>Lab ID</Card.Subtitle>
                                <Card.Text>{this.props.labId}</Card.Text>
                            </Card.Body>
                        </Card>
                    }

                    {this.props.primaryDate &&
                        <Card border={'0'} className={'pb-3'}>
                            <Card.Body>
                                <Card.Subtitle>{this.props.primaryDateTitle}</Card.Subtitle>
                                <Card.Text>
                                    {new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    }).format(this.props.primaryDate)}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    }

                    {this.props.secondaryDate &&
                        <Card border={'0'} className={'pb-3'}>
                            <Card.Body>
                                <Card.Subtitle>{this.props.secondaryDateTitle}</Card.Subtitle>
                                <Card.Text>
                                    {new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    }).format(this.props.secondaryDate)}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    }
                </CardGroup>
            </SenNetAccordion>
        )
    }
}