import { ApiUtils } from "../ApiUtils"

const TIME_END_POINT = '/time'

export const UserGetTimeApi = {
    getCurrentTime: () => {
        console.log("getting time:");
        return ApiUtils.get(TIME_END_POINT);
    }
};
