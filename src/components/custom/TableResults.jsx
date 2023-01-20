import React, {useContext} from 'react';
import styles from './style.module.css'
import {Table} from 'react-bootstrap';
import {
    checkFilterEntityType,
    checkMultipleFilterEntityType,
    displayBodyHeader,
    getOrganTypeFullName,
    getStatusColor
} from "./js/functions";
import Badge from 'react-bootstrap/Badge';
import AppContext from "../../context/AppContext";

const DefaultTableResults = ({isLoggedIn, hasMultipleEntityTypes = true}) => {
    return (
        <tr>
            <th>SenNet ID</th>
            {hasMultipleEntityTypes &&
                <th>Entity Type</th>
            }
            {isLoggedIn &&
                <th>Lab ID</th>
            }
            <th>Group</th>
        </tr>
    )
}

const DefaultTableRowDetails = ({isLoggedIn, result, urlField, hotlink, hasMultipleEntityTypes = true}) => {
    return (
        <tr tabIndex={0} className={`js-tr--${result.entity_type.raw}`}
            aria-label={`Open detail view of ${result.sennet_id.raw}`} key="results_detail"
            onClick={urlField != null ? () => urlField(this, result.uuid.raw) : () => window.location.href = hotlink}>
            <td>{result.sennet_id.raw}</td>
            {hasMultipleEntityTypes &&
                <td>{result.entity_type.raw}</td>
            }
            {isLoggedIn &&
                <td>
                    {
                        result.lab_tissue_sample_id ? <>{result.lab_tissue_sample_id.raw}</>
                            : result.lab_source_id ? <>{result.lab_source_id.raw}</>
                                : result.lab_dataset_id ? <>{result.lab_dataset_id.raw}</>
                                    : null
                    }
                </td>
            }
            <td>
                {result.group_name ? (
                    <>{result.group_name.raw}</>
                ) : null
                }
            </td>
        </tr>
    )
}

const TableResults = ({children, filters}) => {
    const {isLoggedIn} = useContext(AppContext)

    let hasMultipleEntityTypes = checkMultipleFilterEntityType(filters);

    return (
        <>
            <div className={styles.search_table_wrapper}>
                <Table responsive hover>
                    <thead className="results-header">

                    {filters.length > 0 ? (<>
                            {checkFilterEntityType(filters) === false ? (
                                DefaultTableResults({isLoggedIn})
                            ) : (<>
                                {filters.map((filter, index) => {
                                    if (filter.field === 'entity_type') {
                                        if (filter.values.length === 1 && filter.values[0] === 'Sample') {
                                            return (
                                                <tr key={index}>
                                                    <th>SenNet ID</th>
                                                    {hasMultipleEntityTypes &&
                                                        <th>Entity Type</th>
                                                    }
                                                    {isLoggedIn &&
                                                        <th>Lab ID</th>
                                                    }
                                                    <th>Category</th>
                                                    <th>Organ</th>
                                                    <th>Group</th>
                                                </tr>
                                            )
                                        }
                                        if (filter.values.length === 1 && filter.values[0] === 'Source') {
                                            return (
                                                // Table view for Source
                                                <tr key={index}>
                                                    <th>SenNet ID</th>
                                                    {hasMultipleEntityTypes &&
                                                        <th>Entity Type</th>
                                                    }
                                                    {isLoggedIn &&
                                                        <th>Lab ID</th>
                                                    }
                                                    <th>Type</th>
                                                    <th>Group</th>
                                                </tr>
                                            )
                                        } else if (filter.values.length === 1 && filter.values[0] === 'Dataset') {
                                            return (
                                                // Table view for Dataset
                                                <tr key={index}>
                                                    <th>SenNet ID</th>
                                                    {hasMultipleEntityTypes &&
                                                        <th>Entity Type</th>
                                                    }
                                                    {isLoggedIn &&
                                                        <th>Lab ID</th>
                                                    }
                                                    <th>Data Types</th>
                                                    <th>Organ</th>
                                                    <th>Status</th>
                                                    <th>Group</th>
                                                </tr>
                                            )
                                        } else {
                                            return (DefaultTableResults({isLoggedIn, hasMultipleEntityTypes}))
                                        }
                                    }
                                })}
                            </>)}
                        </>
                    ) : (DefaultTableResults({isLoggedIn}))}
                    </thead>
                    <tbody>
                    {children}
                    </tbody>
                </Table>
            </div>
        </>
    );
};


