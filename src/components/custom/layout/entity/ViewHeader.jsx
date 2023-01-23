import React, { useContext } from 'react'
import AppContext from '../../../../context/AppContext'
import {Button} from 'react-bootstrap';
import {FiletypeJson} from 'react-bootstrap-icons';
import {displayBodyHeader, getOrganTypeFullName} from "../../js/functions";
import {ENTITIES} from "../../../../config/constants";
import PropTypes from 'prop-types'

const EntityViewHeaderButtons = ({entity, data, hasWritePrivilege}) => {
    const {_t } = useContext(AppContext)
    return (
        <div>
            {hasWritePrivilege &&
                <Button aria-label={`Edit ${ENTITIES[entity]}`} className="ms-3 js-btn--edit" href={`/edit/${entity}?uuid=${data.uuid}`}
                        variant="outline-primary rounded-0">{_t('Edit')}</Button>}{' '}
                <Button target='_blank' aria-label={`View JSON of the ${ENTITIES[entity]}`} className="ms-3 js-btn--json" href={`/api/json/${entity}?uuid=${data.uuid}`}
                    variant="outline-primary rounded-0"><FiletypeJson/></Button>
        </div>
    )
}

EntityViewHeaderButtons.propTypes = {
    entity: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    hasWritePrivilege: PropTypes.bool.isRequired
}

function EntityViewHeader({entity, data, hasWritePrivilege, idKey}) {
    const {_t } = useContext(AppContext)
    return (
        <div style={{width: '100%'}}>
            <h4>{ENTITIES[entity]}</h4>
            <h3>{data.sennet_id}</h3>
            <div className="d-flex justify-content-between mb-2">
                <div className="entity_subtitle link_with_icon">
                    {data.origin_sample &&
                        displayBodyHeader(getOrganTypeFullName(data.origin_sample.organ))
                    }
                    {data.source_type &&
                        displayBodyHeader(data.source_type)
                    }
                    {data[idKey] &&
                        <>
                            <span className="mx-2">|</span>
                            {data[idKey]}
                        </>
                    }
                </div>
                <EntityViewHeaderButtons data={data} entity={entity} hasWritePrivilege={hasWritePrivilege} />
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