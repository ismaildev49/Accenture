import { useNavigate } from "react-router";
import { account } from "../../../../appwrite/config";

export default function SideBar(props) {
    const navigate = useNavigate();

    const handleClick = () => {
    props.isMenuOpenOrClouse();
    };

    const handleClickPage = (page) => {
    props.changeComposant(page);
    };

    const handleDeleteSession = async () => {
    console.log("test");
    await account.deleteSession("current");
    localStorage.removeItem("user_logged");
    navigate("/login");
    };

    return(
    <aside className='bg_color_3 aside_off'>
        <div className="slideBar">
            <div className='logo'>
                <img src="../assets/logo.png" alt="logo" />
            </div>

            <i onClick={handleClick} className="fa-solid fa-chevron-left btn_off_slideBar"></i>

            <nav>
                <ul>
                <h3>MENU</h3>
                <li onClick={handleClick}>
                    <a onClick={() => handleClickPage("calendar")}>
                    <i className="fa-regular fa-calendar-days"></i> Calendar
                    </a>
                </li>

                <li onClick={handleClick}>
                    <a onClick={() => handleClickPage("adresse")}>
                    <i className="fa-solid fa-gears"></i> Modify adress
                    </a>
                </li>

                <li onClick={handleClick}>
                    <a onClick={() => handleClickPage("historique")}>
                    <i className="bx bx-history"></i> History
                    </a>
                </li>
                </ul>
            </nav>

            <div className="btn_logout">
                <a onClick={() => handleDeleteSession()}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
                </a>
            </div>
        </div>
    </aside>
    );
}