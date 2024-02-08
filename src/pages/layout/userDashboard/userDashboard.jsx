import { useEffect, useState, useContext } from "react";
import { InfosUsersSession } from "../../dashboard/Dashboard";
import { account, database } from "../../../appwrite/config";

// CALENDRIER start
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Query } from "appwrite";
// CALENDRIER end

export default function UserDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  // ROUTES-TEST start
  const [showComposant, setShowComposant] = useState("calendrier");
  const [showPage, setShowPage] = useState();
  const route = [
    { path: "profil", composant: <ProfilPage /> },
    { path: "calendrier", composant: <Calendrie /> },
    { path: "adresse", composant: <Adresse /> },
  ];
  useEffect(() => {
    if (window.location.hash) {
      route.find((e) => e.path === window.location.hash.split("/")[1])
        ? setShowComposant(window.location.hash.split("/")[1])
        : setShowComposant("calendrier");
    } else {
    }
  });
  useEffect(() => {
    if (route.find((e) => e.path === showComposant)) {
      setShowPage(route.find((e) => e.path === showComposant).composant);
    } else {
    }
  }, [showComposant]);
  // ROUTES-TEST end

  function isMenuOpenOrClouse() {
    const aside = document.querySelector("aside");
    setIsMenuOpen(!isMenuOpen);

    if (isMenuOpen) {
      aside.classList.remove("aside_off");
      aside.classList.add("aside_on");
    } else {
      aside.classList.remove("aside_on");
      aside.classList.add("aside_off");
    }
  }

  return (
    <>
      <SideBar
        isMenuOpenOrClouse={() => isMenuOpenOrClouse()}
        setShowComposant={setShowComposant}
      />
      <div id="content">
        <Header
          isMenuOpenOrClouse={() => isMenuOpenOrClouse()}
          setShowComposant={setShowComposant}
        />
        <Main showPage={showPage} />
      </div>
    </>
  );
}

function SideBar(props) {
  const handleClick = () => {
    props.isMenuOpenOrClouse();
  };

  const handleClickPage = (page) => {
    props.setShowComposant(page);
  };

  const handleDeleteSession = async () => {
    console.log("test");
    await account.deleteSession("current");
    // setLoggedInUser(null);
    // setUser(null);
  };

  return (
    <aside className=" aside_off">
      <div className="slideBar">
        <div className="logo">
          <img src="../public/assets/logo.png" alt="logo" />
        </div>

        {/* <i onClick={handleClick} className='bx bxs-chevron-left btn_off_slideBar'></i> */}
        <i
          onClick={handleClick}
          className="fa-solid fa-chevron-left btn_off_slideBar"
        ></i>

        <nav>
          <ul>
            <h3>MENU</h3>
            <li onClick={handleClick}>
              <a
                href="#/calendrier"
                onClick={() => handleClickPage("calendrier")}
              >
                <i className="fa-regular fa-calendar-days"></i> Calendrier
              </a>
            </li>

            <li onClick={handleClick}>
              <a href="#/adresse" onClick={() => handleClickPage("adresse")}>
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
  );
}

function Header(props) {
  const infosUser = useContext(InfosUsersSession);

  const [nom, setNom] = useState("");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    if (infosUser) {
      setNom(infosUser.firstName + " " + infosUser.lastName);
      setPhoto(infosUser.profile_picture);
    }
  }, [infosUser]);

  const handleClickPage = (page) => {
    props.setShowComposant(page);
  };

  const handleClick = () => {
    props.isMenuOpenOrClouse();
  };

  return (
    <header className="">
      <div className="header_content">
        <button onClick={() => handleClick()} className="burger">
          <span></span>
          <span className="middle"></span>
          <span></span>
        </button>

        <div className="header_content_profil">
          <div className="infos">
            <span className="nom">{nom}</span>
            <span className="role">User</span>
          </div>
          <a href="#/profil" className="photo_profil">
            <img
              src={photo}
              alt="photo profil"
              onClick={() => handleClickPage("profil")}
            />
          </a>
        </div>
      </div>
    </header>
  );
}

function Main(props) {
  return (
    <main className="bg_color_2">
      <h2>Main</h2>
      {props.showPage}
    </main>
  );
}

// composants

function Adresse() {
  return (
    <div className="adresse">
      <h2>Adresse</h2>
    </div>
  );
}

function ProfilPage() {
  return (
    <div>
      <h2>ProfilPage</h2>
    </div>
  );
}

function Calendrie() {
  const infosUser = useContext(InfosUsersSession);
  const [date, setDate] = useState("");
  const [adresses, setAdresses] = useState([]);
  const [worked, setWorked] = useState("");
  const [selectedAdress, setSelectedAdress] = useState("");
  const [workedError, setWorkedError] = useState("");
  const [adressError, setAdressError] = useState("");
  const [coordinates, setCoordinates] = useState(null);
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
        lat: selectedAdress.split(",")[0],
        lng: selectedAdress.split(",")[1],
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
            clientAdress: selectedAdress,
            worked: worked,
            user: infosUser.$id,
            eligible: true,
          }
        );
      } catch (error) {
        console.log(
          "Error when trying to create a new document in date table : ",
          error
        );
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
                    value={adress}
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
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={"dayGridMonth"}
          headerToolbar={{
            start: "title", // will normally be on the left. if RTL, will be on the right
            center: "",
            end: "today,prev,next", // will normally be on the right. if RTL, will be on the left
          }}
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
const api_key = "b780a02d9a6942d48aadc1eaf772c96e";
