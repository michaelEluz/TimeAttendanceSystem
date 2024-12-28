import { ApiUtils } from "../ApiUtils"

const NEW_USER_END_POINT = '/newuser'

export const NewUserApi = {
    postNewUser: (username,password) => {
        const data={
            username:username,
            password:password

        }
        console.log("Post new user",username,password);
        return ApiUtils.post(NEW_USER_END_POINT,data);
    }
};
