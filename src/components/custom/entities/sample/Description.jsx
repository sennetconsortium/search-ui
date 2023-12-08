import React, {useContext} from 'react';
import SenNetAccordion from "../../layout/SenNetAccordion";
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import AppContext from "../../../../context/AppContext";
import {equals, formatCitation} from "../../js/functions";
import {BoxArrowUpRight, QuestionCircleFill} from "react-bootstrap-icons";
import {InfoRounded} from "@mui/icons-material";
import SenNetPopover, {SenPopoverOptions} from "../../../SenNetPopover";

export default function Description({data, doiData, labId, primaryDateTitle, primaryDate, secondaryDateTitle, secondaryDate}) {

    const {isLoggedIn, cache} = useContext(AppContext)

        return (
            <SenNetAccordion title={data?.title || 'Summary'} id={'Summary'}>

                {data && data?.description &&
                    <Card border={'0'} className={'pb-3'}>
                        <Card.Body>
                            <Card.Subtitle>{(equals(data.entity_type, cache.entities.upload) || equals(data.entity_type, 'Collection')) ? 'Description' : 'DOI Abstract'}</Card.Subtitle>
                            <Card.Text>{data.description}</Card.Text>
                        </Card.Body>
                    </Card>
                }

                {data && data?.doi_url &&
                    <Card border={'0'} className={'pb-3'}>
                        <Card.Body>
                            <Card.Subtitle>Citation <SenNetPopover text={<span>Citation is provided in NLM format. If the DataCite page is provided, select from the <i>Cite as</i> drop down alternate ways to cite.</span>} trigger={SenPopoverOptions.triggers.hover} className={`popover-citation`}>
                                <QuestionCircleFill/>
                            </SenNetPopover></Card.Subtitle>
                            <Card.Text>{doiData && <span>{formatCitation(doiData, data.doi_url)}</span>}</Card.Text>
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