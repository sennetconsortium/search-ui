import { useContext } from 'react'
import Facets from 'search-ui/components/core/Facets'
import SearchUIContext from 'search-ui/components/core/SearchUIContext'

function FacetsContent({ transformFunction }) {
    const { wasSearched } = useContext(SearchUIContext)

    return <>{wasSearched && <Facets transformFunction={transformFunction} />}</>
}

export default FacetsContent
