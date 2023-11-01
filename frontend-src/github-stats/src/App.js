import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import AuthPage from './pages/authPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route index element={<LandingPage/>} />
          <Route path="/sign-up" element={<AuthPage/>} />
          <Route path="/sign-in" element={<AuthPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
