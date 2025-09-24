import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/not_found/NotFoundPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileMenu from "./components/MobileMenu";
import { MessageProvider } from "./contexts/MessageContext";
import { AuthProvider } from "./contexts/AuthContext";
import MessageToast from "./components/MessageToast";

import JoinQuizPage from "./pages/home/JoinQuizPage";
import DashboardPage, { DashboardHome } from "./pages/dashboard/DashboardPage";
import AuthPage from "./pages/auth/AuthPage";
import QuizPage from "./pages/quiz/QuizPage";
import SettingsPage from "./pages/dashboard/settings/SettingsPage";
import OrganizeQuizPage from "./pages/dashboard/organize_quiz/OrganizeQuizPage";
import LeaderboardPage from "./pages/leaderboard/LeaderboardPage";
import QuizHistoryPage from "./pages/dashboard/quiz_history/QuizHistoryPage";
import AttemptedQuizDetailsPage from "./pages/dashboard/quiz_history/AttemptedQuizDetailsPage";
import OrganizedQuizDetailsPage from "./pages/dashboard/quiz_history/OrganizedQuizDetailsPage";
import PrivateRoute from "./components/PrivateRoute";


function AppRoutes() {
  // You may want to manage isMenuOpen state here or in a parent component
  const isMenuOpen = false; // Placeholder, replace with actual state logic
  return (
    <AuthProvider>
      <MessageProvider>
        <BrowserRouter>
          <div className="h-screen w-screen fixed top-0 left-0 bg-base-100">
            <div className="flex flex-col rounded-lg h-full justify-between ">
              <Navbar />
              <main className="w-screen overflow-auto">
                {isMenuOpen ? (
                  <MobileMenu />
                ) : (
                  <Routes>
                    <Route path="/" element={<JoinQuizPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/quiz/:quizid" element={
                      <PrivateRoute>
                        <QuizPage />
                      </PrivateRoute>
                    } />
                    <Route path="/leaderboard/:quizid" element={
                      <PrivateRoute>
                        <LeaderboardPage />
                      </PrivateRoute>
                    } />
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/dashboard" element={
                      <PrivateRoute>
                        <DashboardPage />
                      </PrivateRoute>
                    }>
                      <Route index element={<DashboardHome />} />
                      <Route path="quiz-history" element={<QuizHistoryPage />} />
                      <Route path="quiz-history/attempted/:quizid" element={<AttemptedQuizDetailsPage />} />
                      <Route path="quiz-history/organized/:quizid" element={<OrganizedQuizDetailsPage />} />
                      <Route path="organize-quiz" element={<OrganizeQuizPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                    </Route>
                  </Routes>
                )}
              </main>
              <Footer />
              <MessageToast />
            </div>
          </div>
        </BrowserRouter>
      </MessageProvider>
    </AuthProvider>
  );
}

export default AppRoutes
