import { useEffect, useState, useContext } from "react";
import { InfosUsers } from "../../dashboard/Dashboard";

// CALENDRIER start
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// CALENDRIER end

export default function UserDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  // ROUTES-TEST start
  const [showComposant, setShowComposant] = useState("calendrie");
  const [showPage, setShowPage] = useState();
  const route = [
    { path: "accueil_user_admin", composant: <AccueilPageUserAdmin /> },
    { path: "profil", composant: <ProfilPage /> },
    { path: "calendrie", composant: <Calendrie /> },
  ];
  useEffect(() => {
    if (route.find((e) => e.path === showComposant)) {
      setShowPage(route.find((e) => e.path === showComposant).composant);
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
        <Header isMenuOpenOrClouse={() => isMenuOpenOrClouse()} />
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

  return (
    <aside className=" aside_off">
      <div className="slideBar">
        <div className="logo">
          <img src="./src/assets/logo.png" alt="logo" />
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
                href="#/accueil_user_admin"
                onClick={() => handleClickPage("accueil_user_admin")}
              >
                <i className="bx bx-home-smile"></i> Home
              </a>
            </li>
            <li onClick={handleClick}>
              <a href="#/profil" onClick={() => handleClickPage("profil")}>
                <i className="fa-regular fa-user"></i> Profil
              </a>
            </li>
            <li onClick={handleClick}>
              <a
                href="#/calendrie"
                onClick={() => handleClickPage("calendrie")}
              >
                <i className="fa-regular fa-user"></i> Calendrie RH
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

function Header(props) {
  const infosUser = useContext(InfosUsers);

  const [nom, setNom] = useState("");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    console.log(infosUser);
    if (infosUser) {
      setNom(infosUser.name);
      setPhoto(infosUser.photo);
    }
  }, [infosUser]);

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
          <div className="photo_profil">
            <img src={photo} alt="photo profil" />
          </div>
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

function AccueilPageUserAdmin() {
  return (
    <div className="accueilUserAdmin">
      <div className="search">
        <input type="text" placeholder="Recherche" />
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
          <tr>
            <td>Clavinas</td>
            <td>Hugo</td>
            <td>Admin</td>
            <td>
              <button className="btn btn_edit">Modifier</button>
              <button className="btn btn_delete">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
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

function Modal(params) {}

const openModal = () => {
  return <div className=""></div>;
};

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
