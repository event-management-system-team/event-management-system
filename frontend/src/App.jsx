import { BrowserRouter, Routes, Route } from 'react-router-dom';
// ... các import khác
import FeedbackList from './pages/organizer/FeedbackList';
import FeedbackBuilder from "./pages/organizer/FeedbackBuilder";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ... các route cũ */}
        
        {/* Thêm route cho Feedback - Chỉ Admin/Organizer mới vào được */}
        <Route path="/organizer/feedback" element={<FeedbackList />} />
        
        {/* Nếu có eventId cụ thể thì dùng: */}
        {/* <Route path="/admin/events/:eventId/feedback" element={<FeedbackList />} /> */}
    <Route path="/organizer/feedback/builder" element={<FeedbackBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;