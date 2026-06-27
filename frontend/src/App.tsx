import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Assessment } from './pages/Assessment';
import { Results } from './pages/Results';
import { HabitSimulator } from './pages/HabitSimulator';
import { Recommendations } from './pages/Recommendations';
import { About } from './pages/About';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/simulator" element={<HabitSimulator />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
