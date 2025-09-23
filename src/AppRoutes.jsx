import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/not_found/NotFoundPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileMenu from "./components/MobileMenu";
import { MessageProvider } from "./contexts/MessageContext";
import MessageToast from "./components/MessageToast";
import JoinQuizPage from "./pages/home/JoinQuizPage";
import DashboardPage, { DashboardHome } from "./pages/dashboard/DashboardPage";
import AuthPage from "./pages/auth/AuthPage";
import QuizPage from "./pages/quiz/QuizPage";
import SettingsPage from "./pages/dashboard/settings/SettingsPage";
import CreateQuizPage from "./pages/dashboard/create_quiz/CreateQuizPage";
import OrganizeQuizPage from "./pages/dashboard/organize_quiz/OrganizeQuizPage";
import QuizHistoryPage from "./pages/dashboard/quiz_history/QuizHistoryPage";


function AppRoutes() {
  // You may want to manage isMenuOpen state here or in a parent component
  const isMenuOpen = false; // Placeholder, replace with actual state logic
  return (
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
                  <Route path="/quiz/:quizid" element={<QuizPage />} />
                  <Route path="/create-quiz" element={<CreateQuizPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                  <Route path="/dashboard" element={<DashboardPage />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="quiz-history" element={<QuizHistoryPage />} />
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
  );
}

export default AppRoutes
