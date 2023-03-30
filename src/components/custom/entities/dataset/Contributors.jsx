import React from 'react';
import {Table} from 'react-bootstrap';
import styles from '../../style.module.css'
import {BoxArrowUpRight} from 'react-bootstrap-icons';


export default class Contributors extends React.Component {
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

                            <div className={styles.table_wrapper}>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Affiliation</th>
                                        <th>ORCID</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.props.data.map((contributor, index) => {
                                        return (
                                            <tr key={"contributor" + index}>
                                                <td>{contributor.name}</td>
                                                <td>{contributor.affiliation}</td>
                                                <td>
                                                    <a className="icon_inline"
                                                       href={`https://orcid.org/${contributor.orcid_id}`}>
                                                        <span className="me-1">{contributor.orcid_id}</span>
                                                        <BoxArrowUpRight/>
                                                    </a>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}