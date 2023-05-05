import {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'react-bootstrap/Dropdown'
import AppContext from "../../../../context/AppContext";
import {getEntityEndPoint} from "../../../../config/config";
import {getEntityViewUrl} from "../../js/functions";

function VersionDropdown({data, hasWritePrivilege}) {

    const {_t, cache } = useContext(AppContext)
    const [revisions, setRevisions] = useState([])
    const [isBusy, setIsBusy] = useState(false)

    useEffect(() => {
        const fetchRevisions = async () => {
            setIsBusy(true)
            let response = await fetch(getEntityEndPoint() + `datasets/${data.uuid}/revisions?include_dataset=true`)
            if (response.ok) {
                let json = await response.json()
                setRevisions(json)
            }
            setIsBusy(false)
        }

        fetchRevisions()
    }, [])

    const buildRevisions = () => {
        let results = [];
        const setUrl = (_entity) => {
            if (data.uuid === _entity.uuid) return '#'
            return getEntityViewUrl(cache.entities.dataset, _entity.uuid)
        }

        for (let r of revisions) {
            results.push(
                <Dropdown.Item active={setUrl(r) === '#' ? true : null} key={`version-${r.revision_number}`} href={setUrl(r)}
                               title={r.dataset.sennet_id}>Version {r.revision_number}</Dropdown.Item>
            )
        }
        return results;
    }

    if (isBusy || (!isBusy && revisions.length <= 0)) {
        return <></>
    }

    return (
        <Dropdown>
            <Dropdown.Toggle  id="dropdown-basic">
                Version {revisions.length}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {buildRevisions()}
            </Dropdown.Menu>
        </Dropdown>
    )
}

VersionDropdown.defaultProps = {}

VersionDropdown.propTypes = {
    data: PropTypes.object
}

export default VersionDropdown