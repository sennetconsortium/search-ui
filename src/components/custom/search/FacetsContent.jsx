import Facets from 'search-ui/components/core/Facets'
import { useSearchUIContext } from "search-ui/components/core/SearchUIContext";

function FacetsContent({ transformFunction }) {
    const { wasSearched } = useSearchUIContext()

    return <>{wasSearched && <Facets transformFunction={transformFunction} />}</>
}

export default FacetsContent
