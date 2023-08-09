import { user_api_error_code } from "./error_code";
import { refreshToken } from "./user_api_handler";
import { getUserRefreshToken, setUserTokens, getUserToken, getUserId } from "../cookie_handler/user_cookie_handler";

const classroomApiBaseUrl = "https://tmentor.xyz/classroom"

export async function getClassroomList() {
    const response = await fetch(classroomApiBaseUrl + '/info/classroomList?userId=' + getUserId(), {
        headers: {
            authToken: getUserToken()
        }
    });

    const responseBody = await response.json()

    if(responseBody.code === user_api_error_code.tokenExpired) {
        const newTokens = await refreshToken(getUserRefreshToken())
        setUserTokens(newTokens.accessToken, newTokens.refreshToken)
        return getClassroomList()
    }
    if(responseBody.code !== "0000") {
        console.log(responseBody.code)
        throw new Error('get classroom list fail!');
    }

    return responseBody.data;
}

export async function getClassroomId() {
    const response = await fetch(classroomApiBaseUrl + "/info/userClassroomId?userId=" + getUserId(), {
        headers: {
            authToken: getUserToken()
        }
    })
    const responseBody = await response.json()

    if(responseBody.code === user_api_error_code.tokenExpired) {
        const newTokens = await refreshToken(getUserRefreshToken())
        setUserTokens(newTokens.accessToken, newTokens.refreshToken)
        return getClassroomId()
    }
    if(responseBody.code !== "0000") {
        console.log(responseBody.code)
        throw new Error('get classroom list fail!');
    }

    return responseBody.data
}

export async function getClassroomInfo(classroomId) {
    const response = await fetch(classroomApiBaseUrl + "/info/status?classroomId=" + classroomId)
    const responseBody = await response.json()

    if(responseBody.code !== "0000") {
        console.log(responseBody.code)
        throw new Error('get classroom status fail!');
    }

    return responseBody.data
}