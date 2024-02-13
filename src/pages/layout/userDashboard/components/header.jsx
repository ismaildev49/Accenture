import { useEffect, useState, useContext } from "react";
import { InfosUsersSession } from "../../../dashboard/Dashboard";

export default function Header(props) {
    const infosUser = useContext(InfosUsersSession);

    const [nom, setNom] = useState("");
    const [photo, setPhoto] = useState("");

    useEffect(() => {
    if (infosUser) {
        setNom(infosUser.firstName + " " + infosUser.lastName);
        setPhoto(infosUser.profile_picture);
    }
    }, []);

    const handleClickPage = (page) => {
    props.changeComposant(page);
    };

    const handleClick = () => {
    props.isMenuOpenOrClouse();
    };

    return (
    <header className="bg_color_1">
        <div className="header_content">
        <button onClick={() => handleClick()} className="burger">
            <span></span>
            <span className="middle"></span>
            <span></span>
        </button>

        <div className="header_content_profil">
            <div className="infos">
            <span className="nom">{nom}</span>
            <span className="role">Employee</span>
            </div>
            <a className="photo_profil">
            <img
                src={photo}
                alt="photo profil"
                onClick={() => handleClickPage("profil")}
            />
            </a>
        </div>
        </div>
    </header>
    );
}