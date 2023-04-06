import React, {useContext} from 'react'
import AppContext from '../../../../context/AppContext'
import {Button} from 'react-bootstrap';
import {FiletypeJson} from 'react-bootstrap-icons';
import {displayBodyHeader, getOrganTypeFullName, getStatusColor} from "../../js/functions";
import {ENTITIES} from "../../../../config/constants";
import PropTypes from 'prop-types'

const EntityViewHeaderButtons = ({entity, data, hasWritePrivilege}) => {
    const {_t} = useContext(AppContext)
    return (
        <div>
            {hasWritePrivilege &&
                <Button aria-label={`Edit ${ENTITIES[entity]}`} className="js-btn--edit"
                        href={`/edit/${entity}?uuid=${data.uuid}`}
                        variant="outline-primary rounded-0">{_t('Edit')}</Button>}{' '}
            <Button target='_blank' aria-label={`View JSON of the ${ENTITIES[entity]}`} className="ms-3 js-btn--json"
                    href={`/api/json/${entity}?uuid=${data.uuid}`}
                    variant="outline-primary rounded-0"><FiletypeJson/></Button>
        </div>
    )
}

EntityViewHeaderButtons.propTypes = {
    entity: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    hasWritePrivilege: PropTypes.bool.isRequired
}

function EntityViewHeader({entity, data, hasWritePrivilege, uniqueHeader}) {
    const {_t} = useContext(AppContext)
    return (
        <div style={{width: '100%'}}>
            <h4>{ENTITIES[entity]}</h4>
            <h3>{data.sennet_id}</h3>
            <div className="row mb-2">
                <div className="col-md-6 col-sm-12 entity_subtitle icon_inline">
                    {data.origin_sample &&
                        <h5><span className="badge bg-secondary">
                            {displayBodyHeader(getOrganTypeFullName(data.origin_sample.organ))}
                        </span></h5>
                    }
                    {data.source_type &&
                        <h5><span className="badge bg-secondary">
                        {displayBodyHeader(data.source_type)}
                        </span></h5>

                    }
                    {uniqueHeader &&
                        <h5><span className="badge bg-secondary mx-2">
                            {displayBodyHeader(uniqueHeader)}
                         </span></h5>
                    }
                    {data.status &&
                        <h5><span className={`badge bg-${getStatusColor(data.status)}`}>
                                {displayBodyHeader(data.status)}
                                    </span></h5>
                    }
                </div>

                <div className="col-md-6 col-sm-12">
                    <div className="entity_subtitle icon_inline float-md-end">
                        <EntityViewHeaderButtons data={data} entity={entity} hasWritePrivilege={hasWritePrivilege}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

EntityViewHeader.propTypes = {
    entity: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    hasWritePrivilege: PropTypes.bool.isRequired
}

export {EntityViewHeader, EntityViewHeaderButtons}