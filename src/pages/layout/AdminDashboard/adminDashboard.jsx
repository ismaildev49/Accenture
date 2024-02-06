import { useEffect, useState, useContext } from 'react'
import { InfosUsersSession } from '../../dashboard/Dashboard'
import { account } from "../../../appwrite/config";

// CALENDRIER start
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// CALENDRIER end


export default function AdminDashboard() {
    
    const [isMenuOpen, setIsMenuOpen] = useState(true)


    // ROUTES-TEST start
    const [showComposant, setShowComposant] = useState("users");
    const [showPage, setShowPage] = useState();
    const route = [
        {path: "users", composant: <Users />},
        {path: "profil", composant: <ProfilPage />},
        {path: "adresses", composant: <Adresse />}
    ]
    useEffect(() => {
        if (window.location.hash) {
            route.find(e => 
                e.path === window.location.hash.split('/')[1]) ? 
                setShowComposant(window.location.hash.split('/')[1]) : 
                setShowComposant("calendrier")
        }else{}
    })
    useEffect(() => {
        if (route.find(e => e.path === showComposant)) {
            setShowPage(route.find(e => e.path === showComposant).composant)
        }
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
            <SideBar isMenuOpenOrClouse={()=>isMenuOpenOrClouse()} setShowComposant={setShowComposant} />
            <div id='content'>
                <Header isMenuOpenOrClouse={()=>isMenuOpenOrClouse()} setShowComposant={setShowComposant} />
                <Main showPage={showPage} />
            </div>
        </>
    )
}



function SideBar(props){

    const handleClick = () => {
    props.isMenuOpenOrClouse()
    }

    const handleClickPage = (page) => {
    props.setShowComposant(page);
    }

    const handleDeleteSession = async () => {
        console.log("test");
        await account.deleteSession('current');
        // setLoggedInUser(null);
        // setUser(null);
    }

    return(
    <aside className=' aside_off'>
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
                        <a href="#/users" onClick={() => handleClickPage("users")}>
                            <i className="fa-solid fa-users"></i> Utilisateurs
                        </a>
                    </li>

                    <li onClick={handleClick}>
                        <a href="#/adresses" onClick={() => handleClickPage("adresses")}>
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

    const [nom, setNom] = useState("")
    const [photo, setPhoto] = useState("")

    useEffect(() => {
        if(infosUser){
            setNom(infosUser.firstName + " " + infosUser.lastName)
            setPhoto(infosUser.profile_picture)
        }
    }, [infosUser])


    const handleClickPage = (page) => {
        props.setShowComposant(page);
    }


    const handleClick = () => {
        props.isMenuOpenOrClouse()
    }

    return(
    <header className=''>
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
            <a href='#/profil' className='photo_profil'>
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
        <div className="main_content">
            {props.showPage}
        </div>
    </main>
    )
}



// composants
function Users(){

    return(
        <div className='accueilAdmin'>
            <h2>Liste de utilisateurs</h2>
            <div className="search">
            <input type="text" placeholder='Recherche' />
            </div>

            <table>
            <thead>
                <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Role</th>
                <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                <tr onClick={()=>alert('test')}>
                <td>Clavinas</td>
                <td>Hugo</td>
                <td>Admin</td>
                <td>
                    <button className='btns btn_edit'>Modifier</button>
                    <button className='btns btn_delete'>Supprimer</button>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
    )
}

function Adresse(){
    return(
        <div className='accueilAdmin'>
            <h2>Liste de adresses</h2>
            <div className="search">
            <input type="text" placeholder='Recherche' />
            </div>

            <table>
            <thead>
                <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Role</th>
                <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                <tr onClick={()=>alert('test')}>
                <td>Clavinas</td>
                <td>Hugo</td>
                <td>Admin</td>
                <td>
                    <button className='btns btn_edit'>Modifier</button>
                    <button className='btns btn_delete'>Supprimer</button>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
    )
}


function ProfilPage(){
    return(
    <div>
        <h2>ProfilPage</h2>
    </div>
    )
}

function Modal(params) {
    
}

