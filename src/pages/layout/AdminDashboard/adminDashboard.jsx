import { useEffect, useState, useContext, createContext } from 'react'
import { InfosUsersSession } from '../../dashboard/Dashboard'
import { account, database } from "../../../appwrite/config";
import { Databases, Query, ID } from 'appwrite';
import { useNavigate } from 'react-router';


export default function AdminDashboard() {
    
    const [isMenuOpen, setIsMenuOpen] = useState(true)

    // ROUTES-TEST start
    const [showComposant, setShowComposant] = useState("users");
    const [showPage, setShowPage] = useState();
    const [ titrePage, setTitrePage] = useState("users")
    
    const route = [
        {path: "users", composant: <Users />},
        {path: "profil", composant: <ProfilPage />},
        {path: "adresses", composant: <Adresse />}
    ]
    const changeComposant = (composant="") => {
        if (composant == "") {
            if (window.location.hash) {
                setShowPage(route.find(e => e.path === window.location.hash.split('/')[1]).composant)
                setTitrePage(window.location.hash.split('/')[1])
            }else{
                setShowPage(route.find(e => e.path === "users").composant)
                setTitrePage("users")
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
                        <a onClick={() => handleClickPage("users")}>
                            <i className="fa-solid fa-users"></i> Utilisateurs
                        </a>
                    </li>

                    <li onClick={handleClick}>
                        <a onClick={() => handleClickPage("adresses")}>
                            <i className="fa-solid fa-gears"></i> Adresses
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

    // console.log(infosUser);

    const [nom, setNom] = useState("")
    const [photo, setPhoto] = useState("")

    useEffect(() => {
        if(infosUser){
            setNom(infosUser.firstName + " " + infosUser.lastName)
            setPhoto(infosUser.profile_picture)
        }
    }, [infosUser])


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
                <span className='role'>Admin, RH</span>
            </div>
            <a className='photo_profil click_none'>
                <img src={photo} alt="photo profil" />
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
        <div className="main_content">
            {props.showPage}
        </div>
    </main>
    )
}



// composants
function Users(){
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
                            <td>Employé</td>
                            <td>{user.eligible ? "eligible" : "non eligible"}</td>
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
                    <td>Employé</td>
                    <td>{user.eligible ? "eligible" : "non eligible"}</td>
                </tr>
        }))
    }


    function modalUser(params) {
        // console.log('test modal -> ' + params);
        // setModal(
        //     <Modal />
        // )
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
                <input type="text" placeholder='Recherche' value={recherche} onChange={handleChange} />
            </div>

            <table>
            <thead>
                <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Role</th>
                <th>Éligibilité</th>
                </tr>
            </thead>

            <tbody>
                {ShowUserList}
            </tbody>
            </table>
        </div>
    )
}

function Adresse(){

    const [adresseList, setAdresseList] = useState();
    const [ ShowAdresseList, setShowAdresseList ] = useState([])
    const [recherche, setRecherche] = useState('')
    const [modal, setModal] = useState(false)

    const fetchData = async () => {
        if (!adresseList) {
            try {
                const adresses = await database.listDocuments(
                    import.meta.env.VITE_APP_DB_ID,
                    import.meta.env.VITE_APP_ADRESSES_COLLECTION_ID,
                    []
                ).then((response) => {
                    setAdresseList(response.documents);
                })
            } catch (error) {
                console.error("Error fetching user list:", error);
            }
        }else{
            if (recherche !== "") {
            }else{
                setShowAdresseList(adresseList.map((adresse, index) => {
                    return <tr key={index} >
                            <td>{adresse.fullAdress}</td>
                            <td>{adresse.clientName}</td>
                        </tr>
                }))
            }
        }
    };

    const handleChange = (event) => {
        let value = event.target.value.toLowerCase()
        setRecherche(value)
        let newAdresseList = [...adresseList]
        
        newAdresseList = newAdresseList.filter(adresse => adresse.fullAdress.toLowerCase().includes(value) || adresse.clientName.toLowerCase().includes(value))
        
        setShowAdresseList(newAdresseList.map((adresse, index) => {
            return <tr key={index} >
            <td>{adresse.fullAdress}</td>
            <td>{adresse.clientName}</td>
        </tr>
        }))
    }

    const handleClickModal = () => {
        console.log('modal');
        setModal(
            <ModalAdresse closeModal={setModal} />
        )
    }

    useEffect(() => {
        fetchData();
    }, [adresseList, modal, recherche]);
    
    return(
        <div className='list_adresses'>
            {modal}
            <div className="search">
                <input type="text" placeholder='Recherche' value={recherche} onChange={handleChange} />
            </div>

            <button onClick={handleClickModal}>Ajouter une nouvelle adresse</button>

            <table>
                <thead>
                    <tr>
                        <th>Adresse</th>
                        <th>Client</th>
                    </tr>
                </thead>

                <tbody>
                    {ShowAdresseList}
                </tbody>
            </table>
        </div>
    )
}


