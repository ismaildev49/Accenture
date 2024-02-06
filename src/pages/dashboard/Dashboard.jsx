import React, { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { account, documentsUsers } from "../../appwrite/config";


// COMPONENTS
import AdminDashboard from "../layout/AdminDashboard/adminDashboard";
import UserDashboard from "../layout/userDashboard/userDashboard";
import { Query } from "appwrite";

// infos user
export const InfosUsers = createContext();
export const InfosUsersSession = createContext();

// const emuler_user = [
//   {
//       id: 0,
//       name: "Angelina Jolie",
//       photo: "https://i.pinimg.com/originals/96/fa/f6/96faf68b951fd2d852deba3baa225d12.gif",
//       isAdmin: "true"
//   },
//   {
//       id: 1,
//       name: "Hugo Boss",
//       photo: "https://media.licdn.com/dms/image/D4E03AQF3H8eetH_n0w/profile-displayphoto-shrink_800_800/0/1669641183201?e=1710374400&v=beta&t=BkQqtYMDeE3vjZqrURmgW7bri5hHUkaQ_7EPi_PSFbM",
//       isAdmin: "false"
//   },
//   {
//       id: 2,
//       name: "Ismael Le Grand",
//       photo: "",
//       isAdmin: "true"
//   },
//   {
//       id: 3,
//       name: "John Lennon",
//       photo: "",
//       isAdmin: "false"
//   }
// ]



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
          const user = await documentsUsers.listDocuments(
            "65bf56612bded57e2cca",
            "65bf567ec2c1c5833968",
            [
              Query.equal("user_id", loggedIn.$id)
            ]
          )

          setUserAuth(user.documents[0])

          if (user.documents[0].isAdmin === "true") {
            setShowPage(
              <InfosUsersSession.Provider value={userAuth} >
                <AdminDashboard />
              </InfosUsersSession.Provider>
            )
          } else{
            setShowPage(
              <InfosUsersSession.Provider value={userAuth}>
                <UserDashboard />
              </InfosUsersSession.Provider>
            )
          }
        } catch (error) {}
      }

    } catch (err) {
      setUserAuth(null);
      console.log("error: user not logged in");
      navigate('/login')
    }
  }

  
  useEffect(() => {
    init();
  })
  

  return (
    <div id="page">
      {showPage}
    </div>
  )
}
