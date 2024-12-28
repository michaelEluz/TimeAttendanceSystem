import { ApiUtils } from "../ApiUtils"

const LOGIN_END_POINT = '/login'

export const LoginApi = {
    sendLogin: (userName, password) => {
        console.log("userName, password", userName, password);
        
        const data = {
            username: userName,
            password: password,
          };
          
        return ApiUtils.post(LOGIN_END_POINT, data)
    }
}