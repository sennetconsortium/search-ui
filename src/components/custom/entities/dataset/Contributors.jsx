import React from 'react';
import {BoxArrowUpRight} from 'react-bootstrap-icons';
import DataTable from "react-data-table-component";


export default class Contributors extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                name: 'Name',
                selector: row => row.name,
                sortable: true,
            },
            {
                name: 'Affiliation',
                selector: row => row.affiliation,
                sortable: true,
            },
            {
                name: 'ORCID',
                selector: row => row.orcid,
                sortable: true,
            }
        ];

        this.contributor_data = [];
        {
            this.props.data.map((contributor, index) => {
                this.contributor_data.push({
                    name: contributor.name,
                    affiliation: contributor.affiliation,
                    orcid: <a className="icon_inline"
                              href={`https://orcid.org/${contributor.orcid_id}`}>
                        <span className="me-1">{contributor.orcid_id}</span>
                        <BoxArrowUpRight/></a>
                });
            })
        }

    }

    render() {
        return (
            <div className="accordion accordion-flush sui-result" id="Contributors">
                <div className="accordion-item ">
                    <div className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#contributors-collapse" aria-expanded="true"
                                aria-controls="contributors-collapse">Contributors

                        </button>
                    </div>
                    <div id="contributors-collapse" className="accordion-collapse collapse show">
                        <div className="accordion-body">
                            <DataTable
                                columns={this.columns}
                                data={this.contributor_data}
                                pagination/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}