import { LoginByThirdParty } from "../../../api_handler/user_api_handler";
import { setUserIdAndToken } from "../../../cookie_handler/user_cookie_handler";

export async function login(googleUser) {

    const googlerUserId = googleUser.getBasicProfile().getId()
    const googlerUserAccessToken = googleUser.getAuthResponse(true).access_token
    let tMentorUser

    try {
        tMentorUser = await LoginByThirdParty(googlerUserId, googlerUserAccessToken)
    } catch(e) {
        alert(e)
        return
    }

    if(tMentorUser.userStatus !== "student") {
        alert("please finish userInfo first")
        return
    }
    setUserIdAndToken(tMentorUser.userId, tMentorUser.accessToken, tMentorUser.refreshToken)
} 