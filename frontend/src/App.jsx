import { Routes, Route, Navigate } from 'react-router-dom';
import CreateEvent from './pages/CreateEvent/CreateEvent';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/create-event" replace />} />
      <Route path="/create-event" element={<CreateEvent />} />
    </Routes>
  );
}

export default App;
