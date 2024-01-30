import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"



function App() {
  return (
    <BrowserRouter>
      <Routes>
      {/* Page d'acceuil avec un Welcome, expliquer brièvement le but de l'application et un bouton login */}
        <Route path= "/" element={<Home/>}></Route>

        <Route path= "/Login" element={<Login/>}></Route>

        <Route path= "/Dashboard" element={<Dashboard/>}></Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
