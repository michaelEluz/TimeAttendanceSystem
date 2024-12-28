import { ApiUtils } from "../ApiUtils"

const CLOCK_OUT_END_POINT = '/clockout'

export const UserPostClockOut = {
    postClockOut: (username,berlinDate,clockOut) => {
        const data={
            username:username,
            date:berlinDate,
            clockOut:clockOut

        }
        console.log("Post Clock Out",username,berlinDate,clockOut);
        return ApiUtils.post(CLOCK_OUT_END_POINT,data);
    }
};
