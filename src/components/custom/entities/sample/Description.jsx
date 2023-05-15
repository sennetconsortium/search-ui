import React from 'react';
import {Table} from 'react-bootstrap';
import SenNetAccordion from "../../layout/SenNetAccordion";

export default class Description extends React.Component {
    render() {
        return (
            <SenNetAccordion className={'has-table'} title={'Summary'}>
                <Table borderless>
                    <thead>
                    <tr>
                        {this.props?.data?.description &&
                            <th>DOI Abstract</th>
                        }
                        {this.props.primaryDate &&
                            <th>{this.props.primaryDateTitle}</th>
                        }
                        {this.props.secondaryDate &&
                            <th>{this.props.secondaryDateTitle}</th>
                        }
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        {this.props?.data?.description &&
                            <td>{this.props.data.description}</td>
                        }
                        {this.props.primaryDate &&
                            <td>{new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).format(this.props.primaryDate)}</td>
                        }
                        {this.props.secondaryDate &&
                            <td>{new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).format(this.props.secondaryDate)}</td>
                        }
                    </tr>
                    </tbody>
                </Table>
            </SenNetAccordion>
        )
    }
}