import React from 'react';
import {Table, Button} from 'react-bootstrap';
import styles from '../../style.module.css'
import {Download} from "react-bootstrap-icons";

export default class Metadata extends React.Component {
    render() {
        return (
            <li className="sui-result">
                <div className="sui-result__header" id="Metadata">
                    <span className="sui-result__title">Metadata</span>
                    {/*TODO: Need to make this button functional*/}
                    <div className="d-flex justify-content-between mb-2" style={{display: 'inline-block'}}>
                            <Button variant="primary"><Download/></Button>
                    </div>
                </div>
                <div className="card-body">
                    <div className={styles.table_wrapper}>
                        <Table>
                            <thead>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/*TODO: change donor to source*/}
                            {Object.entries(this.props.data.donor.mapped_metadata).map(([key, value]) => {
                                return (
                                    <tr key={"metadata_" + key}>
                                        <td>donor.{key}</td>
                                        <td>{value}</td>
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