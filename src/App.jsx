import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing_page from "./Landing_page"   // ✅ new landing
import Login_page from "./Login_page"
import Recruiter_interface from './Recruiter_interface'
import Worker_interface from './Worker_interface'
import Bar from './Bar'
import Quiz_box from './Quiz_box'

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
        {/* Landing page */}
        <Route path="/" element={<Landing_page />} />

        {/* Login */}
        <Route path="/login" element={<Login_page />} />

        {/* Recruiter interface */}
        <Route path="/recruiter" element={<Recruiter_interface />} />

        {/* Worker interface with nested routes */}
        <Route path="/worker/:id/*" element={<WorkerPage />}>
          {/* Redirect /worker/:id → /worker/:id/articles */}
          <Route index element={<Navigate to="articles" replace />} />
        </Route>

        {/* Catch-all → redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
