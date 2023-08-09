import { getUserId } from "../cookie_handler/user_cookie_handler";

const userApiBaseUrl = "https://tmentor.xyz/user_system"

export async function LoginByThirdParty(thirdPartyId, thirdPartyAccessToken) {
    const response = await fetch(userApiBaseUrl + '/user/thirdParty/login',{
        method: 'POST',
        body: JSON.stringify({
            "thirdPartyId": thirdPartyId, 
            "thirdPartyAccessToken": thirdPartyAccessToken
        }),
    });

    const responseBody = await response.json()
    if(responseBody.code !== "0000") {
        throw new Error('login fail!');
    }

    return responseBody.data;
}

export async function refreshToken(refreshToken) {
    const response = await fetch(userApiBaseUrl + '/user/token/refresh', {
        method: 'POST',
        body: JSON.stringify({
            "userToken": refreshToken
        }),
    });

    const responseBody = await response.json()
    if(responseBody.code !== "0000") {
        throw new Error('server error!');
    }

    return responseBody.data
}

export async function getUserInfo() {
    const response = await fetch(userApiBaseUrl + '/userInfo/?userId=' + getUserId())

    const responseBody = await response.json()
    if(responseBody.code !== "0000") {
        throw new Error('server error!');
    }

    return responseBody.data
}