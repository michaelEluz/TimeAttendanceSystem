import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import SimpleContainer from "../../components/simpleComponents/SimpleContainer";
import SimpleInput from "../../components/simpleComponents/SimpleInput";
import SimpleButton from "../../components/simpleComponents/SimpleButton";
import { LoginApi } from "../../api/login/LoginApi";
import useHttpRequest from "../../hooks/useHttpRequest";
import { UserScreenName } from "../user/UserScreen";
import { AdminScreenName } from "../admin/AdminScreen";
export const LoginScreenName = "/LoginScreen";

export default function LoginScreen() {
    const { isPerforming, performRequest } = useHttpRequest(LoginApi.sendLogin, onSuccess, onFailure);
    const [userName, setUserName] = useState(null);
    const [password, setPassword] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    function onSuccess(data) {
        console.log("data", data);
        if (data.role === "admin") navigate(AdminScreenName);
        if (data.role === "user")  navigate(UserScreenName, { state: { userData: data } });
    }

    function onFailure(error) {
        console.log("error", error);
        setErrorMessage("Username or Password does not exist!");
    }

    function onPressLoginButton() {
        performRequest(userName, password);
    }

    return (
        <SimpleContainer
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                padding: '20px',
            }}
        >
            <SimpleContainer style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
                    Attendance System
                </h1>
            </SimpleContainer>
            <SimpleContainer style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#555' }}>
                    Sign in
                </h1>
            </SimpleContainer>
            <SimpleContainer
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                }}
            >
                <SimpleInput
             
                    placeholder={"User Name"}
                    value={userName}
                    onChangeFunction={(text) => setUserName(text)}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        outline: 'none',
                    }}
                />
                <SimpleInput
                    type={"password"}
                    placeholder={"Password"}
                    value={password}
                    onChangeFunction={(text) => setPassword(text)}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        outline: 'none',
                    }}
                />
                {errorMessage && (
                    <SimpleContainer
                        style={{
                            color: 'red',
                            fontSize: '14px',
                            textAlign: 'center',
                        }}
                    >
                        {errorMessage}
                    </SimpleContainer>
                )}
            </SimpleContainer>
            <SimpleButton
                onClickFunction={onPressLoginButton}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '20px',
                    textAlign: 'center',
                }}
            >
                Login
            </SimpleButton>
        </SimpleContainer>
    );
}
