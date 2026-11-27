// App.tsx — the list of all pages (routes) in the app.
// To add a page: create it in src/pages/ and add one <Route> line here.

import { Routes, Route } from 'react-router';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CourseListPage from './pages/CourseListPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import TakeQuizPage from './pages/TakeQuizPage';
import QuizResultPage from './pages/QuizResultPage';

function App() {
  return (
    <Routes>
      {/* Every page inside this Route gets the navbar + panel from Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* "*" = any URL that didn't match above */}
        <Route path="/quizzes/:id/take" element={<TakeQuizPage />} />
        <Route path="/quizzes/:id/result" element={<QuizResultPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
