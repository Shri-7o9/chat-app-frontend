import { BrowserRouter, Routes, Route } from "react-router";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import UpdateProfilePage from "./pages/updateProfilePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<UpdateProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
