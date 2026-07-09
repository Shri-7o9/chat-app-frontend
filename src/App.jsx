import { Navigate, Route, Routes } from "react-router-dom";
import { Toast } from "react-hot-toast";

import HomePage from "./pages/HomePage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

function App() {
  return (
    <div>
      <Routes>

        <Route path="/" element={<HomePage /> } />

        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>

      <Toast/>
    </div>
  );
}
export default App;

