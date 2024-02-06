import { useEffect, useState, useContext } from 'react'
import { InfosUsersSession } from '../../dashboard/Dashboard'
import { account } from "../../../appwrite/config";


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
    const route = [
        {path: "profil", composant: <ProfilPage />},
        {path: "calendrier", composant: <Calendrie />},
        {path: "adresse", composant: <Adresse />},
    ]
    useEffect(() => {
        if (window.location.hash) {
            route.find(e => 
                e.path === window.location.hash.split('/')[1] ? 
                setShowComposant(window.location.hash.split('/')[1]) : 
                setShowComposant("calendrier")
            )
        }else{}
    })
    useEffect(() => {

        if (route.find(e => e.path === showComposant)) {
            setShowPage(route.find(e => e.path === showComposant).composant)
        }else{}
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
                        <a href="#/calendrier" onClick={() => handleClickPage("calendrier")}>
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
    )
}


function Header(props){
    
    const infosUser = useContext(InfosUsersSession)

    const [nom, setNom] = useState("")
    const [photo, setPhoto] = useState("")

    useEffect(() => {
        if(infosUser){
            setNom(infosUser.firstName + " " + infosUser.lastName)
            setPhoto(infosUser.picture_user)
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
                    <span className='role'>User</span>
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
        <h2>Main</h2>
        {props.showPage}
    </main>
    )
}


// composants

function Adresse(){
    return(
    <div className='adresse'>
        <h2>Adresse</h2>
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

function Calendrie() {
    const handleClickCaseCalendrier = (infos) => {
      console.log(infos);
      document.querySelector(".modal").style.display = "flex";
    };
  
    return (
      <div className="calendrier">
        <div className="modal">
          <form>
            <input type="text" placeholder="travaillé?" />
            <input type="text" placeholder="lieu de travail" />
            <button>envoyer</button>
          </form>
        </div>
        <h2>Calendrie</h2>
  
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
              info.dayEl.style.backgroundColor = "green";
              handleClickCaseCalendrier("Clicked on: " + info.dateStr);
            }}
          />
        </div>
      </div>
    );
  }