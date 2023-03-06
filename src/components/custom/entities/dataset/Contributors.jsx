import React from 'react';
import {Table} from 'react-bootstrap';
import styles from '../../style.module.css'
import {BoxArrowUpRight} from 'react-bootstrap-icons';


export default class Contributors extends React.Component {
    render() {
        return (
            <li className="sui-result" id="Contributors">
                <div className="sui-result__header">
                    <span className="sui-result__title">Contributors</span>
                </div>
                <div className="card-body">
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
                                                <span className="me-1">{contributor.orcid_id}</span> <BoxArrowUpRight/>
                                            </a>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </li>
        )
    }
}