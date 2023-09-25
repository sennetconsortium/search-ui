import {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'react-bootstrap/Dropdown'
import AppContext from "../../../../context/AppContext";
import {getEntityEndPoint} from "../../../../config/config";
import {getEntityViewUrl} from "../../js/functions";
import Select from 'react-select'

function VersionsDropdown({data}) {

    const {_t, cache } = useContext(AppContext)
    const [revisions, setRevisions] = useState([
        {
            rev: 1,
            uuids: ['A', 'B']
        },
        {
            rev: 2,
            uuids: ['C', 'D']
        },
        {
            rev: 3,
            uuids: ['D']
        }])
    const [isBusy, setIsBusy] = useState(false)

    useEffect(() => {
        // const fetchRevisions = async () => {
        //     setIsBusy(true)
        //     let response = await fetch(getEntityEndPoint() + `datasets/${data.uuid}/revisions?include_dataset=true`)
        //     if (response.ok) {
        //         let json = await response.json()
        //         setRevisions(json)
        //     }
        //     setIsBusy(false)
        // }
        //
        // fetchRevisions()
    }, [])

    const buildOptions = (r) => {
        let results = []
        for (let s of r.uuids) {
            results.push({value: s, label: s})
        }
        return results
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
                // <Dropdown.Item active={getActive(r)} key={`version-${r.rev}`} href='#' onClick={(e) => e.preventDefault()}>
                //
                // </Dropdown.Item>
                <div key={`version-${r.rev}`} className={'p-2'}><Select placeholder={`Revision ${r.rev}`} options={buildOptions(r)} /></div>
            )
        }
        return results;
    }

    const getActiveRevision = () => {

        return 1
        for (let r of revisions) {
            if (data.uuid === r.uuid) {
                return r.revision_number
            }
        }
    }

    if (isBusy || (!isBusy && revisions.length <= 0)) {
        return <></>
    }

    return (
        <Dropdown>
            <Dropdown.Toggle  id="dropdown-basic">
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