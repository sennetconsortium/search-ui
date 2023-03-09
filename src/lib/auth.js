import {deleteCookie, setCookie} from "cookies-next";

export function deleteCookies() {
    setCookie('isAuthenticated', false)
    deleteCookie('groups_token')
    deleteCookie('info')
    deleteCookie('user')
    deleteCookie('adminUIAuthorized')
    localStorage.removeItem('userPage')
}