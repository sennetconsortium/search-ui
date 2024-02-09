import PropTypes from "prop-types";
import {displayBodyHeader, eq, getStatusColor, getStatusDefinition, getUBKGFullName} from "../../js/functions";
import React, {Fragment, useContext} from "react";
import AppContext from "../../../../context/AppContext";
import SenNetPopover from "../../../SenNetPopover";
import StatusError from "../../../StatusError";
import Link from "next/link";
import {APP_ROUTES} from "../../../../config/constants";
import {organDetails} from "../../../../config/organs";
import ClipboardCopy from "../../../ClipboardCopy";

function ViewHeaderBadges({data, uniqueHeader, uniqueHeaderUrl, isMetadataHeader, hasWritePrivilege}) {
    const {cache} = useContext(AppContext)

    const getOrganRoute = (ruiCode) => {
        return `${APP_ROUTES.organs}/${organDetails[ruiCode].urlParamName}`
    }

    return (
        <Fragment>
            {isMetadataHeader ? (
                <Fragment>
                    <h5 className={"title_badge"}>
                        <a className={`badge bg-${data.entity_type.toLowerCase()} me-2`}
                           href={`/${data.entity_type.toLowerCase()}?uuid=${data.uuid}`}>{displayBodyHeader(data.sennet_id)}</a>
                    </h5>

                    {!eq(data.entity_type, cache.entities.dataset) ? (
                        <Fragment>
                            <h5 className={"title_badge"}>
                                <span className="badge bg-secondary me-2">
                                    {displayBodyHeader(data.entity_type)}
                                </span>
                            </h5>

                            {data.sample_category &&
                                <h5 className={"title_badge"}>
                                    <span className="badge bg-secondary me-2">
                                        {displayBodyHeader(data.sample_category)}
                                    </span>
                                </h5>
                            }

                            {data.source_type &&
                                <h5 className={"title_badge"}>
                                    <span className="badge bg-secondary me-2">
                                        {displayBodyHeader(data.source_type)}
                                    </span>
                                </h5>
                            }
                        </Fragment>
                    ) : (
                        <h5 className={"title_badge"}>
                            <span className="badge bg-secondary me-2">
                                    {getUBKGFullName(data.dataset_type)}
                            </span>
                        </h5>
                    )
                    }
                </Fragment>) : (
                <Fragment>
                    {data.origin_sample &&
                        <Link href={getOrganRoute(data.origin_sample.organ)}>
                            <h5 className={"title_badge"}>
                                <span className="badge bg-secondary me-2">
                                    {displayBodyHeader(getUBKGFullName(data.origin_sample.organ))}
                                </span>
                            </h5>
                        </Link>
                    }
                    {data.source_type &&
                        <h5 className={"title_badge"}>
                            <span className="badge bg-secondary me-2">
                                {displayBodyHeader(data.source_type)}
                            </span>
                        </h5>

                    }
                    {uniqueHeader && !uniqueHeaderUrl &&
                        <h5 className={"title_badge"}>
                            <span className="badge bg-secondary me-2">
                                {getUBKGFullName(uniqueHeader)}
                            </span>
                        </h5>
                    }
                    {uniqueHeader && uniqueHeaderUrl &&
                        <Link href={uniqueHeaderUrl}>
                            <h5 className={"title_badge"}>
                                <span className="badge bg-secondary me-2">
                                    {getUBKGFullName(uniqueHeader)}
                                </span>
                            </h5>
                        </Link>
                    }
                    {data.status &&
                        <h5 className={"title_badge"}>
                        <span className={`badge ${getStatusColor(data.status)} me-2`}>

                        {(data.status === 'Invalid' || data.status === 'Error') && hasWritePrivilege ?
                            (
                                <StatusError text={data.status}
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
                            <span className={`${getStatusColor(data.status)} badge`}>
                                DOI: <a href={data.doi_url} className={'lnk--nodecor'} style={{color: 'white'}}>{data.registered_doi}</a>
                                &nbsp;<ClipboardCopy text={data.registered_doi} className={'lnk--white'} />
                            </span>
                </h5>
            }

        </Fragment>
    )
}

ViewHeaderBadges.propTypes = {
    data: PropTypes.object.isRequired,
    uniqueHeader: PropTypes.string,
    uniqueHeaderUrl: PropTypes.string,
    isMetadataHeader: PropTypes.bool
}

export {ViewHeaderBadges}