import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/dashboard/Dashboard"
import './style.css';
import { useEffect, useState, createContext } from "react";
import { account } from "./appwrite/config";

// export const InfosUsersSession = createContext();

function App() {

  // const [userAuth, setUserAuth] = useState(null);

  // async function init() {
  //   try {
  //     const loggedIn = await account.get("current");
  //     setUserAuth(loggedIn);
  //     console.log("user logged in");
  //   } catch (err) {
  //     setUserAuth(null);
  //     console.log("error: user not logged in");
  //   }
  // }
  // init();
  

  // useEffect(() => {
  //     init();
  // }, [userAuth])



  return (
    <BrowserRouter>
      <Routes>
      {/* Page d'acceuil avec un Welcome, expliquer brièvement le but de l'application et un bouton login */}
        <Route path= "/" element={<Home/>}></Route>

        <Route path= "/login" element={<Login/>}></Route>

        <Route path= "/dashboard/" element={<Dashboard />}></Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
