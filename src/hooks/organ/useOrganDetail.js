import { getOrganByPath } from '@/config/organs'

/**
 * Custom hook to fetch and manage the details of a specific organ based on the url path name.
 *
 * @param {string} path - The url path.
 */
const useOrganDetail = (path) => {
    console.log('useOrganDetail', path)
    return {
        organDetail: getOrganByPath(path)
    }
}

export default useOrganDetail
