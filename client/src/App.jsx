import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom';
import ClassPage from "./ClassPage";
import Home from './Home';
// import './global.css';

function InsideRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/class" element={<ClassPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <InsideRouter />
    </Router>
  );
}

export default App;