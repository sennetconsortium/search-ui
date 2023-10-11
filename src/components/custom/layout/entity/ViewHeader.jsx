import React, {useContext} from 'react'
import AppContext from '../../../../context/AppContext'
import {Button, Stack} from 'react-bootstrap';
import {FiletypeJson} from 'react-bootstrap-icons';
import {equals} from "../../js/functions";
import PropTypes from 'prop-types'
import ClipboardCopy from "../../../ClipboardCopy";
import {ViewHeaderBadges} from "./ViewHeaderBadges";
import SenNetPopover from "../../../SenNetPopover";
import VersionsDropdown from "./VersionsDropdown";

const EntityViewHeaderButtons = ({entity, data, hasWritePrivilege}) => {
    const {_t, cache} = useContext(AppContext)
    return (
        <div>
            <Stack direction="horizontal" gap={1}>
                {hasWritePrivilege &&
                    <SenNetPopover className={"edit-entity"}
                                   text={<>Make modifications to this entity.</>}>
                        <Button aria-label={`Edit ${cache.entities[entity]}`} className="js-btn--edit"
                                href={`/edit/${entity}?uuid=${data.uuid}`}
                                variant="outline-primary rounded-0">{_t('Edit')}</Button>
                    </SenNetPopover>
                }{' '}
                <SenNetPopover className={"view-entity"}
                               text={<>View the full JSON document of this entity.</>}>
                    <Button target='_blank' aria-label={`View JSON of the ${cache.entities[entity]}`}
                            className={`${hasWritePrivilege ? "mx-2" : ""} js-btn--json`}
                            href={`/api/json/${entity}?uuid=${data.uuid}`}
                            variant="outline-primary rounded-0"><FiletypeJson/></Button>
                </SenNetPopover>

                {equals(entity, cache.entities.dataset) && <VersionsDropdown data={data}/>}
            </Stack>

        </div>
    )
}

EntityViewHeaderButtons.propTypes = {
    entity: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    hasWritePrivilege: PropTypes.bool.isRequired
}

function EntityViewHeader({entity, data, hasWritePrivilege, uniqueHeader}) {
    const {_t, cache} = useContext(AppContext)

    return (
        <div style={{width: '100%'}}>
            {/*TODO: should ideally depend on ontology */}
            <h4>{cache.entities[entity] || entity.upperCaseFirst()}</h4>
            <h3>{data.sennet_id}
                <ClipboardCopy text={data.sennet_id}/>
            </h3>
            <div className="row mb-2">
                <div className="col-md-6 col-sm-12 entity_subtitle icon_inline">
                    <ViewHeaderBadges data={data} uniqueHeader={uniqueHeader}/>
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