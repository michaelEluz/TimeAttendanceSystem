import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginScreen, { LoginScreenName } from './screens/login/LoginScreen';
import UserScreen, {UserScreenName} from './screens/user/UserScreen';
import AdminScreen,{AdminScreenName} from './screens/admin/AdminScreen';
function App() {
  return (
    <Router>
      <Routes>
        <Route path={LoginScreenName} element={<LoginScreen />} />
        <Route path={UserScreenName} element={<UserScreen />} />
        <Route path={AdminScreenName} element={<AdminScreen />} />

        <Route path="*" element={<Navigate to={LoginScreenName} replace />} />
        </Routes>
    </Router>
  );
}

export default App;
