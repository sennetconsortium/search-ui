import VignetteItem from '@/components/custom/vitessce/VignetteItem'
import { getJSONFromAssetsEndpoint } from '@/lib/services'
import log from 'loglevel'
import { useEffect, useState } from 'react'
import Spinner from '../Spinner'

function VignetteList({ publication, ancillaryPublication }) {
    const [loading, setLoading] = useState(true)
    const [vignettesData, setVignettesData] = useState([])

    useEffect(() => {
        const fetchVignettesData = async (uuid) => {
            log.debug('==== Fetching vignettes data')
            // ancillaryPublication should have a json config file
            const fileName = ancillaryPublication.ingest_metadata.files[0].rel_path
            const path = `${uuid}/${fileName}`
            const publicationAncillaryConfig = await getJSONFromAssetsEndpoint(path)

            // TODO: handle error
            if (publicationAncillaryConfig instanceof Error) {
                log.error('Error fetching publication ancillary config', publicationAncillaryConfig)
                return
            }

            // vignettes aren't necessarily in order, adding an id makes it easier to sort
            // and do other things
            const vignettes = publicationAncillaryConfig.vignettes
                .map((vignette) => {
                    // this assumes directory_name looks like 'vignette_1', 'vignette_2', etc.
                    const id = parseInt(vignette.directory_name.match(/[0-9]+/), 10)
                    return {
                        ...vignette,
                        id: id
                    }
                })
                .sort((a, b) => a.id - b.id)

            setVignettesData(vignettes)
            setLoading(false)
        }

        if (ancillaryPublication) {
            fetchVignettesData(ancillaryPublication.uuid)
        }
    }, [ancillaryPublication])

    return (
        <div className='mb-4'>
            {!loading &&
                vignettesData.length > 0 &&
                vignettesData.map((v) => (
                    <VignetteItem key={v.id} publication={{ uuid: publication.uuid }} vignette={v} />
                ))}
            {!loading && vignettesData.length < 1 && <div>No vignettes available</div>}
            {loading && <Spinner />}
        </div>
    )
}

export default VignetteList
