import { BrowserRouter } from "react-router-dom";
import AppRoutes from './routes/index'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
