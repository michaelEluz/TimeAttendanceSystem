import { ApiUtils } from "../ApiUtils"

const ADMIN_END_POINT = '/admin'
const USER_EDIT_END_POINT = '/edit'
const DELETE_DATE_END_POINT = '/deletedate'



export const AdminApi = {
    sendAdmin: () => {
        console.log("Sending admin");
        return ApiUtils.get(ADMIN_END_POINT);
    },
    editSingleUser: ({username, date, clockIn, clockOut}) => {
        const data ={
            username: username, 
            date: date, 
            clockIn: clockIn, 
            clockOut: clockOut
        }
        console.log("editSingleUser", data);
        
        return ApiUtils.put(USER_EDIT_END_POINT,data);
    },
    deleteSingleDate: ({username, date}) => {
        const data ={
            username: username, 
            date: date
        }
        console.log("deleteSingleDate", data);
        
        return ApiUtils.put(DELETE_DATE_END_POINT,data);
    }

};
