
import { useState } from "react";

import {BrowserRouter, Routes, Route, Link, Navigate} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ExpenseTracking from "./pages/ExpenseTracking";





function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
});

  return (
    <BrowserRouter>

    {/* <nav>

      <Link to="/">Login</Link> |{" "}
      <Link to="/register">Register</Link> | {" "}
      <Link to="/dashboard">Dashboard</Link> | {" "}
    </nav> */}

    <Routes>
      {/* // Authorization Routes */}
      <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />

      {/* Protected Routes */}
      <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
      <Route path="/expenses" element={isLoggedIn ? <ExpenseTracking /> : <Navigate to="/" />}/>

    </Routes>
    
    
    
    </BrowserRouter>
  );

}

export default App;
