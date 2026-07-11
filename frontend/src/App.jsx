import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PreparationSetupPage from "./pages/PreparationSetupPage";
import QuestionSelectionPage from "./pages/QuestionSelectionPage";
import TestConfigurationPage from "./pages/TestConfigurationPage";
import TestPreviewPage from "./pages/TestPreviewPage";
import JoinTestPage from "./pages/JoinTestPage";
import MockTestPage from "./pages/MockTestPage";
import TestResultPage from "./pages/TestResultPage";
import TestHistoryPage from "./pages/TestHistoryPage";


function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={
            <LandingPage />
          }
        />

        <Route
          path="/login"
          element={
            <LoginPage />
          }
        />

        <Route
          path="/register"
          element={
            <RegisterPage />
          }
        />

        <Route
          path="/dashboard"
          element={
            <DashboardPage />
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ForgotPasswordPage />
          }
        />

        <Route
          path="/reset-password"
          element={
            <ResetPasswordPage />
          }
        />

        <Route
          path="/preparation-setup"
          element={
            <PreparationSetupPage />
          }
        />

        <Route
          path="/question-selection"
          element={
            <QuestionSelectionPage />
          }
        />

        <Route
          path="/test-configuration"
          element={
            <TestConfigurationPage />
          }
        />

        <Route
          path="/test-preview"
          element={
            <TestPreviewPage />
          }
        />

        <Route
          path="/join-test/:shareCode"
          element={
            <JoinTestPage />
          }
        />

        <Route
          path="/mock-test"
          element={
            <MockTestPage />
          }
        />

        <Route
          path="/test-result"
          element={
            <TestResultPage />
          }
        />

        <Route
          path="/test-history"
          element={
            <TestHistoryPage />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;