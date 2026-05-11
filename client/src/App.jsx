import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom';
import ClassPage from "./ClassPage";
import Home from './Home';
import './global.css';
import Test from './Test';
import { generateSessionId, GuestIdContext } from './GuestIdContext';
import { useState } from 'react';

function InsideRouter() {
  const [guestId, setGuestId] = useState(generateSessionId());
  return (
    <>
      <GuestIdContext value={guestId}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/class" element={<ClassPage />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </GuestIdContext>
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