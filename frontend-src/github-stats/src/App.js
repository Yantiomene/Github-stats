import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import AuthPage from './pages/authPage';
import SearchPage from './pages/searchPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route index element={<LandingPage/>} />
          <Route path="/sign-up" element={<AuthPage/>} />
          <Route path="/sign-in" element={<AuthPage/>} />
          <Route path="/search" element={<SearchPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