function ProfilPage(){
    return(
    <div className='ProfilPage'>
        <h2>ProfilPage</h2>
    </div>
    )
}

function Modal(props) {
    const [showHistorique, setShowHistorique] = useState([])
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
        if (showHistorique.length === 0) {
            if (listHistorique == null) {
                setShowHistorique(
                        <div className="historique_item">
                            <p>Aucun adresse dans la liste</p>
                        </div>
                    )
            }else{
                setShowHistorique(
                    listHistorique.map((date, index) => {
                        let dateObj = date.date.split('T')[0]
                        return (
                            <div key={index} className="historique_item">
                                <p>{date.clientAdress}</p>
                                <p>{dateObj}</p>
                                <p>{date.eligible ? "eligible" : "non eligible"}</p>
                            </div>
                            )
                    })
                )
            }
        }
        // else{
        //     setShowHistorique(
        //         <div key={index} className="historique_item">
        //             <p>Aucun adresse dans la liste</p>
        //         </div>
        //     )
        // }
    }

    useEffect(() => {
        fetchData();
    }, [showHistorique, listHistorique]);
    
    return (
        <div className="show_modal_user_item">
            <div className='ProfilPage'>
                <div className="ProfilPage_content">
                    <div className="ProfilPage_content_photo">
                        <img src={props.user.profile_picture} alt="photo profil" />
                    </div>

                    <button className='btn_off_modal' onClick={handleClickOffModal}>Fermer</button>

                    <div className="ProfilPage_content_details">
                        <div className="ProfilPage_content_details_item">
                            <h2>{props.user.firstName} {props.user.lastName}</h2>
                        </div>
                        <div className="ProfilPage_content_details_item">
                            <p>Employer</p> <span className='line'></span> <p>{props.user.eligible ? "eligible" : "non eligible"}</p>  
                        </div>
                        <div className="ProfilPage_content_details_item">
                            <p><span>Adresse: &nbsp; </span>{props.user.homeAdress}</p>
                        </div>
                        <div className="ProfilPage_content_details_item">
                            <p><span>Email: &nbsp; </span>email@email.com</p>
                        </div>
                        <div className="ProfilPage_content_details_item">
                            <p><span>GSM: &nbsp; </span>0000.000.000.000</p>
                        </div>
                    </div>

                    <div className="historique">
                        <button onClick={handleHistorique}>Historique:</button>
                        <div className="historique_items">
                            {showHistorique}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ModalAdresse(props) {
    const [newAdress , setNewAdress] = useState("")
    const [newAdressClient , setNewAdressClient] = useState("")
    const [geo, setGeo] = useState("")

    const handleChangeAdress = (event) => {
        let valueAdress = event.target.value
        console.log(valueAdress);
        setNewAdress(valueAdress)
    } 

    const handleChangeAdressClient = (event) => {
        let valueAdressClient = event.target.value
        setNewAdressClient(valueAdressClient)
    } 

    const handleSubmite = async (e) => {
        e.preventDefault()

        if (newAdress === "" || newAdressClient === "") {
            alert("Veuillez remplir tous les champs")
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
                        console.log("lat",lat);
                        console.log("lng",lng);
                        database.createDocument(
                            import.meta.env.VITE_APP_DB_ID,
                            import.meta.env.VITE_APP_ADRESSES_COLLECTION_ID,
                            ID.unique(),
                            {
                                fullAdress: newAdress,
                                geolocation: lat+","+lng,
                                clientName: newAdressClient
                            }
                        ).then((response) => {
                            console.log(response);
                            alert("document created");
                            window.location.reload();
                            }
                        ).catch((error) => {
                            console.error("document no created " + error);
                        });
                    })
                    .catch((error) => {
                        console.error('Error fetching geocoding data:', error);
                    });
            }
        }
    }

    const handleClickOffModal = () => {
        props.closeModal(false)
    }

    return (
        <div className="show_modal_adresse">
            <button className='btn_off_modal' onClick={handleClickOffModal}>Fermer</button>
            <form >
                <div className='ProfilPage'>
                    <div className="ProfilPage_content">
                        <div className="ProfilPage_content_details">
                            <div className="ProfilPage_content_details_item">
                                <h2>Ajouter une nouvelle adresse</h2>
                            </div>
                            <div className="ProfilPage_content_details_item">
                                <input type="text" name='adresse' placeholder='Adresse' value={newAdress} onChange={handleChangeAdress} />
                            </div>
                            <div className="ProfilPage_content_details_item">
                                <input type="text" name='client' placeholder='Client' value={newAdressClient} onChange={handleChangeAdressClient} />
                            </div>
                            <div className="ProfilPage_content_details_item">
                                <button onClick={handleSubmite}>Ajouter</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        )
}
