import { useNavigate } from "react-router";
import { InfosUsersSession } from "../../../dashboard/Dashboard";
import { useState, useContext } from "react";
import { database } from "../../../../appwrite/config";

export default function Adresse(props) {
    const infosUser = useContext(InfosUsersSession);

    const navigate = useNavigate();

    const [adresse, setAdresse] = useState("");
    // const [newAdress , setNewAdress] = useState("")

    const handleAdresseChange = (e) => {
    setAdresse(e.target.value);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform the logic to update the user's address
    console.log("New address:", adresse);

    const formattedAddress = adresse.replace(/ /g, "+");
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
            .updateDocument(
            infosUser.$databaseId,
            infosUser.$collectionId,
            infosUser.$id,
            {
                homeAdress: adresse,
                geolocHome: lat + "," + lng,
            }
            )
            .then((response) => {
            alert("Address successfully modified");
            window.location.reload();
            })
            .catch((error) => {
            console.log("error updating address");
            console.log(error);
            });
        })
        .catch((error) => {
        console.error("Error fetching geocoding data:", error);
        });
    };

    return (
    <div className="adresse">
        <div className="adresse_details_item">
        <p>
            <span>Current address: &nbsp; </span>
            {infosUser.homeAdress}
        </p>
        </div>

        <form onSubmit={handleSubmit}>
        <input
            type="text"
            value={adresse}
            onChange={handleAdresseChange}
            placeholder="Update your address"
        />
        <button type="submit">Update</button>
        </form>
    </div>
    );
}