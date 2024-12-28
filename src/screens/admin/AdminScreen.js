
import { useEffect, useState, useCallback, useRef } from "react";
import SimpleContainer from "../../components/simpleComponents/SimpleContainer";
import useHttpRequest from "../../hooks/useHttpRequest";
import { AdminApi } from "../../api/admin/AdminApi";
import SimplePopUp from "../../components/specializedComponents/popUp/SimplePopUp";
import SimpleInput from "../../components/simpleComponents/SimpleInput";
import { NewUserApi } from "../../api/admin/NewUserApi";
export const AdminScreenName = "/AdminScreen";

export default function AdminScreen() {
    const [singleDatePopupIsOpen, setSingleDatePopupIsOpen] = useState(false); // Entire admin data
    const [newUserPopupIsOpen, setnewUserPopupIsOpen] = useState(false); // Entire admin data
    const [userDetails, setUserDetails] = useState(null); // Entire admin data
    const [selectedUser, setSelectedUser] = useState(null); // Currently selected user
    const [errorMessage, setErrorMessage] = useState("");
    const [clickedDetails, setClickedDetails] = useState(null); // Entire admin data
    const [clickedIndex, setClickedIndex] = useState(null); // Entire admin data
    const [clockIn, setClockIn] = useState(null); // Entire admin data
    const [clockOut, setClockOut] = useState(null); // Entire admin data
    const [errorTryToSave, setErrorTryToSave] = useState("");
    const [errorTryToSaveNewUserApi, setErrorTryToSaveNewUserApi] = useState("");
   
    
    
    
    

    const [newUserName, setnewUserName] = useState(null);
    const [newPassword, setnewPassword] = useState(null);
    
    const { isPerforming, performRequest } = useHttpRequest(AdminApi.sendAdmin, onSuccess, onFailure);
    const { isPerforming:isNewUserIsPerforming, performRequest:addUser } = useHttpRequest(NewUserApi.postNewUser, onSuccessNewUser, onFailureNewUserApi);
    const { isPerforming: isEditUserIsPerforming, performRequest:editUser } = useHttpRequest(AdminApi.editSingleUser, onSuccessEdit, ()=>{});
    const { isPerforming: isdeleteSingleDateIsPerforming, performRequest:deleteSingleDate } = useHttpRequest(AdminApi.deleteSingleDate, onSuccessDelete, ()=>{});

    const [filterText, setFilterText] = useState("");
    const hasFetchedData = useRef(false);

    const fetchAdminData = useCallback(() => {
        if (!hasFetchedData.current) {
            hasFetchedData.current = true; // Prevent future calls
            performRequest();
        }
    }, [performRequest]);

    useEffect(() => {
        fetchAdminData();
    }, [fetchAdminData]);

    function onSuccess(data) {
        setUserDetails(data.data.data); // Extract data object containing user 
    }
    function onFailureNewUserApi(){
        setErrorTryToSaveNewUserApi(true)

    }
    function onFailure(error) {
        setErrorMessage(error);
    }

    const handleUserChange = (event) => {
        const userName = event.target.value;
        setSelectedUser(userDetails[userName]); // Select user details from the data        
    };

    function SaveButtonClicked() {
        if (!clockIn || !clockOut || !checkTimeFormat()) {
            setErrorTryToSave(true)
        } else {
            editUser({username:selectedUser.UserName, date:selectedUser.Dates[clickedIndex].date, clockIn:clockIn, clockOut:clockOut})
        }
    }

    function checkTimeFormat() {
        const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/; // Regex to validate HH:MM format
      
        return timeFormat.test(clockIn) && timeFormat.test(clockOut);
      }

    function onSuccessEdit() {
        setErrorTryToSave(false)
        const TempDates = selectedUser.Dates;
        TempDates[clickedIndex].clockIn = clockIn;
        TempDates[clickedIndex].clockOut = clockOut;
        setSingleDatePopupIsOpen(false);
        setSelectedUser(oldData =>  {
            return {...oldData, Dates: TempDates}
        })
    }
    function hundleNewUser(){
        setnewUserPopupIsOpen(true)
        console.log("New User Popup Open:", newUserPopupIsOpen);
    }
    function addUserNameButtonClicked(){
        addUser(newUserName,newPassword)
    }
    function onSuccessNewUser(){
        console.log("user added successfully")
        setErrorTryToSaveNewUserApi(false)
        setnewUserPopupIsOpen(false)
        setnewUserName("")
        setnewPassword("")
        performRequest()
    }
    const filteredDates = selectedUser?.Dates.filter((entry) =>
        entry.date.toLowerCase().includes(filterText.toLowerCase())
    );

    function handleDeleteDay(index, day) {
        console.log("username, day:",selectedUser.UserName,day.date)
        const updatedDates = [...selectedUser.Dates];
        updatedDates.splice(index, 1);

        // Update state optimistically
        setSelectedUser((prev) => ({
            ...prev,
            Dates: updatedDates,
        }));
        
        // Send delete request to server
        deleteSingleDate({username:selectedUser.UserName, date:day.date});
    } 
    function onSuccessDelete(){
        console.log("delete complete")
    }
   
    return (
        <SimpleContainer
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
                padding: "20px",
            }}
        >
            <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#333" }}>Admin Interface</h1>
            {isPerforming ? (
                <p>Loading admin data...</p>
            ) : errorMessage ? (
                <p style={{ color: "red" }}>{errorMessage}</p>
            ) : userDetails ? (
                <>
                    <select
                    onChange={handleUserChange}
                    style={{
                        marginBottom: "20px",
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        width: "200px",
                    }}
                    >
                    <option value="">Select a user</option>
                    {Object.keys(userDetails)
                        .filter((userName) => userName !== "admin") // Filter out 'admin'
                        .map((userName, index) => (
                        <option key={index} value={userName}>
                            {userDetails[userName].UserName}
                        </option>
                        ))}
                    </select>
                    <SimpleContainer>
                        <button
                         style={{
                            marginTop: "10px",
                            fontSize: "18px",
                            borderRadius: "8px",
                            padding: "15px",
                            backgroundColor: "#f0f0f0"
                            }}
                            onClick={hundleNewUser}>
                            Add new user
                        </button>
                        <SimplePopUp 
                                isOpen={newUserPopupIsOpen}
                                onClose={()=> {setnewUserPopupIsOpen(false)}}
                            >
                                <SimpleContainer style={{display:'flex',justifyContent:'space-between',}}>
                                    <SimpleContainer>
                                        <p>User Name:</p>
                                    <SimpleInput
                                        label={'UserName'}
                                        placeholder={'Enter User Name'}
                                        onChangeFunction={(value) => {setnewUserName(value)}}
                                    />
                                    </SimpleContainer>
                                    <SimpleContainer>
                                        <p>Password:</p>

                                        <SimpleInput
                                            label={'Password'}
                                            placeholder={'Enter Password'}
                                            onChangeFunction={(value) => {setnewPassword(value)}}
                                        />
                                    </SimpleContainer>
                                </SimpleContainer>
                                <SimpleContainer style={{display:'flex',width:'100%', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                                    {errorTryToSaveNewUserApi && 
                                    <p style={{color:'red'}}>Please make sure user don't exist and fill all the fields.</p>
                                    }
                                    <button onClick={addUserNameButtonClicked} style={{marginTop: errorTryToSave ? 4 : 16, padding:'8px 12px'}}>Add New User</button>
                                </SimpleContainer>
                            </SimplePopUp>

                           
                    </SimpleContainer>
                    {selectedUser && (
                        <SimpleContainer
                        style={{
                            position: "relative",
                            marginTop: "20px",
                            fontSize: "18px",
                            color: "#555",
                            width: "80%",
                            padding: "20px",
                            borderRadius: "8px",
                            backgroundColor: "#fff",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        
                    
                        <p>
                            <strong>User:</strong> {selectedUser.UserName}
                        </p>
                        <p>
                            <strong>Password:</strong> {selectedUser.Password}
                        </p>
                            
                        <SimpleContainer
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <SimpleInput
                        placeholder="Filter by date..."
                        onChangeFunction={setFilterText} // Capture filter input
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            flexGrow: 1, // Makes input take available space
                            marginRight: "10px", // Adds spacing between input and button
                            
                        }}
                    />
                    
                </SimpleContainer>
                            
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    marginTop: "20px",
                                }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            backgroundColor: "#f0f0f0",
                                            fontWeight: "bold",
                                            color: "#333",
                                        }}
                                    >
                                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>
                                            Date
                                        </th>
                                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>
                                            Clock In
                                        </th>
                                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>
                                            Clock Out
                                        </th>
                                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDates.map((entry, index) => (
                                        <tr key={index}>
                                            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{entry.date}</td>
                                            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{entry.clockIn}</td>
                                            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{entry.clockOut}</td>
                                            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                                <button
                                                    onClick={() => {
                                                        setSingleDatePopupIsOpen(true);
                                                        setClickedDetails(entry);
                                                        setClickedIndex(index);
                                                    }}
                                                >
                                                    Edit Time
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDay(index, entry)}
                                                    style={{ marginLeft: "10px", color: "red" }}
                                                    
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <SimplePopUp 
                                isOpen={singleDatePopupIsOpen}
                                onClose={()=> {setSingleDatePopupIsOpen(false)}}
                            >
                                <SimpleContainer style={{display:'flex',justifyContent:'space-between',}}>
                                    <SimpleContainer>
                                        <p>Clock In</p>
                                    <SimpleInput
                                        label={'Clock In'}
                                        placeholder={'00:00'}
                                        onChangeFunction={(value) => {setClockIn(value)}}
                                    />
                                    </SimpleContainer>
                                    <SimpleContainer>
                                        <p>Clock Out</p>

                                        <SimpleInput
                                            label={'Clock Out'}
                                            placeholder={'00:00'}
                                            onChangeFunction={(value) => {setClockOut(value)}}

                                        />
                                    </SimpleContainer>
                                </SimpleContainer>
                                <SimpleContainer style={{display:'flex',width:'100%', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                                    {errorTryToSave && 
                                    <p style={{color:'red'}}>Please Enter The Time Again</p>
                                    }
                                    <button onClick={SaveButtonClicked} style={{marginTop: errorTryToSave ? 4 : 16, padding:'8px 12px'}}>Save</button>
                                </SimpleContainer>
                            </SimplePopUp>
                            
                        </SimpleContainer>
                    )}
                </>
            ) : (
                <p>No admin data available.</p>
            )}
        </SimpleContainer>
        
    );
}