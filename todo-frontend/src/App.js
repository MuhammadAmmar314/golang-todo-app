import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>}></Route>
        <Route path="/register" element={ <Register /> }></Route>
        <Route path="/login" element={ <Login /> }></Route>
        <Route path="/dashboard" element={ <Dashboard /> }></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
