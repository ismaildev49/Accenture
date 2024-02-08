import { useEffect, useState, useContext } from 'react'
import { InfosUsersSession } from '../../dashboard/Dashboard'
import { account, database } from "../../../appwrite/config";
import { useNavigate } from 'react-router';


// CALENDRIER start
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Query } from 'appwrite';
// CALENDRIER end


export default function UserDashboard() {
    
    const [isMenuOpen, setIsMenuOpen] = useState(true)


    // ROUTES-TEST start
    const [showComposant, setShowComposant] = useState("calendrier");
    const [showPage, setShowPage] = useState();
    const [ titrePage, setTitrePage] = useState("Calendrier")
    const route = [
        {path: "profil", composant: <ProfilPage />},
        {path: "calendrier", composant: <Calendrie />},
        {path: "adresse", composant: <Adresse changeComposant={changeComposant} />},
    ]
    function changeComposant(composant="") {
        if (composant == "") {
            if (window.location.hash) {
                setShowPage(route.find(e => e.path === window.location.hash.split('/')[1]).composant)
                setTitrePage(window.location.hash.split('/')[1])
            }else{
                setShowPage(route.find(e => e.path === "calendrier").composant)
                setTitrePage("calendrier")
            }
        } else {
            setShowPage(route.find(e => e.path === composant).composant)
            setTitrePage(composant)
        }
    }
    useEffect(() => {
        changeComposant()
    }, [showComposant])
    // ROUTES-TEST end


    function isMenuOpenOrClouse(){
        const aside = document.querySelector('aside')
        setIsMenuOpen(!isMenuOpen)

        if(isMenuOpen){
            aside.classList.remove('aside_off')
            aside.classList.add('aside_on')
        }else{
            aside.classList.remove('aside_on')
            aside.classList.add('aside_off')
        }
    }

    return (
        <>
            <SideBar isMenuOpenOrClouse={()=>isMenuOpenOrClouse()} changeComposant={changeComposant} />
            <div id='content'>
                <Header isMenuOpenOrClouse={()=>isMenuOpenOrClouse()} changeComposant={changeComposant} />
                <Main showPage={showPage} titrePage={titrePage} />
            </div>
        </>
    )
}



function SideBar(props){

    const navigate = useNavigate();

    const handleClick = () => {
        props.isMenuOpenOrClouse()
    }

    const handleClickPage = (page) => {
        props.changeComposant(page);
    }

    const handleDeleteSession = async () => {
        console.log("test");
        await account.deleteSession('current');
        localStorage.removeItem("user_logged");
        navigate('/login')
    }

    return(
    <aside className='bg_color_1 aside_off'>
        <div className="slideBar">
            <div className='logo'>
                <img src="../public/assets/logo.png" alt="logo" />
            </div>

            {/* <i onClick={handleClick} className='bx bxs-chevron-left btn_off_slideBar'></i> */}
            <i onClick={handleClick} className="fa-solid fa-chevron-left btn_off_slideBar"></i>

            <nav>
                <ul>
                    <h3>MENU</h3>
                    <li onClick={handleClick}>
                        <a onClick={() => handleClickPage("calendrier")}>
                            <i className="fa-regular fa-calendar-days"></i> Calendrier
                        </a>
                    </li>

                    <li onClick={handleClick}>
                        <a onClick={() => handleClickPage("adresse")}>
                            <i className="fa-solid fa-gears"></i> Adresse
                        </a>
                    </li>
                </ul>
            </nav>

            <div className="btn_logout">
                <a onClick={() => handleDeleteSession()}> 
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Logoout
                </a>
            </div>
        </div>
    </aside>
    )
}


function Header(props){
    
    const infosUser = useContext(InfosUsersSession)

    const [nom, setNom] = useState("")
    const [photo, setPhoto] = useState("")

    useEffect(() => {
        if(infosUser){
            setNom(infosUser.firstName + " " + infosUser.lastName)
            setPhoto(infosUser.profile_picture)
        }
    }, [])


    const handleClickPage = (page) => {
        props.changeComposant(page);
    }


    const handleClick = () => {
        props.isMenuOpenOrClouse()
    }
    

    return(
    <header className='bg_color_1'>
        <div className="header_content">
            <button onClick={()=>handleClick()} className="burger">
                <span></span>
                <span className='middle'></span>
                <span></span>
            </button>

            <div className="header_content_profil">
                <div className='infos'>
                    <span className='nom'>{nom}</span>
                    <span className='role'>User</span>
                </div>
                <a className='photo_profil'>
                    <img src={photo} alt="photo profil" onClick={() => handleClickPage("profil")} />
                </a>
            </div>
        </div>
    </header>
    )
}


function Main(props){
    return(
    <main className='bg_color_2'>
        <h2>{props.titrePage}</h2>
        {props.showPage}
    </main>
    )
}


