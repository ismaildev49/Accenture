import React, { createContext, useEffect, useState } from "react";


// COMPONENTS
import AdminDashboard from "../layout/AdminDashboard/adminDashboard";
import UserDashboard from "../layout/userDashboard/userDashboard";

// infos user
export const InfosUsers = createContext();

const emuler_user = [
  {
      id: 0,
      name: "Angelina Jolie",
      photo: "https://i.pinimg.com/originals/96/fa/f6/96faf68b951fd2d852deba3baa225d12.gif",
      isAdmin: "true"
  },
  {
      id: 1,
      name: "Hugo Boss",
      photo: "https://media.licdn.com/dms/image/D4E03AQF3H8eetH_n0w/profile-displayphoto-shrink_800_800/0/1669641183201?e=1710374400&v=beta&t=BkQqtYMDeE3vjZqrURmgW7bri5hHUkaQ_7EPi_PSFbM",
      isAdmin: "false"
  },
  {
      id: 2,
      name: "Ismael Le Grand",
      photo: "",
      isAdmin: "true"
  },
  {
      id: 3,
      name: "John Lennon",
      photo: "",
      isAdmin: "false"
  }
]


export default function Dashboard (){

  const [IsAdmin, setIsAdmin] = useState(false);
  const [userAuth, setUserAuth] = useState();

  const idSession = 1


  function testDateJson(){
    emuler_user.map((user) => {
      if (user.id === idSession) {
        if(user.isAdmin === "true"){
          setIsAdmin(true)
          setUserAuth(user)
        } else {
          setIsAdmin(false)
          setUserAuth(user)
        }
      } 
    })
  }
  
  useEffect(() => {
    console.log(userAuth);
    testDateJson()
  }, [IsAdmin, userAuth])

  return (
    <div id="page">
      {IsAdmin ? 
        <InfosUsers.Provider value={userAuth}>
            <AdminDashboard />
        </InfosUsers.Provider> : 
        
        <InfosUsers.Provider value={userAuth}>
            <UserDashboard />
        </InfosUsers.Provider>
        }
    </div>
  )
}
