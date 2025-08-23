import Cookies from "js-cookie";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login, Register, Home } from "./pages";

function App() {
  
const token = Cookies.get("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