// composants
// Rue Du Serment 70 1070 Anderlecht
function Adresse(props) {
    const infosUser = useContext(InfosUsersSession)

    const navigate = useNavigate();

    const [adresse, setAdresse] = useState("");

    const handleAdresseChange = (e) => {
        setAdresse(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform the logic to update the user's address
        console.log("New address:", adresse);
        database.updateDocument(infosUser.$databaseId, infosUser.$collectionId, infosUser.$id, {
            homeAdress: adresse
        }).then(response => {
            alert("Adresse modifiée avec succès");
            window.location.reload();
        }).catch(error => { 
            console.log("error updating address");
            console.log(error) });
    };

    return (
        <div className='adresse'>

            <div className="adresse_details_item">
                <p><span>Adresse actuelle: &nbsp; </span>{infosUser.homeAdress}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <input type="text" value={adresse} onChange={handleAdresseChange} placeholder='Actuallise votre adresse' />
                <button type="submit">Modifier</button>
            </form>
        </div>
    );
}


function ProfilPage(){
    const infosUser = useContext(InfosUsersSession)

    return(
        <div className='ProfilPage'>
            <div className="ProfilPage_content">
                <div className="ProfilPage_content_photo">
                    <img src={infosUser.profile_picture} alt="photo profil" />
                </div>

                <div className="ProfilPage_content_details">
                    <div className="ProfilPage_content_details_item">
                        <h2>{infosUser.firstName} {infosUser.lastName}</h2>
                    </div>
                    <div className="ProfilPage_content_details_item">
                        <p>Employer</p> <span className='line'></span> <p>eligible pour le FMB</p>  
                    </div>
                    <div className="ProfilPage_content_details_item">
                        <p><span>Adresse: &nbsp; </span>{infosUser.homeAdress}</p>
                    </div>
                    <div className="ProfilPage_content_details_item">
                        <p><span>Email: &nbsp; </span>email@email.com</p>
                    </div>
                    <div className="ProfilPage_content_details_item">
                        <p><span>GSM: &nbsp; </span>0000.000.000.000</p>
                    </div>
                    {/* <div className="ProfilPage_content_details_item">
                        <p><span>Rôle: &nbsp; </span>Employer</p>
                    </div> */}
                    {/* <div className="ProfilPage_content_details_item">
                        <p><span>FMB: &nbsp; </span>egibilites</p>
                    </div> */}
                </div>
            </div>
        </div>
    )
}


function Modal(params) {
    
}



































function Calendrie() {
    const infosUser = useContext(InfosUsersSession);
    const [date, setDate] = useState("");
    const [adresses, setAdresses] = useState([]);
    const [worked, setWorked] = useState("");
    const [selectedAdress, setSelectedAdress] = useState("");
    const [workedError, setWorkedError] = useState("");
    const [adressError, setAdressError] = useState("");
    const [dates, setDates] = useState([]);
  
    useEffect(() => {
      getDates();
    }, []);
  
    useEffect(() => {
      if (dates.length > 0) {
        console.log("dates :", dates);
        console.log("isEligible(dates) :", isEligible(dates));
        infosUser.eligible = isEligible(dates);
      }
  
      // console.log(JSON.parse(isEligible(dates)));
    }, [dates]);
  
    const getAdresses = async () => {
      try {
        const adress = await database.listDocuments(
          import.meta.env.VITE_APP_DB_ID,
          import.meta.env.VITE_APP_ADRESSES_COLLECTION_ID
        );
        console.log("result :", adress);
        setAdresses(() => adress.documents);
      } catch (error) {
        console.log("error while fetching adresses from db :", error);
      }
    };
    function isEligible(array) {
      console.log("arrayyy", array);
   
      //1 Test si il faut JSON.parse etc...
      let adresseTop;
      let count = 0;
      let top = 0;
      let test;
      for (let i = 0; i < array.length; i++) {
        count = 0;
        test = array[i];
        for (let j = 0; j < array[i].length; j++) {
          if (test.eligible !== null && array[i] !== null) {
            if (array[i].eligible === true) {
              count++;
            }
          }
        }
        if (count > top) {
          top = count;
          adresseTop = test;
        }
      }
      return test.eligible;
    }
    const getDates = async () => {
      try {
        const dates = await database.listDocuments(
          import.meta.env.VITE_APP_DB_ID,
          import.meta.env.VITE_APP_DATES_COLLECTION_ID,
          [Query.equal("user", infosUser.$id)]
        );
        console.log("result :", dates.documents);
        setDates(() => dates.documents);
      } catch (error) {
        console.log("error while fetching dates from db :", error);
      }
    };
  
    const handleClickCaseCalendrier = (infos) => {
      console.log("infos user : ", infosUser);
      getAdresses();
      console.log(infos);
      console.log("type of date : ", typeof infos);
      setDate(() => infos);
      document.querySelector(".modal").style.display = "flex";
    };
    const handleWorkedChange = (e) => {
      console.log("workedtargetvalue :", e.target.value);
      const boolValue = e.target.value === "true";
      setWorked(() => boolValue);
  
      setWorkedError("");
      console.log("boolvalue", boolValue);
      // If no radio button is selected (neither "true" nor "false"), display an error
      if (boolValue !== true && boolValue !== false) {
        setWorkedError("Please select if you worked or not");
      }
    };
    const handleSelectedAdress = (e) => {
      const selectedAddressObject = JSON.parse(e.target.value);
      console.log("Selected address object:", selectedAddressObject);
      setSelectedAdress(() => selectedAddressObject);
    };
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      
      // verification if all fields are filled
      if (!selectedAdress || !worked) {
        // Display error message for each missing field
        if (!selectedAdress) {
          // Show error for selectedAdress
          setAdressError("Please select an adress");
        }
        if (worked !== true && worked !== false) {
          // Show error for worked
          setWorkedError("Please select if you worked or not");
        }
      } else {
        // If all fields are filled, calculate the distance between the user's home and the selected adress to know if the user is eligible or not.
        console.log("home adress :", infosUser.homeAdress);
        console.log("selected adress :", selectedAdress);
        const home = {
          lat: infosUser.geolocHome.split(",")[0],
          lng: infosUser.geolocHome.split(",")[1],
        };
        const client = {
          // GET GEOLOC
          lat: selectedAdress.geolocation.split(",")[0],
          lng: selectedAdress.geolocation.split(",")[1],
        };
        console.log("client geoloc ", client.lat, client.lng);
        const distance = haversine(home.lat, home.lng, client.lat, client.lng);
        console.log("distance :", distance);
  
        console.log("home geoloc", home);
        try {
          await database.createDocument(
            import.meta.env.VITE_APP_DB_ID,
            import.meta.env.VITE_APP_DATES_COLLECTION_ID,
            "unique()",
            {
              date: date,
              clientAdress: selectedAdress.fullAdress,
              worked: worked,
              user: infosUser.$id,
              eligible: distance < 10 ? true : false,
            }
          ).then((response) => {
            console.log("response :", response);
            alert("Data sent");
            window.location.reload();
          })
        } catch (error) {
          
        
            alert("Document already exists");
          
  
        }
        setDate("");
        setWorked("");
        setSelectedAdress("");
        setWorkedError("");
        setAdressError("");
        document.querySelector(".modal").style.display = "none";
      }
    };
  
    return (
      <div className="calendrier">
        <div className="modal">
          <i
            className="fa-solid fa-xmark"
            onClick={() => {
              document.querySelector(".modal").style.display = "none";
            }}
          ></i>
          <form onSubmit={handleFormSubmit}>
            <h3>{date}</h3>
            <br />
            <label>
              Did you work on {date} ?
              <div className="workedError">{workedError}</div>
              <br />
              <label>
                <input
                  type="radio"
                  name="worked"
                  placeholder="travaillé?"
                  value={"true"}
                  onChange={handleWorkedChange}
                />
                Oui
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="worked"
                  placeholder="travaillé?"
                  value={"false"}
                  onChange={handleWorkedChange}
                />
                Non
              </label>
            </label>
            <br />
            <br />
  
            <label>
              Where did you work on {date} ?
              <div className="adressError">{adressError}</div>
              <br />
              <select name="adress" id="adress" onChange={handleSelectedAdress}>
                <option value={""} selected></option>
                <option value={infosUser.homeAdress}>Home</option>
  
                {adresses.map((adress) => {
                  console.log("adress :", adress);
  
                  return (
                    <option
                      key={adress.$id}
                      className={adress.geolocation}
                      value={JSON.stringify(adress)}
                    >
                      {adress.clientName}
                    </option>
                  );
                })}
              </select>
            </label>
  
            <br />
            <br />
            <button className="btn">envoyer</button>
          </form>
        </div>
  
        <div className="calendrier_content">
          <div className="eligible">
            {infosUser.eligible ? "You are eligible" : "You are not eligible"}
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={"dayGridMonth"}
            headerToolbar={{
              start: "title", // will normally be on the left. if RTL, will be on the right
              center: "",
              end: "today,prev,next", // will normally be on the right. if RTL, will be on the left
            }}
            events={dates.map((date) => {
              return {
                title: "Data sent",
                date: date.date,
                color: date.eligible ? "green" : "red",
              };
            })}
            // locale='fr'
            selectable={true}
            dateClick={function (info) {
              // alert('Clicked on: ' + info.dateStr);
              // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
              // alert('Current view: ' + info.view.type);
              // change the day's background color just for fun
              // info.dayEl.style.cursor = "pointer";
              setDate(info.dateStr);
              handleClickCaseCalendrier(info.dateStr);
            }}
          />
        </div>
      </div>
    );
  }
  
  const handleGeocode = (address) => {
    const formattedAddress = address.replace(/ /g, "+");
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${formattedAddress}&key=${
      import.meta.env.VITE_APP_API_KEY_GEOLOC
    }`;
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const lat = data.results[0].geometry.lat;
        const lng = data.results[0].geometry.lng;
      })
      .catch((error) => {
        console.error("Error fetching geocoding data:", error);
      });
  };
  
  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6_371;
    const deltaLat = (lat2 - lat1) * (Math.PI / 180);
    const deltaLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
  
    return distance;
  };
  
  const handleCalculateDistance = () => {
    if (coordinates1 && coordinates2) {
      const distance = haversine(
        coordinates1.lat,
        coordinates1.lng,
        coordinates2.lat,
        coordinates2.lng
      );
      setDistance(distance.toFixed(2)); // Round to 2 decimal places
    }
  };
  
  