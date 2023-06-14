import {deleteCookie, setCookie} from "cookies-next";
import {Sui} from "search-ui/lib/search-tools";

export function deleteCookies() {
    setCookie('isAuthenticated', false)
    deleteCookie('groups_token')
    deleteCookie('info')
    deleteCookie('user')
    deleteCookie('adminUIAuthorized')
    localStorage.removeItem('userPage')
    Sui.clearFilters()
}