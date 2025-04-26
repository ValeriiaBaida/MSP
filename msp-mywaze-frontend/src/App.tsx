import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapView from './pages/MapView';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './routes/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;