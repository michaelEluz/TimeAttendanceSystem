import { ApiUtils } from "../ApiUtils"

const CLOCK_IN_END_POINT = '/clockin'

export const UserPostClockIn = {
    postClockIn: (username,berlinDate,clockIn) => {
        const data={
            username:username,
            date:berlinDate,
            clockIn:clockIn

        }
        console.log("Post Clock In",username,berlinDate,clockIn);
        return ApiUtils.post(CLOCK_IN_END_POINT,data);
    }
};
