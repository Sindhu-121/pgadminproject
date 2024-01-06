
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Addexam from './pgComponents/Addexam';
function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Addexam />} />
      </Routes>
      </Router>
  );
}

export default App;
