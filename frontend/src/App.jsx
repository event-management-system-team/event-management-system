import { BrowserRouter, Routes, Route } from 'react-router-dom';
// ... các import khác
import FeedbackList from './pages/FeedbackList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ... các route cũ */}
        
        {/* Thêm route cho Feedback - Chỉ Admin/Organizer mới vào được */}
        <Route path="/admin/feedback" element={<FeedbackList />} />
        
        {/* Nếu có eventId cụ thể thì dùng: */}
        {/* <Route path="/admin/events/:eventId/feedback" element={<FeedbackList />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;