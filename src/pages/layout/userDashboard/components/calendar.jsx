import { useEffect, useState, useContext } from "react";
import { InfosUsersSession } from "../../../dashboard/Dashboard";

import { database } from "../../../../appwrite/config";
import { Query } from "appwrite";

// CALENDRIER start
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// CALENDRIER end

export default function Calendar() {
  const infosUser = useContext(InfosUsersSession);
  const [date, setDate] = useState("");
  const [adresses, setAdresses] = useState([]);
  const [worked, setWorked] = useState("");
  const [selectedAdress, setSelectedAdress] = useState("");
  const [workedError, setWorkedError] = useState("");
  const [adressError, setAdressError] = useState("");
  const [dates, setDates] = useState([]);
  const [showEligibility, setShowEligibility] = useState(false);
  

  const [accessSelectedAdress, setAccessSelectedAdress] = useState(true);
  const [isWorkedOrNot, setIsWorkedOrNot] = useState(true);

  useEffect(() => {
    getDates();
  }, []);

  useEffect(() => {
    if (dates.length > 0) {
      updateEligibility();
    }else{
      database.updateDocument(
        import.meta.env.VITE_APP_DB_ID,
        import.meta.env.VITE_APP_USER_COLLECTION_ID,
        infosUser.$id,
        {
          eligible: false,
        }
      );
    }

    // console.log(JSON.parse(isEligible(dates)));
  }, [dates, infosUser]);
  const updateEligibility = async () => {
    try {
      await database.updateDocument(
        import.meta.env.VITE_APP_DB_ID,
        import.meta.env.VITE_APP_USER_COLLECTION_ID,
        infosUser.$id,
        {
          eligible: isEligible(dates.filter((date) => date.worked === true)),
        }
      );
    } catch (error) {
      console.log("error while updating user eligibility :", error);
    }
  };
  const getAdresses = async () => {
    try {
      const adress = await database.listDocuments(
        import.meta.env.VITE_APP_DB_ID,
        import.meta.env.VITE_APP_ADRESSES_COLLECTION_ID
      );
      setAdresses(() => adress.documents);
    } catch (error) {
      console.log("error while fetching adresses from db :", error);
    }
  };

  

  function isEligible(array) {
    console.log("arrayyy", array);
    
    let adresseTop;
    let count = 0;
    let top = 0;
    let test;
    let flag = false;
    

    for (let i = 0; i < array.length; i++) {
        count = 0;
        test = array[i];
        
        for (let j = 0; j < array.length; j++) {
            if (array[j].clientAdress === test.clientAdress) {
                count++;
            }
        }

        if (count > top || (count === top && !flag)) {
            top = count;
            adresseTop = test;
            flag = adresseTop.eligible;
        }
    }

    
    if (adresseTop) {
      setShowEligibility(adresseTop.eligible);
      return adresseTop.eligible;
    }
    return false;
    
}
  

  const getDates = async () => {
    try {
      const dates = await database.listDocuments(
        import.meta.env.VITE_APP_DB_ID,
        import.meta.env.VITE_APP_DATES_COLLECTION_ID,
        [Query.equal("user", infosUser.$id), Query.limit(100)]
      );
      
      setDates(() => dates.documents);
    } catch (error) {
      console.log("error while fetching dates from db :", error);
    }
  };

  const handleClickCaseCalendrier = (infos) => {
    getAdresses();
    setDate(() => infos);
    document.querySelector(".modal").style.display = "flex";
  };
  const handleWorkedChange = (e) => {
    const boolValue = e.target.value === "true";

    setWorked(() => boolValue);

    if (e.target.value === "true") {
      setIsWorkedOrNot(false);
      setAccessSelectedAdress(false);
    }else if (e.target.value === "false"){
      setIsWorkedOrNot(true);
      setAccessSelectedAdress(true);
    }

    setWorkedError("");
    // If no radio button is selected (neither "true" nor "false"), display an error
    if (boolValue !== true && boolValue !== false) {
      setWorkedError("Please select if you worked or not");
    }
  };
  const handleSelectedAdress = (e) => {
    const selectedAddressObject = JSON.parse(e.target.value);
    setSelectedAdress(() => selectedAddressObject);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    
    for (let i = 0; i < dates.length; i++) {
      if (
        dates[i].date.split("T")[0] === date &&
        dates[i].user.$id === infosUser.$id
      ) {
        alert("You already filled this date, please select another date");
        window.location.reload();
      }
    }
    

    // verification if all fields are filled
    if (!selectedAdress || !worked) {
      // Display error message for each missing field
      if (!selectedAdress) {
        // Show error for selectedAdress
        if (worked === false) {
          setAdressError("");
          try {
            await database
              .createDocument(
                import.meta.env.VITE_APP_DB_ID,
                import.meta.env.VITE_APP_DATES_COLLECTION_ID,
                "unique()",
                {
                  date: date,
                  clientAdress:"didn't work",
                  clientName: "didn't work",
                  worked: worked,
                  user: infosUser.$id,
                  eligible: false,
                }
              )
              .then((response) => {
                console.log("response :", response);
                alert("Data sent");
                window.location.reload();
              });
          } catch (error) {
            console.log("error while creating document in date table :", error);
          }
        } else {
          setAdressError("Please select an adress");
        }
      }
      if (worked !== true && worked !== false) {
        // Show error for worked
        setWorkedError("Please select if you worked or not");
      }
    } else {
      // If all fields are filled, calculate the distance between the user's home and the selected adress to know if the user is eligible or not.
      const home = {
        lat: infosUser.geolocHome.split(",")[0],
        lng: infosUser.geolocHome.split(",")[1],
      };

      //if the user selected his home adress, the distance is 0
      let distance;
      if (selectedAdress === infosUser.homeAdress) {
        distance = 0;
      } else {
        const client = {
          // GET GEOLOC
          lat: selectedAdress.geolocation.split(",")[0],
          lng: selectedAdress.geolocation.split(",")[1],
        };
        
        distance = haversine(home.lat, home.lng, client.lat, client.lng);
      }
      try {
        await database
          .createDocument(
            import.meta.env.VITE_APP_DB_ID,
            import.meta.env.VITE_APP_DATES_COLLECTION_ID,
            "unique()",
            {
              date: date,
              clientAdress:
                selectedAdress === infosUser.homeAdress
                  ? infosUser.homeAdress
                  : selectedAdress.fullAdress,
              clientName:
                selectedAdress === infosUser.homeAdress
                  ? "Home"
                  : selectedAdress.clientName,
              worked: worked,
              user: infosUser.$id,
              eligible: distance < 10 ? true : false,
            }
          )
          .then((response) => {
            alert("Data sent");
            window.location.reload();
          });
      } catch (error) {
        console.log("error while creating document in date table :", error);
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
        <form className="modal_calendrier_case_form_content" onSubmit={handleFormSubmit}>
          <h3>{date}</h3>
          <label>Did you work on {date} ?</label>
          <div className="workedError">{workedError}</div>

          <div className="bloc_inputs">
          <input  
            id="worked_yes"
            type="radio" 
            name="worked"
            placeholder="travaillé?"
            value={"true"}
            onChange={handleWorkedChange} />
            <label htmlFor="worked_yes" className="label_worked">
              yes</label>

            <input 
              id="worked_no"
              type="radio" 
              name="worked"
              placeholder="travaillé?"
              value={"false"}
              onChange={handleWorkedChange} />
            <label htmlFor="worked_no" className="label_worked">
              no</label>
          </div>


          <label>Where did you work on {date} ?</label>
          <div className="adressError">{adressError}</div>

          <select
              disabled={accessSelectedAdress}
              name="adress"
              id="adress"
              defaultValue={""}
              onChange={handleSelectedAdress}>
              <option></option>
              <option value={JSON.stringify(infosUser.homeAdress)}>Home</option>

              {adresses.map((adress) => {
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

            <button className="btn">Send</button>
        </form>
      </div>

      <div className="calendrier_content">
        <div className="eligible">
          {showEligibility ? (
            <p style={{ color: "green" }}>You are eligible for this month</p>
          ) : (
            <p style={{ color: "red" }}>You are not eligible for this month</p>
          )}
          <br />
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={"dayGridMonth"}
          headerToolbar={{
            start: "title", // will normally be on the left. if RTL, will be on the right
            center: "",
            end: "", // will normally be on the right. if RTL, will be on the left
          }}
          events={dates.map((date) => {
            if (date.clientAdress === "didn't work"){
              return {
                title: "didn't work",
                date: date.date,
                color: "grey",
              };
            } else {
              return {
                title: date.clientName,
                date: date.date,
                color: date.eligible ? "green" : "red",
              };
            }
            
          })}
          // locale='fr'
          selectable={true}
          dateClick={function (info) {
            setDate(info.dateStr);
            handleClickCaseCalendrier(info.dateStr);
          }}
        />
      </div>
    </div>
  );
}

export const handleGeocode = (address) => {
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

export const haversine = (lat1, lon1, lat2, lon2) => {
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

export const handleCalculateDistance = () => {
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
