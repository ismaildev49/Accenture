import { useEffect, useState, useContext } from "react";
import { InfosUsersSession } from "../../../dashboard/Dashboard";
import { database } from "../../../../appwrite/config";
import { Query } from "appwrite";

export default function History() {
    const infosUser = useContext(InfosUsersSession);
    const [listHistorique, setListHistorique] = useState([]);

    function fetchData() {
    if (listHistorique.length === 0) {
        database
        .listDocuments(
            import.meta.env.VITE_APP_DB_ID,
            import.meta.env.VITE_APP_DATES_COLLECTION_ID,
            [Query.equal("user", infosUser.$id, Query.limit(100))]
        )
        .then((response) => {
            if (response.documents.length > 0) {
            setListHistorique(
                response.documents.map((date, index) => {
                    let dateObj = date.date.split('T')[0]
                    if (date.clientAdress === "didn't work") {
                        return (
                            <div key={index} className="historique_item">
                                <p>{date.clientAdress}</p>
                                <p>---</p>
                                <p>{dateObj}</p>
                                <p>---</p>
                            </div>
                        );
                    }else{
                        return (
                            <div key={index} className="historique_item">
                                <p>{date.clientName}</p>
                                <p>{date.clientAdress}</p>
                                <p>{dateObj}</p>
                                {date.eligible ? <p style={{color: 'green'}}>eligible</p> : <p style={{color: 'red'}}>not eligible</p>}
                            </div>
                        );
                    }
                })
            );
            } else {
            setListHistorique(
                <div className="historique_item">
                <p>No adress in the list</p>
                </div>
            );
            }
        })
        .catch((error) => {
            console.error("Error fetching user list:", error);
        });
    }
    }

    useEffect(() => {
    fetchData();
    }, [listHistorique]);

    return (
    <div className="historique">
        <div className="historique_items">
            <div className="historique_item historique_item_titre">
                <p>Client:</p>
                <p>Client address:</p>
                <p>Date:</p>
                <p>FMB:</p>
            </div>
            {listHistorique}
        </div>
    </div>
    );
}