import { useEffect, useState } from "react";
import { database } from "../../../../appwrite/config";
import { ID } from "appwrite";

export default function Adresses() {
  const [adresseList, setAdresseList] = useState();
  const [ShowAdresseList, setShowAdresseList] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [modal, setModal] = useState(false);

  const fetchData = async () => {
    if (!adresseList) {
      try {
        const adresses = await database
          .listDocuments(
            import.meta.env.VITE_APP_DB_ID,
            import.meta.env.VITE_APP_ADRESSES_COLLECTION_ID,
            []
          )
          .then((response) => {
            setAdresseList(response.documents);
          });
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    } else {
      if (recherche !== "") {
      } else {
        setShowAdresseList(
          adresseList.map((adresse, index) => {
            return (
              <tr key={index}>
                <td>{adresse.fullAdress}</td>
                <td>{adresse.clientName}</td>
              </tr>
            );
          })
        );
      }
    }
  };

  const handleChange = (event) => {
    let value = event.target.value.toLowerCase();
    setRecherche(value);
    let newAdresseList = [...adresseList];

    newAdresseList = newAdresseList.filter(
      (adresse) =>
        adresse.fullAdress.toLowerCase().includes(value) ||
        adresse.clientName.toLowerCase().includes(value)
    );

    setShowAdresseList(
      newAdresseList.map((adresse, index) => {
        return (
          <tr key={index}>
            <td>{adresse.fullAdress}</td>
            <td>{adresse.clientName}</td>
          </tr>
        );
      })
    );
  };

  const handleClickModal = () => {
    console.log("modal");
    setModal(<ModalAdresse closeModal={setModal} />);
  };

  useEffect(() => {
    fetchData();
  }, [adresseList, modal, recherche]);

  return (
    <div className="list_adresses">
      {modal}
      <div className="search">
        <input
          type="text"
          placeholder="Recherche"
          value={recherche}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleClickModal}>Add a new adress</button>

      <table>
        <thead>
          <tr>
            <th>Adress</th>
            <th>Client name</th>
          </tr>
        </thead>

        <tbody>{ShowAdresseList}</tbody>
      </table>
    </div>
  );
}

function ModalAdresse(props) {
  const [newAdress, setNewAdress] = useState("");
  const [newAdressClient, setNewAdressClient] = useState("");
  const [geo, setGeo] = useState("");

  const handleChangeAdress = (event) => {
    let valueAdress = event.target.value;
    console.log(valueAdress);
    setNewAdress(valueAdress);
  };

  const handleChangeAdressClient = (event) => {
    let valueAdressClient = event.target.value;
    setNewAdressClient(valueAdressClient);
  };

  const handleSubmite = async (e) => {
    e.preventDefault();

    if (newAdress === "" || newAdressClient === "") {
      alert("Please complete all fields");
    } else {
      if (geo === "") {
        const formattedAddress = newAdress.replace(/ /g, "+");
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${formattedAddress}&key=${
          import.meta.env.VITE_APP_API_KEY_GEOLOC
        }`;
        await fetch(url)
          .then((response) => response.json())
          .then((data) => {
            const lat = data.results[0].geometry.lat;
            const lng = data.results[0].geometry.lng;
            console.log("lat", lat);
            console.log("lng", lng);
            database
              .createDocument(
                import.meta.env.VITE_APP_DB_ID,
                import.meta.env.VITE_APP_ADRESSES_COLLECTION_ID,
                ID.unique(),
                {
                  fullAdress: newAdress,
                  geolocation: lat + "," + lng,
                  clientName: newAdressClient,
                }
              )
              .then((response) => {
                console.log(response);
                alert("Client created");
                window.location.reload();
              })
              .catch((error) => {
                console.error("Client not created " + error);
              });
          })
          .catch((error) => {
            console.error("Error fetching geocoding data:", error);
          });
      }
    }
  };

  const handleClickOffModal = () => {
    props.closeModal(false);
  };

  return (
    <div className="show_modal_adresse">
      <button className="btn_off_modal" onClick={handleClickOffModal}>
        Close
      </button>
      <form>
        <div className="ProfilPage">
          <div className="ProfilPage_content">
            <div className="ProfilPage_content_details">
              <div className="ProfilPage_content_details_item">
                <h2>Add a new adress</h2>
              </div>
              <div className="ProfilPage_content_details_item">
                <input
                  type="text"
                  name="adresse"
                  placeholder="Adresse"
                  value={newAdress}
                  onChange={handleChangeAdress}
                />
              </div>
              <div className="ProfilPage_content_details_item">
                <input
                  type="text"
                  name="client"
                  placeholder="Client"
                  value={newAdressClient}
                  onChange={handleChangeAdressClient}
                />
              </div>
              <div className="ProfilPage_content_details_item">
                <button onClick={handleSubmite}>Add</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
