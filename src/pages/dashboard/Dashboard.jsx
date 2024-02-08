import React, { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { account, database } from "../../appwrite/config";


// COMPONENTS
import AdminDashboard from "../layout/AdminDashboard/adminDashboard";
import UserDashboard from "../layout/userDashboard/userDashboard";
import { Query } from "appwrite";

// infos user
// export const InfosUsers = createContext();
export const InfosUsersSession = createContext();


export default function Dashboard (){
  const navigate = useNavigate();

  const [userAuth, setUserAuth] = useState(null);
  const [showPage, setShowPage] = useState();

  async function init() {
    try {
      const loggedIn = await account.get("current");
      console.log("user logged in");
      if (loggedIn) {
        try {
          const user = await database.listDocuments(
            import.meta.env.VITE_APP_DB_ID,
            import.meta.env.VITE_APP_USER_COLLECTION_ID,
            [
              Query.equal("user_id", loggedIn.$id)
            ]
          )
          
          setUserAuth(user.documents[0])

          if (user.documents[0].isAdmin === true) {
            setShowPage(
              <InfosUsersSession.Provider value={user.documents[0]} >
                <AdminDashboard />
              </InfosUsersSession.Provider>
            )
          } else{
            setShowPage(
              <InfosUsersSession.Provider value={user.documents[0]}>
                <UserDashboard />
              </InfosUsersSession.Provider>
            )
          }
        } catch (error) {
          console.log("error: user not found");  
          console.log(error)
        }
      }else{}

    } catch (err) {
      setUserAuth(null);
      console.log("error: user not logged in");
      navigate('/login')
    }
    
  }
  // init()

  useEffect(() => {
    init()
  }, [])
  

  return (
    <div id="page">
      {showPage}
    </div>
  )
}
