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

  const [accessSelectedAdress, setAccessSelectedAdress] = useState(true);
  const [isWorkedOrNot, setIsWorkedOrNot] = useState(true);

  useEffect(() => {
    getDates();
    // console.log(" infosUser ------------> " + JSON.stringify(infosUser));
  }, []);

  useEffect(() => {
    if (dates.length > 0) {
      console.log("dates :", dates);
      console.log(
        "isEligible(dates) :",
        isEligible(dates.filter((date) => date.worked === true))
      );
      updateEligibility();
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
        [Query.equal("user", infosUser.$id), Query.limit(100)]
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
    const boolValue = e.target.value === "true";

    setWorked(() => boolValue);

    console.log("e.target.value", e.target.value);

    if (e.target.value === "true") {
      setIsWorkedOrNot(false);
      setAccessSelectedAdress(false);
    }else if (e.target.value === "false"){
      setIsWorkedOrNot(true);
      setAccessSelectedAdress(true);
    }

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

    dates.forEach((element) => {
      console.log("split from database date", element.date.split("T")[0], date);
      console.log("user verification :", element.user, infosUser.$id);
    });

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
      console.log("home adress :", infosUser.homeAdress);
      console.log("selected adress :", selectedAdress);
      const home = {
        lat: infosUser.geolocHome.split(",")[0],
        lng: infosUser.geolocHome.split(",")[1],
      };
      console.log("home :", home);

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
        console.log("client geoloc ", client.lat, client.lng);
        distance = haversine(home.lat, home.lng, client.lat, client.lng);
        console.log("distance :", distance);

        console.log("home geoloc", home);
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
              worked: worked,
              user: infosUser.$id,
              eligible: distance < 10 ? true : false,
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
              Yes
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
              No
            </label>
          </label>
          <br />
          <br />

          <label>
            Where did you work on {date} ?
            <div className="adressError">{adressError}</div>
            <br />
            <select
              disabled={accessSelectedAdress}
              name="adress"
              id="adress"
              defaultValue={""}
              onChange={handleSelectedAdress}
            >
              <option></option>
              <option value={JSON.stringify(infosUser.homeAdress)}>Home</option>

              {adresses.map((adress) => {
                // console.log("adress :", adress);

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
          <button className="btn">Send</button>
        </form>
      </div>

      <div className="calendrier_content">
        <div className="eligible">
          {infosUser.eligible ? (
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
                title: date.clientAdress,
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
