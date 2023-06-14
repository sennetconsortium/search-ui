import React from 'react';
import {EnvelopeFill} from "react-bootstrap-icons";
import SenNetAccordion from "../../layout/SenNetAccordion";
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
export default class Attribution extends React.Component {
    render() {
        return (
            <SenNetAccordion title={'Attribution'}>
                <CardGroup>
                    <Card border={'0'} className={'pb-3'}>
                        <Card.Body>
                            <Card.Subtitle>Group</Card.Subtitle>
                            <Card.Text>{this.props.data.group_name}</Card.Text>
                        </Card.Body>
                    </Card>

                    <Card border={'0'} className={'pb-3'}>
                        <Card.Body>
                            <Card.Subtitle>Registered by</Card.Subtitle>
                            <Card.Text>
                                {this.props.data.created_by_user_displayname}
                                <br></br>
                                <a href={`mailto:${this.props.data.created_by_user_email}`}
                                   className="icon_inline"><span
                                    className="me-1">{this.props.data.created_by_user_email}</span>
                                    <EnvelopeFill/></a>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </CardGroup>
            </SenNetAccordion>
        )
    }
}