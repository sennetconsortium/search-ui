import {deleteCookie, setCookie} from "cookies-next";
import {Sui} from "search-ui/lib/search-tools";
import {getCookieDomain} from "../config/config";

export function deleteCookies() {
    setCookie('isAuthenticated', false)
    deleteCookie('groups_token')
    deleteCookie('info', {path: '/', domain: getCookieDomain()})
    deleteCookie('user')
    deleteCookie('adminUIAuthorized')
    localStorage.removeItem('userPage')
    Sui.clearFilters()
}