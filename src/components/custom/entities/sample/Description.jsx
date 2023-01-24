import React from 'react';
import {Table} from 'react-bootstrap';

export default class Description extends React.Component {
    render() {
        return (
            <div className="accordion accordion-flush sui-result" id="Summary">
                <div className="accordion-item ">
                    <div className="accordion-header sui-result__header">
                        <span className="sui-result__title">Summary</span>
                        <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#summary-collapse" aria-expanded="true"
                                aria-controls="summary-collapse">

                        </button>
                    </div>
                    <div id="summary-collapse" className="accordion-collapse collapse show">
                        <div className="accordion-body">
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
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}