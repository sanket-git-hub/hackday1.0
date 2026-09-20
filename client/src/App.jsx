import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CheckIn from "./pages/CheckIn";
import ResultRoutine from "./pages/ResultRoutine";
import ResultAttention from "./pages/ResultAttention";
import ResultUrgent from "./pages/ResultUrgent";
import Resources from "./pages/Resources";
import Booking from "./pages/Booking";
import CounselorDashboard from "./pages/CounselorDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/checkin" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/result/routine" element={<ResultRoutine />} />
          <Route path="/result/attention" element={<ResultAttention />} />
          <Route path="/result/urgent" element={<ResultUrgent />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/counselor" element={<CounselorDashboard />} />
          <Route path="*" element={<Navigate to="/checkin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
