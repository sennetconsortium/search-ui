import React from 'react';
import styles from './style.module.css'
import {Table} from 'react-bootstrap';
import {getStatusColor} from "./js/functions";
import Badge from 'react-bootstrap/Badge';


const DefaultTableResults = ({children}) => {
    return (
        <div key="results_table" className={styles.search_table_wrapper}>
            <Table responsive hover>
                <thead>
                <tr>
                    <th>Created By</th>
                    <th>SenNet ID</th>
                    <th>Lab ID</th>
                    <th>Category</th>
                    <th>Group</th>
                    <th>Created By</th>
                </tr>
                </thead>
                <tbody>
                {children}
                </tbody>
            </Table>
        </div>
    )
}

const DefaultTableRowDetails = ({result, urlField, hotlink}) => {
    return (
        <tr key="results_detail"
            onClick={urlField != null ? () => urlField(this, result.uuid.raw) : () => window.location.href = hotlink}>
            <td>{result.created_by_user_displayname.raw}</td>
            <td>{result.sennet_id.raw}</td>
            <td>
                {result.lab_tissue_sample_id ? (
                    <>{result.lab_tissue_sample_id.raw}</>
                ) : null
                }
            </td>
            <td>
                {result.sample_category ? (
                    <>{result.sample_category.raw}</>
                ) : null
                }
            </td>
            <td>
                {result.group_name ? (
                    <>{result.group_name.raw}</>
                ) : null
                }
            </td>
            <td>{result.created_by_user_email.raw}</td>
        </tr>
    )
}

const TableResults = ({children, filters}) => {
    return (
        <>
            {filters.length > 0 ? (<>
                    {filters.map((filter, index) => {
                        if (filter.field === 'entity_type' && filter.values.length === 1 && filter.values[0] === 'Source') {
                            return (
                                // Table view for Source
                                <div key={`source_${index}`} className={styles.search_table_wrapper}>
                                    <Table responsive hover>
                                        <thead>
                                        <tr>
                                            <th>SenNet ID</th>
                                            <th>Group</th>
                                            <th>Type</th>
                                            {/*<th>Age</th>*/}
                                            {/*<th>BMI</th>*/}
                                            {/*<th>Sex</th>*/}
                                            {/*<th>Race</th>*/}
                                            <th>Last Modified</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {children}
                                        </tbody>
                                    </Table>
                                </div>
                            )
                        } else if (filter.field === 'entity_type' && filter.values.length === 1 && filter.values[0] === 'Dataset') {
                            return (
                                // Table view for Dataset
                                <div key={`dataset_${index}`} className={styles.search_table_wrapper}>
                                    <Table responsive hover>
                                        <thead>
                                        <tr>
                                            <th>SenNet ID</th>
                                            <th>Group</th>
                                            <th>Data Types</th>
                                            <th>Organ</th>
                                            <th>Status</th>
                                            <th>Last Modified</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {children}
                                        </tbody>
                                    </Table>
                                </div>
                            )
                        } else {
                            return (DefaultTableResults({children}))
                        }
                    })}
                </>
            ) : (DefaultTableResults({children}))}
        </>
    );
};


const TableRowDetail = ({result, urlField, titleField}) => {
    // The resultView property for the Results component only allows for specific properties to be set: https://docs.elastic.co/search-ui/api/react/components/results
    // We will override `urlField` to utilize onClick functionality (this will allow a user to select a source in the edit Sample page.
    // We will override `titleField` to pass the filters selected by the user to this
    var hotlink = "/" + result.entity_type.raw.toLowerCase() + "?uuid=" + result.uuid.raw
    // console.log(result)
    return (
        <>
            {titleField.length > 0 ? (<>
                    {titleField.map((filter, index) => {
                        // Table results for Source
                        if (filter.field === 'entity_type' && filter.values.length === 1 && filter.values[0] === 'Source') {
                            return (
                                <tr key={index}
                                    onClick={urlField != null ? () => urlField(this, result.uuid.raw) : () => window.location.href = hotlink}>
                                    <td>{result.sennet_id.raw}</td>
                                    <td>
                                        {result.group_name ? (
                                            <>{result.group_name.raw}</>
                                        ) : null
                                        }
                                    </td>
                                    <td>
                                        {result.source_type ? (
                                            <>{result.source_type.raw}</>
                                        ) : null
                                        }
                                    </td>
                                    {/*<td>*/}
                                    {/*    {result.mapped_metadata && result.mapped_metadata.raw.age_value ? (*/}
                                    {/*        <>{result.mapped_metadata.raw.age_value[0]}</>*/}
                                    {/*    ) : null*/}
                                    {/*    }*/}
                                    {/*</td>*/}
                                    {/*<td>*/}
                                    {/*    {result.mapped_metadata && result.mapped_metadata.raw.body_mass_index_value ? (*/}
                                    {/*        <>{result.mapped_metadata.raw.body_mass_index_value[0]}</>*/}
                                    {/*    ) : null*/}
                                    {/*    }*/}
                                    {/*</td>*/}
                                    {/*<td>*/}
                                    {/*    {result.mapped_metadata && result.mapped_metadata.raw.sex ? (*/}
                                    {/*        <>{result.mapped_metadata.raw.sex[0]}</>*/}
                                    {/*    ) : null*/}
                                    {/*    }*/}
                                    {/*</td>*/}
                                    {/*<td>*/}
                                    {/*    {result.mapped_metadata && result.mapped_metadata.raw.race ? (*/}
                                    {/*        <>{result.mapped_metadata.raw.race[0]}</>*/}
                                    {/*    ) : null*/}
                                    {/*    }*/}
                                    {/*</td>*/}

                                    <td>{new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    }).format(result.last_modified_timestamp.raw)}</td>
                                </tr>
                            )
                        } else if (filter.field === 'entity_type' && filter.values.length === 1 && filter.values[0] === 'Dataset') {
                            // Table results for Dataset
                            return (
                                <tr key={index}
                                    onClick={urlField != null ? () => urlField(this, result.uuid.raw) : () => window.location.href = hotlink}>
                                    <td>{result.sennet_id.raw}</td>
                                    <td>
                                        {result.group_name ? (
                                            <>{result.group_name.raw}</>
                                        ) : null
                                        }
                                    </td>
                                    <td>
                                        {result.data_types ? (
                                            <>{result.data_types.raw}</>
                                        ) : null
                                        }
                                    </td>
                                    <td>
                                        {result.origin_sample && result.origin_sample.raw.mapped_organ ? (
                                            <>{result.origin_sample.raw.mapped_organ}</>
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


                                    <td>{new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    }).format(result.last_modified_timestamp.raw)}</td>
                                </tr>
                            )
                        } else {
                            return (DefaultTableRowDetails({result, urlField, hotlink}))
                        }
                    })}
                </>
            ) : (DefaultTableRowDetails({result, urlField, hotlink}))}
        </>
    );
};


export {DefaultTableResults, DefaultTableRowDetails, TableResults, TableRowDetail};