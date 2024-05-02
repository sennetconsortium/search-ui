/**
 * Settings stored in local storage.
 * @typedef {Object} LocalSetting
 * @property {boolean} isExpanded - Whether the facet is expanded.
 */

function useLocalSettings() {
    /**
     * Retrieves a settings object from local storage.
     * The settings object is retrieved using a key that is a combination of the provided name and the string '.settings'.
     * The settings object is parsed from a JSON string to an object before being returned.
     * If no settings object is found, an empty object is returned.
     *
     * @param {string} name - The name to use as the base of the storage key.
     * @return {Object<string,LocalSetting>} The retrieved settings object.
     */
    function getLocalSettings(name) {
        return JSON.parse(localStorage.getItem(`${name}.settings`)) || {}
    }

    /**
     * Stores a settings object in the local storage.
     * The settings object is stored under a key that is a combination of the provided name and the string '.settings'.
     * The settings object is converted to a JSON string before being stored.
     *
     * @param {string} name - The name to use as the base of the storage key.
     * @param {Object<string,LocalSetting>} settings - The settings object to store. The key is the facet name and the value is the settings object.
     */
    function setLocalSettings(name, settings) {
        localStorage.setItem(`${name}.settings`, JSON.stringify(settings))
    }

    return {getLocalSettings, setLocalSettings}
}

export default useLocalSettings
