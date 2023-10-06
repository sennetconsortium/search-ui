import {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'react-bootstrap/Dropdown'
import AppContext from "../../../../context/AppContext";
import {getEntityEndPoint} from "../../../../config/config";
import {getEntityViewUrl} from "../../js/functions";
import Select from 'react-select'
import {get_headers} from "../../../../lib/services";

function VersionsDropdown({data}) {

    const {_t, cache } = useContext(AppContext)
    const [revisions, setRevisions] = useState([])
    const [isBusy, setIsBusy] = useState(false)

    useEffect(() => {
        const fetchRevisions = async () => {
            setIsBusy(true)
            const options = {
                method: 'GET',
                headers: get_headers()
            }
            const url = getEntityEndPoint() + `datasets/${data.uuid}/multi-revisions?include_dataset=true`
            let response = await fetch(url, options)
            if (response.ok) {
                console.log(url)
                let json = await response.json()
                setRevisions(json)
            }
            setIsBusy(false)
        }

        fetchRevisions()
    }, [])

    const buildOptions = (r) => {
        let results = []
        for (let s of r.uuids) {
            results.push({value: s.uuid, label: s.sennet_id, revision: r})
        }
        return results
    }

    const handleChange = (e) => {
        window.location = getEntityViewUrl(cache.entities.dataset, e.value, {isEdit: false})
    }


    const buildRevisions = () => {
        let results = [];
        const setUrl = (_entity) => {
            if (data.uuid === _entity.uuid) return '#'
            return getEntityViewUrl(cache.entities.dataset, _entity.uuid, {isEdit: false})
        }

        const getActive = (_entity) => setUrl(_entity) === '#' ? true : null

        for (let r of revisions) {
            results.push(
                <div key={`version-${r.revision_number}`} className={`p-2`}><Select className={`revisions-select ${r.revision_number == getActiveRevision() ? 'is-active' : ''}`} onChange={handleChange} placeholder={`Revision ${r.revision_number}`} options={buildOptions(r)} /></div>
            )
        }
        return results;
    }

    const getActiveRevision = () => {

        for (let rev of revisions) {
            for (let e of rev.uuids) {
                if (data.uuid === e.uuid) {
                    return rev.revision_number
                }
            }
        }
    }

    if (isBusy || (!isBusy && revisions.length <= 0)) {
        return <></>
    }

    return (
        <Dropdown>
            <Dropdown.Toggle  id="multi-revisions-dropdown">
                Revision {getActiveRevision()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {buildRevisions()}
            </Dropdown.Menu>
        </Dropdown>
    )
}

VersionsDropdown.defaultProps = {}

VersionsDropdown.propTypes = {
    data: PropTypes.object
}

export default VersionsDropdown