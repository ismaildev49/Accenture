import { database } from "../../../../appwrite/config";
import { useEffect, useState } from 'react'
import { Query } from 'appwrite';

export default function Employees(){
    const [userList, setUserList] = useState();
    const [ ShowUserList, setShowUserList ] = useState([])
    const [recherche, setRecherche] = useState('')
    const [modal, setModal] = useState(false)

    const fetchData = async () => {
        if (!userList) {
            try {
                const users = await database.listDocuments(
                    import.meta.env.VITE_APP_DB_ID,
                    import.meta.env.VITE_APP_USER_COLLECTION_ID,
                    [
                        Query.equal("isAdmin", false)
                    ]
                ).then((response) => {
                    setUserList(response.documents);
                })
            } catch (error) {
                console.error("Error fetching user list:", error);
            }
        }else{
            if (recherche !== "") {
            }else{
                setShowUserList(userList.map((user, index) => {

                    return <tr key={index} onClick={()=>modalUser(user.$id)}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>Employee</td>
                            {user.eligible ? <td style={{color: 'green'}}>Eligible</td> : <td style={{color: 'red'}}>Not eligible</td>}
                        </tr>
                }))
            }
        }
    };

    const handleChange = (event) => {
        let value = event.target.value.toLowerCase()
        setRecherche(value)
        let newUsersList = [...userList]
        console.log(newUsersList);
        newUsersList = newUsersList.filter(user => user.firstName.toLowerCase().includes(value) || user.lastName.toLowerCase().includes(value))
        console.log(newUsersList);
        setShowUserList(newUsersList.map((user, index) => {

            return <tr key={index} onClick={()=> modalUser(user.$id)}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>Employee</td>
                    {user.eligible ? <td style={{color: 'green'}}>Eligible</td> : <td style={{color: 'red'}}>Not eligible</td>}
                </tr>
        }))
    }


    function modalUser(params) {
        
        return userList.map((user, index) => {
            user.$id === params ? 
            setModal(
                <Modal closeModal={setModal} user={user} />
            ) : null 
        })
    }
    

    useEffect(() => {
        fetchData();
    }, [userList,recherche,modal]);

    return(
        <div className='list_users'>
            <div className="showModal">
                {modal}
            </div>

            <div className="search">
                <input type="text" placeholder='Search' value={recherche} onChange={handleChange} />
            </div>

            <table>
            <thead>
                <tr>
                <th>First name</th>
                <th>Last name</th>
                <th>Role</th>
                <th>Eligibility</th>
                </tr>
            </thead>

            <tbody>
                {ShowUserList}
            </tbody>
            </table>
        </div>
    )
}


function Modal(props) {
    const [showHistorique, setShowHistorique] = useState([])
    const [showHistoriqueTitre, setShowHistoriqueTitre] = useState(false)
    const [listHistorique, setListHistorique] = useState([])

    function fetchData() {
        database.listDocuments(
            import.meta.env.VITE_APP_DB_ID,
            import.meta.env.VITE_APP_DATES_COLLECTION_ID,
            [
                Query.equal("user", props.user.$id)
            ]
        ).then((response) => {
            
            if (response.documents.length > 0) {
                setListHistorique(response.documents);
            }else{
                setListHistorique(null);
            }

        }).catch((error) => {
            console.error("Error fetching user list:", error);
        });
    }

    const handleClickOffModal = () => {
        props.closeModal(false)
    }

    const handleHistorique = () => {
        console.log("history");
        if (showHistorique.length === 0) {
            if (listHistorique == null) {
                setShowHistoriqueTitre(false)
                setShowHistorique(
                        <div className="historique_item">
                            <p>No address in the list</p>
                        </div>
                    )
            }else{
                setShowHistoriqueTitre(true)
                setShowHistorique(
                    listHistorique.map((date, index) => {
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
                )
            }
        }else{
            setShowHistoriqueTitre(false)
            setShowHistorique([])
        }
    }

    useEffect(() => {
        fetchData();
    }, [showHistorique]);
    
    return (
        <div className="show_modal_user_item">
            <div className='ProfilPage'>
                <div className="ProfilPage_content">
                    <div className="ProfilPage_content_photo">
                        <img src={props.user.profile_picture} alt="photo profil" />
                    </div>

                    <button className='btn_off_modal' onClick={handleClickOffModal}>Close</button>

                    <div className="ProfilPage_content_details">
                        <div className="ProfilPage_content_details_item">
                            <h2>{props.user.firstName} {props.user.lastName}</h2>
                        </div>
                        <div className="ProfilPage_content_details_item">
                            <p>Employee</p> <span className='line'></span> 
                            {props.user.eligible ? <p style={{color: 'green'}}>Eligible</p> : <p style={{color: 'red'}}>Not eligible</p>}  
                        </div>
                        <div className="ProfilPage_content_details_item">
                            <p><span>Address: &nbsp; </span>{props.user.homeAdress}</p>
                        </div>
                        <div className="ProfilPage_content_details_item">
                            <p><span>Email: &nbsp; </span>{props.user.email}</p>
                        </div>
                        <div className="ProfilPage_content_details_item">
                            <p><span>Phone: &nbsp; </span>{props.user.phone}</p>
                        </div>
                    </div>

                    <div className="historique">
                        <button onClick={() => handleHistorique()}>History:</button>
                        <div className="historique_items">
                            {
                                showHistoriqueTitre ? 
                                <div className="historique_item historique_item_titre">
                                    <p>Client:</p>
                                    <p>Client address:</p>
                                    <p>Date:</p>
                                    <p>FMB:</p>
                                </div> : ""
                            }
                            {showHistorique}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}