const TableRowDetail = ({result, urlField, titleField}) => {
    const {isLoggedIn} = useContext(AppContext)

    // The resultView property for the Results component only allows for specific properties to be set: https://docs.elastic.co/search-ui/api/react/components/results
    // We will override `urlField` to utilize onClick functionality (this will allow a user to select a source in the edit Sample page.
    // We will override `titleField` to pass the filters selected by the user to this
    var hotlink = "/" + result.entity_type.raw.toLowerCase() + "?uuid=" + result.uuid.raw
    let hasMultipleEntityTypes = checkMultipleFilterEntityType(titleField);
    console.log(result)
    return (
        <>
            {titleField.length > 0 ? (<>
                    {checkFilterEntityType(titleField) === false ? (
                        DefaultTableRowDetails({isLoggedIn, result, urlField, hotlink})
                    ) : (<>
                        {titleField.map((filter, index) => {
                            // Table results for Source
                            if (filter.field === 'entity_type') {
                                if (filter.values.length === 1 && filter.values[0] === 'Sample') {
                                    return (
                                        <tr key={index} tabIndex={0}
                                            aria-label={`Open detail view of ${result.sennet_id.raw}`}
                                            onClick={urlField != null ? () => urlField(this, result.uuid.raw) : () => window.location.href = hotlink}>
                                            <td>{result.sennet_id.raw}</td>
                                            {hasMultipleEntityTypes &&
                                                <td>{result.entity_type.raw}</td>
                                            }
                                            {isLoggedIn &&
                                                <td>
                                                    {
                                                        result.lab_tissue_sample_id ? <>{result.lab_tissue_sample_id.raw}</>
                                                            : result.lab_source_id ? <>{result.lab_source_id.raw}</>
                                                                : result.lab_dataset_id ? <>{result.lab_dataset_id.raw}</>
                                                                    : null
                                                    }
                                                </td>
                                            }
                                            <td>
                                                {result.sample_category ? (
                                                    <>{displayBodyHeader(result.sample_category.raw)}</>
                                                ) : null
                                                }
                                            </td>
                                            <td>
                                                {result?.origin_sample?.raw?.organ ? (
                                                    <>{getOrganTypeFullName(result.origin_sample.raw.organ)}</>
                                                ) : null
                                                }
                                            </td>
                                            <td>
                                                {result.group_name ? (
                                                    <>{result.group_name.raw}</>
                                                ) : null
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                                if (filter.values.length === 1 && filter.values[0] === 'Source') {
                                    return (
                                        <tr key={index} tabIndex={0}
                                            aria-label={`Open detail view of ${result.sennet_id.raw}`}
                                            onClick={urlField != null ? () => urlField(this, result.uuid.raw) : () => window.location.href = hotlink}>
                                            <td>{result.sennet_id.raw}</td>
                                            {hasMultipleEntityTypes &&
                                                <td>{result.entity_type.raw}</td>
                                            }
                                            {isLoggedIn &&
                                                <td>
                                                    {
                                                        result.lab_tissue_sample_id ? <>{result.lab_tissue_sample_id.raw}</>
                                                            : result.lab_source_id ? <>{result.lab_source_id.raw}</>
                                                                : result.lab_dataset_id ? <>{result.lab_dataset_id.raw}</>
                                                                    : null
                                                    }
                                                </td>
                                            }
                                            <td>
                                                {result.source_type ? (
                                                    <>{displayBodyHeader(result.source_type.raw)}</>
                                                ) : null
                                                }
                                            </td>

                                            <td>
                                                {result.group_name ? (
                                                    <>{result.group_name.raw}</>
                                                ) : null
                                                }
                                            </td>
                                        </tr>
                                    )
                                } else if (filter.values.length === 1 && filter.values[0] === 'Dataset') {
                                    // Table results for Dataset
                                    return (
                                        <tr key={index} tabIndex={0}
                                            aria-label={`Open detail view of ${result.sennet_id.raw}`}
                                            onClick={urlField != null ? () => urlField(this, result.uuid.raw) : () => window.location.href = hotlink}>
                                            <td>{result.sennet_id.raw}</td>
                                            {hasMultipleEntityTypes &&
                                                <td>{result.entity_type.raw}</td>
                                            }
                                            {isLoggedIn &&
                                                <td>
                                                    {
                                                        result.lab_tissue_sample_id ? <>{result.lab_tissue_sample_id.raw}</>
                                                            : result.lab_source_id ? <>{result.lab_source_id.raw}</>
                                                                : result.lab_dataset_id ? <>{result.lab_dataset_id.raw}</>
                                                                    : null
                                                    }
                                                </td>
                                            }
                                            <td>
                                                {result.data_types ? (
                                                    <>{result.data_types.raw}</>
                                                ) : null
                                                }
                                            </td>
                                            <td>
                                                {result?.origin_sample?.raw?.organ ? (
                                                    <>{getOrganTypeFullName(result.origin_sample.raw.organ)}</>
                                                ) : null
                                                }
                                            </td>
                                            <td>
                                                {result.status ? (
                                                    <Badge pill
                                                           bg={getStatusColor(result.status.raw)}>{result.status.raw}</Badge>
                                                ) : null
                                                }
                                            </td>
                                            <td>
                                                {result.group_name ? (
                                                    <>{result.group_name.raw}</>
                                                ) : null
                                                }
                                            </td>
                                        </tr>
                                    )
                                } else {
                                    return (DefaultTableRowDetails({
                                        isLoggedIn,
                                        result,
                                        urlField,
                                        hotlink,
                                        hasMultipleEntityTypes
                                    }))
                                }
                            }
                        })}
                    </>)}
                </>
            ) : (DefaultTableRowDetails({isLoggedIn, result, urlField, hotlink}))}
        </>
    );
};


export {DefaultTableResults, DefaultTableRowDetails, TableResults, TableRowDetail};