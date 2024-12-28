import { ApiUtils } from "../ApiUtils"

const USER_END_POINT = '/user'

export const UserApi = {
    sendUser: (userName) => {
        console.log("Sending username:", userName);
        return ApiUtils.get(USER_END_POINT, { username: userName });
    }
};
