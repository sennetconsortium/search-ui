import PropTypes from "prop-types";
import {displayBodyHeader, equals, getStatusColor, getStatusDefinition, getUBKGFullName} from "../../js/functions";
import React, {Fragment, useContext} from "react";
import AppContext from "../../../../context/AppContext";
import SenNetPopover from "../../../SenNetPopover";
import StatusError from "../../../StatusError";

function ViewHeaderBadges({data, uniqueHeader, isMetadataHeader, hasWritePrivilege}) {
    const {cache} = useContext(AppContext)

    return (
        <Fragment>
            {isMetadataHeader ? (
                <Fragment>
                    <h5 className={"title_badge"}>
                        <a className={`badge bg-${data.entity_type.toLowerCase()}`}
                           href={`/${data.entity_type.toLowerCase()}?uuid=${data.uuid}`}>{displayBodyHeader(data.sennet_id)}</a>
                    </h5>

                    {!equals(data.entity_type, cache.entities.dataset) ? (
                        <Fragment>
                            <h5 className={"title_badge"}>
                                <span className="badge bg-secondary ms-2">
                                    {displayBodyHeader(data.entity_type)}
                                </span>
                            </h5>

                            {data.sample_category &&
                                <h5 className={"title_badge"}>
                                    <span className="badge bg-secondary ms-2">
                                        {displayBodyHeader(data.sample_category)}
                                    </span>
                                </h5>
                            }

                            {data.source_type &&
                                <h5 className={"title_badge"}>
                                    <span className="badge bg-secondary ms-2">
                                        {displayBodyHeader(data.source_type)}
                                    </span>
                                </h5>
                            }
                        </Fragment>
                    ) : (
                        <h5 className={"title_badge"}>
                            <span className="badge bg-secondary ms-2">
                                    {getUBKGFullName(data.data_types[0])}
                            </span>
                        </h5>
                    )
                    }
                </Fragment>) : (
                <Fragment>
                    {data.origin_sample &&
                        <h5 className={"title_badge"}>
                            <span className="badge bg-secondary">
                                {displayBodyHeader(getUBKGFullName(data.origin_sample.organ))}
                            </span>
                        </h5>
                    }
                    {data.source_type &&
                        <h5 className={"title_badge"}>
                            <span className="badge bg-secondary ms-2">
                                {displayBodyHeader(data.source_type)}
                            </span>
                        </h5>

                    }
                    {uniqueHeader &&
                        <h5 className={"title_badge"}>
                            <span className="badge bg-secondary ms-2">
                                    {getUBKGFullName(uniqueHeader)}
                            </span>
                        </h5>
                    }
                    {data.status &&
                        <h5 className={"title_badge"}>
                        <span className={`badge ${getStatusColor(data.status)} ms-2`}>

                        {(data.status === 'Invalid' || data.status === 'Error') && hasWritePrivilege ?
                            (
                                <StatusError text={data.status} className={"error-popover"}
                                             error={data.pipeline_message ? data.pipeline_message : data.validation_message}/>
                            ) : (
                                <SenNetPopover text={getStatusDefinition(data.status)} className={'status-info'}>
                                    {displayBodyHeader(data.status)}
                                </SenNetPopover>
                            )}
                        </span>

                        </h5>
                    }
                </Fragment>
            )
            }

            {data?.doi_url &&
                <h5 className={"title_badge"}>
                            <span className={`${getStatusColor(data.status)} badge ms-2`}>
                                DOI: <a href={data.doi_url} className={"icon_inline"} style={{color: 'white'}}>{data.registered_doi}</a>
                            </span>
                </h5>
            }

        </Fragment>
    )
}

ViewHeaderBadges.propTypes = {
    data: PropTypes.object.isRequired,
    uniqueHeader: PropTypes.string,
    isMetadataHeader: PropTypes.bool
}

export {ViewHeaderBadges}