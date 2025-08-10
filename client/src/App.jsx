import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportItem from './pages/ReportItem';
import ItemDetails from './pages/ItemDetails';
import QRScanner from './pages/QRScanner';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/scan" element={<QRScanner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;