import React from 'react';
import styles from './table.module.css'
import organ_json from './organs.json'

const TableResults = ({children}) => (
    <ul className="sui-results-container">
        {children}
    </ul>
);


const TableRowDetail = ({result: record}) => {
    console.log("Here!!!!!!", record)
    var hotlink = "/" + record.entity_type.raw.toLowerCase() + "?uuid=" + record.uuid.raw

    var entity_type = record.entity_type.raw
    var date_created = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(record.created_timestamp.raw)

    if (record.published_timestamp != undefined) {
        var date_published = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(record.published_timestamp.raw)
    }

    if (record.created_by != undefined) {
        var created_by = record.created_by.raw
    }

    if (record.title != undefined) {
        var title = record.title.raw
    } else if (record.display_subtype != undefined) {
        var title = record.display_subtype.raw
    }

    if (record.description != undefined) {
        var description = record.description.raw
    }

    if (entity_type == "Sample") {
        var specimen_type = record.specimen_type.raw
        if (specimen_type == "organ") {
            var organ = organ_json[record.organ.raw]
        }

    } else if (entity_type == "Dataset") {

    } else if (entity_type == "Source") {
        if (description == undefined && record.source != undefined) {
            description = record.source.description.raw
        }

    }


    return (
        <li className="sui-result">
            <div className="sui-result__header">
                <a className="sui-result__title sui-result__title-link" href={hotlink}>{record.uuid.raw}</a>
            </div>
            <div className="sui-result__body">
                <ul className="sui-result__details">
                    <li className={styles.element}>
                        <span className={`sui-result__key ${styles.label}`}>Entity Type</span>
                        <span className={`sui-result__value fluid ${styles.text}`}>{entity_type}</span>
                    </li>
                    <li className={styles.element}>
                        <span className={`sui-result__key ${styles.label}`}>Title</span>
                        <span className={`sui-result__value fluid ${styles.text}`}>{title}</span>
                    </li>
                    <li className={styles.element}>
                        <span className={`sui-result__key ${styles.label}`}>UUID</span>
                        <span className={`sui-result__value fluid ${styles.text}`}>{record.uuid.raw}</span>
                    </li>
                    <li className={styles.element}>
                        <span className={`sui-result__key ${styles.label}`}>Date Created</span>
                        <span className={`sui-result__value fluid ${styles.text}`}>{date_created}</span>
                    </li>
                    {date_published ? (
                        <li className={styles.element}>
                            <span className={`sui-result__key ${styles.label}`}>Date Published</span>
                            <span className={`sui-result__value fluid ${styles.text}`}>{date_published}</span>
                        </li>
                    ) : null
                    }
                    {specimen_type &&
                        <li className={styles.element}>
                            <span className={`sui-result__key ${styles.label}`}>Specimen Type</span>
                            <span className={`sui-result__value fluid ${styles.text}`}
                                  style={{textTransform: 'capitalize'}}>{specimen_type}</span>
                        </li>
                    }
                    {organ &&
                        <li className={styles.element}>
                            <span className={`sui-result__key ${styles.label}`}>Organ</span>
                            <span className={`sui-result__value fluid ${styles.text}`}>{organ}</span>
                        </li>
                    }
                    {description &&
                        <li className={styles.element}>
                            <span className={`sui-result__key ${styles.label}`}>Description</span>
                            <span className={`sui-result__value fluid ${styles.text}`}
                                  style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>{description}</span>
                        </li>
                    }
                </ul>
            </div>

            {/* 	    <div className="sui-result__header"> */}
            {/* 			<div className={styles.result__sub_title}>Metadata</div> */}
            {/* 			<div className="sui-result__body"> */}
            {/* 	            <ul className="sui-result__details"> */}
            {/* 					{MetadataRowDetail(record.donor)} */}
            {/* 				</ul> */}
            {/* 	        </div> */}
            {/* 	    </div> */}

        </li>
    );
};


export {TableResults, TableRowDetail};