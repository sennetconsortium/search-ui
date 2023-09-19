import React, {useContext} from 'react';
import SenNetAccordion from "../../layout/SenNetAccordion";
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import AppContext from "../../../../context/AppContext";
import {equals} from "../../js/functions";

export default function Description({data, labId, primaryDateTitle, primaryDate, secondaryDateTitle, secondaryDate}) {

    const {isLoggedIn, cache} = useContext(AppContext)

        return (
            <SenNetAccordion title={'Summary'}>
                {data && data?.description &&
                    <Card border={'0'} className={'pb-3'}>
                        <Card.Body>
                            <Card.Subtitle>{equals(data.entity_type, cache.entities.upload) ? 'Description' : 'DOI Abstract'}</Card.Subtitle>
                            <Card.Text>{data.description}</Card.Text>
                        </Card.Body>
                    </Card>
                }
                <CardGroup>
                    {isLoggedIn() && data && labId &&
                        <Card border={'0'} className={'pb-3'}>
                            <Card.Body>
                                <Card.Subtitle>{equals(data.entity_type, cache.entities.upload) ? 'Title': 'Lab ID'}</Card.Subtitle>
                                <Card.Text>{labId}</Card.Text>
                            </Card.Body>
                        </Card>
                    }

                    {primaryDate &&
                        <Card border={'0'} className={'pb-3'}>
                            <Card.Body>
                                <Card.Subtitle>{primaryDateTitle}</Card.Subtitle>
                                <Card.Text>
                                    {new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    }).format(primaryDate)}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    }

                    {secondaryDate &&
                        <Card border={'0'} className={'pb-3'}>
                            <Card.Body>
                                <Card.Subtitle>{secondaryDateTitle}</Card.Subtitle>
                                <Card.Text>
                                    {new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    }).format(secondaryDate)}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    }
                </CardGroup>
            </SenNetAccordion>
        )
}