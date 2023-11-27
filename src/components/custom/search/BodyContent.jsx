import { useContext } from 'react'
import { Results } from '@elastic/react-search-ui'
import SearchUIContext from 'search-ui/components/core/SearchUIContext'
import Spinner from '../Spinner'

function BodyContent({ view }) {
    const { wasSearched, filters, rawResponse } = useContext(SearchUIContext)

    return (
        <div
            className='js-gtm--results sui-resultsTable'
            data-js-ada='tableResults'
            data-ada-data='{"trigger": ".rdt_TableCell", "tabIndex": ".rdt_TableRow"}'
        >
            {wasSearched && <Results filters={filters} titleField={filters} rawResponse={rawResponse} view={view} />}
        </div>
    )
}

export default BodyContent
