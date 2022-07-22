import styles from "../../table.module.css";
import React from 'react';

export default class Tissue extends React.Component {
    render() {
        return (
            <li className="sui-result w-50 mx-auto">
                <div className="sui-result__body">
                    <ul className="sui-result__details">
                        <li className={styles.element}>
                            <span className={`sui-result__key`}>Source Type</span>
                            <span
                                className={`sui-result__value fluid `}>{this.props.source?.mapped_specimen_type ||
                                this.props.source.entity_type}</span>
                        </li>
                        {this.props.source.mapped_organ &&
                            <li className={styles.element}>
                                <span className={`sui-result__key `}>Organ Type</span>
                                <span
                                    className={`sui-result__value fluid `}>{this.props.source.mapped_organ}</span>
                            </li>
                        }
                        <li className={styles.element}>
                            <span className={`sui-result__key `}>Submission ID</span>
                            <span
                                className={`sui-result__value fluid `}>{this.props.source.submission_id}</span>
                        </li>
                        {this.props.source.lab_donor_id &&
                            <li className={styles.element}>
                                <span className={`sui-result__key `}>Lab ID</span>
                                <span
                                    className={`sui-result__value fluid `}>{this.props.source.lab_donor_id}</span>
                            </li>
                        }
                        <li className={styles.element}>
                            <span className={`sui-result__key `}>Group Name</span>
                            <span
                                className={`sui-result__value fluid `}>{this.props.source.group_name}</span>
                        </li>
                        {this.props.source.description &&
                            <li className={styles.element}>
                                <span className={`sui-result__key `}>Description</span>
                                <span
                                    className={`sui-result__value fluid `}>{this.props.source.description}</span>
                            </li>
                        }
                    </ul>
                </div>
            </li>
        )
    }
}