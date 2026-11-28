// App.tsx — the list of all pages (routes) in the app (Demo 10: "Modifying App.tsx").
// To add a page: create it in src/pages/ and add one <Route> line in the right block below.

import { Routes, Route } from 'react-router';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CourseListPage from './pages/CourseListPage';
import CourseCreatePage from './pages/CourseCreatePage';
import CourseUpdatePage from './pages/CourseUpdatePage';
import TakeQuizPage from './pages/TakeQuizPage';
import QuizResultPage from './pages/QuizResultPage';
import NotFoundPage from './pages/NotFoundPage';
import QuizCreatePage from './pages/QuizCreatePage';
import QuizUpdatePage from './pages/QuizUpdatePage';

export default function App() {
  return (
    <Routes>
      {/* Every page inside this Route gets the navbar and the panel from Layout */}
      <Route element={<Layout />}>
        {/* Public pages: anyone can see them */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes: must be logged in (like [Authorize]) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/quizzes/:id/take" element={<TakeQuizPage />} />
          <Route path="/quizzes/:id/result" element={<QuizResultPage />} />
        </Route>

        {/* Teacher-only routes (like [Authorize(Roles = "TEACHER")]) */}
        <Route element={<ProtectedRoute role="TEACHER" />}>
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/coursescreate" element={<CourseCreatePage />} />
          <Route path="/coursesupdate/:courseId" element={<CourseUpdatePage />} />
          <Route path="/quizzes/new" element={<QuizCreatePage />} />
          <Route path="/quizzes/:id/edit" element={<QuizUpdatePage />} />
        </Route>

        {/* "*" = any URL that didn't match above */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}