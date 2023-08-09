import { getUserInfo } from "../../../api_handler/user_api_handler";

export async function fetchUserInfo(setUserInfo) {
    const userInfo = await getUserInfo()

    setUserInfo(userInfo)
}