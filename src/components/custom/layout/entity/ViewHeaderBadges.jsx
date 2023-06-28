import PropTypes from "prop-types";
import {displayBodyHeader, getStatusColor, getUBKGFullName} from "../../js/functions";
import React, {Fragment} from "react";

function ViewHeaderBadges({data, uniqueHeader, isMetadataHeader}) {
    return (
        <Fragment>
            {isMetadataHeader &&
                <Fragment>
                    {data.entity_type &&
                        <h5><span className="badge bg-secondary mx-2">
                            {displayBodyHeader(data.entity_type)}
                        </span>
                        </h5>
                    }
                    {data.sample_category &&
                        <h5><span className="badge bg-secondary">
                            {displayBodyHeader(data.sample_category)}
                        </span>
                        </h5>
                    }
                </Fragment>
            }


            {data.origin_sample &&
                <h5><span className="badge bg-secondary">
                            {displayBodyHeader(getUBKGFullName(data.origin_sample.organ))}
                        </span>
                </h5>
            }
            {data.source_type &&
                <h5><span className="badge bg-secondary">
                        {displayBodyHeader(data.source_type)}
                        </span>
                </h5>

            }
            {uniqueHeader &&
                <h5><span className="badge bg-secondary mx-2">
                            {getUBKGFullName(uniqueHeader)}
                         </span>
                </h5>
            }
            {data.status &&
                <h5><span className={`badge bg-${getStatusColor(data.status)}`}>
                                {displayBodyHeader(data.status)}
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