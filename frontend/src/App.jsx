import { Routes, Route, Navigate } from 'react-router-dom';
import CreateEvent from './pages/CreateEvent/CreateEvent';
import TicketsPricing from './pages/CreateEvent/TicketsPricing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/create-event" replace />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/create-event/tickets" element={<TicketsPricing />} />
    </Routes>
  );
}

export default App;

