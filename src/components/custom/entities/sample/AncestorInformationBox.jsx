import React from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import SenNetAccordion from "../../layout/SenNetAccordion";
import ClipboardCopy from "../../../ClipboardCopy";

export default class AncestorInformationBox extends React.Component {
    render() {
        return (
            <SenNetAccordion className={'mb-3'} title={'Ancestor'}>
                <Card border={'0'} className={'pb-3'}>
                    <Card.Body>
                        <Card.Subtitle>
                            <a href={'/' + this.props.ancestor.entity_type.toLowerCase() + '?uuid=' + this.props.ancestor.uuid}
                               className="icon_inline mt-1">{this.props.ancestor.sennet_id}</a><ClipboardCopy text={this.props.ancestor.sennet_id} title={'Copy SenNet ID {text} to clipboard'} />
                        </Card.Subtitle>
                    </Card.Body>
                </Card>

                <CardGroup>
                    <Card border={'0'} className={'pb-3'}>
                        <Card.Body>
                            <Card.Subtitle>Ancestor Type</Card.Subtitle>
                            <Card.Text>{this.props.ancestor.entity_type}</Card.Text>
                        </Card.Body>
                    </Card>

                    {this.props.ancestor.lab_source_id &&
                        <Card border={'0'} className={'pb-3'}>
                            <Card.Body>
                                <Card.Subtitle>Lab ID</Card.Subtitle>
                                <Card.Text>{this.props.ancestor.lab_source_id}</Card.Text>
                            </Card.Body>
                        </Card>
                    }
                    {this.props.ancestor.lab_tissue_sample_id &&
                        <Card border={'0'} className={'pb-3'}>
                            <Card.Body>
                                <Card.Subtitle>Lab ID</Card.Subtitle>
                                <Card.Text>{this.props.ancestor.lab_tissue_sample_id}</Card.Text>
                            </Card.Body>
                        </Card>
                    }
                    {this.props.ancestor.source_type &&
                        <Card border={'0'} className={'pb-3'}>
                            <Card.Body>
                                <Card.Subtitle>Source Type</Card.Subtitle>
                                <Card.Text>{this.props.ancestor.source_type}</Card.Text>
                            </Card.Body>
                        </Card>
                    }
                    {this.props.ancestor.sample_category &&
                        <Card border={'0'} className={'pb-3'}>
                            <Card.Body>
                                <Card.Subtitle>Sample Category</Card.Subtitle>
                                <Card.Text>{this.props.ancestor.sample_category}</Card.Text>
                            </Card.Body>
                        </Card>
                    }
                    {this.props.ancestor.organ &&
                        <Card border={'0'} className={'pb-3'}>
                            <Card.Body>
                                <Card.Subtitle>Organ Type</Card.Subtitle>
                                <Card.Text>{this.props.ancestor.display_subtype}</Card.Text>
                            </Card.Body>
                        </Card>
                    }
                    {this.props.ancestor.group_name &&
                        <Card border={'0'} className={'pb-3'}>
                            <Card.Body>
                                <Card.Subtitle>Group Name</Card.Subtitle>
                                <Card.Text>{this.props.ancestor.group_name}</Card.Text>
                            </Card.Body>
                        </Card>
                    }
                </CardGroup>
            </SenNetAccordion>
        )
    }
}