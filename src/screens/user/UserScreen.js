import { useEffect, useState, useCallback, useRef } from "react";
import SimpleContainer from "../../components/simpleComponents/SimpleContainer";
import { useLocation } from "react-router-dom";
import { UserApi } from "../../api/user/UserApi";
import useHttpRequest from "../../hooks/useHttpRequest";
import { formatDateToBerlin, formatDateToBerlinDDMMYYYY, formatDateToBerlinDDMMYYYYHHmm, formatDateToBerlinHHmm } from "../../constant/formatDate";
import { UserPostClockIn } from "../../api/user/UserPostClockIn";
import { UserPostClockOut } from "../../api/user/UserPostClockOut";
import SimpleInput from "../../components/simpleComponents/SimpleInput";
export const UserScreenName = "/UserScreen";
export default function UserScreen() {
    const location = useLocation();
    const { userData } = location.state || {};
    const username = userData?.data?.UserName;

    const [userDetails, setUserDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [berlinTime, setBerlinTime] = useState(null);
    const [clockOut, setClockOut]=useState(null);
    const [berlinDate, setBerlinDate]=useState(null)
    const { isPerforming, performRequest } = useHttpRequest(UserApi.sendUser, onSuccess, onFailure);
    const { isPerforming:clockInisPerforming, performRequest: clockInperformRequest } = useHttpRequest(UserPostClockIn.postClockIn, onSuccessClockIn, onFailure);
    const { isPerforming:clockOutisPerforming, performRequest: clockOutperformRequest } = useHttpRequest(UserPostClockOut.postClockOut, onSuccessClockOut, onFailure);
    const [filterText, setFilterText] = useState("");
    const [clock, setClock]=useState(null);
    

    const hasFetchedData = useRef(false);

    const fetchUserData = useCallback(() => {
        if (username && !hasFetchedData.current) {
            hasFetchedData.current = true;
            performRequest(username);
        }
    }, [username, performRequest]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    useEffect(() => {
        const fetchBerlinTime = async () => {
            try {
                const response = await fetch("https://worldtimeapi.org/api/timezone/Europe/Berlin");
                const data = await response.json();
                console.log("this is response:",response)
                setClock(formatDateToBerlinHHmm(data.datetime))
                setBerlinTime(data.datetime);
                setBerlinDate(formatDateToBerlinDDMMYYYY(data.datetime))
                
            } catch (error) {
                const now = new Date();
            now.setHours(now.getHours() );
            const fallbackTime = now.toISOString();

            setClock(formatDateToBerlinHHmm(fallbackTime));
            setBerlinTime(fallbackTime);
            setBerlinDate(formatDateToBerlinDDMMYYYY(fallbackTime));
            }
        };

        fetchBerlinTime(); // Fetch immediately
        const interval = setInterval(fetchBerlinTime, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval); // Clean up interval on component unmount
    }, []);

    async function onSuccess(data) {
        console.log("User data fetched successfully:", data);
        setUserDetails(data);
        setIsButtonDisabled(false);
    }
    function onSuccessClockIn(data) {
        console.log("clock in sent successfuly");
        const updatedDetails = { ...userDetails };
        updatedDetails.data.user.Dates.push({
            date: berlinDate,
            clockIn: clock,
            clockOut: "--",
        });
        setUserDetails(updatedDetails);
     
    }
    function onSuccessClockOut(data){
        console.log("clock Out sent successfuly");
        const updatedDetails = { ...userDetails };
    const currentDayEntry = updatedDetails.data.user.Dates.find(entry => entry.date === berlinDate);
    if (currentDayEntry) {
        currentDayEntry.clockOut = clock;
    }
    setUserDetails(updatedDetails);
        
    }
    function onFailure(error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Failed to fetch user data.");
    }

    const handleClockIn = () => {
        clockInperformRequest(username, berlinDate, clock);
    };
    
    const handleClockOut = () => {
        clockOutperformRequest(username, berlinDate, clock);
    };
    
    const getButtonContent = () => {
        const todayEntry = userDetails?.data?.user?.Dates.find(entry => entry.date === berlinDate);
    
        if (!todayEntry) {
            return {
                text: "Clock In",
                action: handleClockIn,
                disabled: clockInisPerforming,
                style: { backgroundColor: "#007bff" },
            };
        }
    
        if (todayEntry.clockOut === "--") {
            return {
                text: "Clock Out",
                action: handleClockOut,
                disabled: clockOutisPerforming,
                style: { backgroundColor: "red" },
            };
        }
    
        if (todayEntry.clockIn && todayEntry.clockOut) {
            return {
                text: "See You Tomorrow",
                action: null,
                disabled: true,
                style: { backgroundColor: "#ccc" },
            };
        }
    
        return null;
    };
    const buttonContent = getButtonContent();
    const filteredDates = userDetails?.data?.user.Dates.filter((entry) =>
        entry.date.toLowerCase().includes(filterText.toLowerCase())
    );
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
            <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#333" }}>
                Hello {username || "Guest"}
            </h1>
            {isPerforming ? (
                <p>Loading user data...</p>
            ) : errorMessage ? (
                <p style={{ color: "red" }}>{errorMessage}</p>
            ) : userDetails ? (
                <>
                    {buttonContent && (
                        <button
                            onClick={buttonContent.action}
                            disabled={buttonContent.disabled}
                            style={{
                                marginBottom: "20px",
                                padding: "10px 20px",
                                fontSize: "16px",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                ...buttonContent.style,
                            }}
                        >
                            {buttonContent.text}
                        </button>
                    )}
                    <SimpleContainer
                        style={{
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
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <SimpleInput
                                placeholder="Filter by date..."
                                onChangeFunction={setFilterText} // Capture filter input
                                style={{
                                    marginBottom: "20px",
                                    padding: "10px",
                                    fontSize: "16px",
                                    borderRadius: "4px",
                                    border: "1px solid #ddd",
                                }}
                            />
                            {berlinTime && (
                                <p style={{ fontWeight: "bold" }}>Berlin Time: {formatDateToBerlinDDMMYYYYHHmm(berlinTime)}</p>
                            )}
                        </div>
                        
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
                                    <th
                                        style={{
                                            padding: "12px",
                                            textAlign: "left",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        Date
                                    </th>
                                    <th
                                        style={{
                                            padding: "12px",
                                            textAlign: "left",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        Clock In
                                    </th>
                                    <th
                                        style={{
                                            padding: "12px",
                                            textAlign: "left",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        Clock Out
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDates.map((entry, index) => (
                                    <tr key={index}>
                                        <td
                                            style={{
                                                padding: "12px",
                                                borderBottom: "1px solid #ddd",
                                            }}
                                        >
                                            {entry.date}
                                        </td>
                                        <td
                                            style={{
                                                padding: "12px",
                                                borderBottom: "1px solid #ddd",
                                            }}
                                        >
                                            {entry.clockIn}
                                        </td>
                                        <td
                                            style={{
                                                padding: "12px",
                                                borderBottom: "1px solid #ddd",
                                            }}
                                        >
                                            {entry.clockOut}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </SimpleContainer>
                </>
            ) : (
                <p>No user details available.</p>
            )}
        </SimpleContainer>
    );
}