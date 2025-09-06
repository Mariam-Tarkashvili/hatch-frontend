import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login_page from "./Login_page";
import Recruiter_interface from './Recruiter_interface';
import Worker_interface from './Worker_interface';
import Bar from './Bar';
import Quiz_box from './Quiz_box';

// Worker page component that includes Bar + Worker_interface
const WorkerPage = () => {
  return (
    <>
      <Bar />
      <Worker_interface />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login_page />} />

        {/* Recruiter interface */}
        <Route path="/recruiter" element={<Recruiter_interface />} />

        {/* Worker interface with nested routes */}
        <Route path="/worker/:id/*" element={<WorkerPage />}>
          {/* Redirect /worker/:id → /worker/:id/articles */}
          <Route index element={<Navigate to="articles" replace />} />
          {/* The nested routes (articles, podcasts, quiz) are defined inside Worker_interface.jsx */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
