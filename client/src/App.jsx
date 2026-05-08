import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom';
import ClassPage from "./ClassPage";
import Home from './Home';
import './global.css';
import Test from './Test';

function InsideRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/class" element={<ClassPage />} />
        <Route path="/test" element={<Test />} />
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