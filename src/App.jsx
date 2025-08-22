import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login_page from "./Login_page";
import Recruiter_interface from './Recruiter_interface';
import Worker_interface from './Worker_interface';
import Bar from './Bar';

// Worker page component that includes Bar + Worker_interface
const WorkerPage = ({ workerId }) => {
  return (
    <>
      <Bar />
      <Worker_interface workerId={workerId} />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login_page />} />
        <Route path="/recruiter" element={<Recruiter_interface />} />
        <Route path="/worker/1" element={<WorkerPage workerId="1" />} />
        <Route path="/worker/2" element={<WorkerPage workerId="2" />} />
      </Routes>
    </Router>
  )
}

export default App