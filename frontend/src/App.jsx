import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FeedbackManagementPage from './pages/FeedbackManagementPage';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <BrowserRouter>
      <Routes>
        {/* Các route khác (Login, Register...) */}
        
        {/* 👇 THÊM DÒNG NÀY: Link vào trang xem feedback */}
        {/* Ví dụ: Vào xem feedback của sự kiện có ID là 123 */}
        <Route path="/organizer/events/:eventId/feedbacks" element={<FeedbackManagementPage />} />
        
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
