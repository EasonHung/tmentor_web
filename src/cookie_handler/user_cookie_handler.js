import Cookies from "js-cookie";

export function setUserIdAndToken(userId, userToken, refreshToken) {
    Cookies.set('userId', userId)
    Cookies.set('userToken', userToken)
    Cookies.set('refreshToken', refreshToken)
}

export function getUserId() {
    return Cookies.get('userId')
}

export function getUserToken() {
    return Cookies.get('userToken')
}

export function getUserRefreshToken() {
    return Cookies.get('refreshToken')
}

export function setUserTokens(userToken, userRefreshToken) {
    Cookies.set('userToken', userToken)
    Cookies.set('refreshToken', userRefreshToken)
}