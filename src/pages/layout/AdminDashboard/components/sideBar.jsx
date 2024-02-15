import { account } from "../../../../appwrite/config";
import { useNavigate } from 'react-router';

export default function SideBar(props){

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
    <aside className='aside_off'>
        <div className="slideBar bg_color_3">
            <div className='logo'>
                <div className="logo_creer">
                    <i className="fa-solid fa-location-dot"></i>
                    <span className="logo_creer_big_test protest-strike-regular">FMB <span>app</span></span>
                    <span className="logo_creer_big_subtest protest-strike-regular">by accenture</span>
                </div>
                {/* <img src="../public/assets/logo.png" alt="logo" /> */}
            </div>
            
            <i onClick={handleClick} className="fa-solid fa-chevron-left btn_off_slideBar"></i>

            <nav>
                <ul>
                <h3>MENU</h3>
                    <li onClick={handleClick}>
                        <a onClick={() => handleClickPage("employees")}>
                            <i className="fa-solid fa-users"></i> Employees
                        </a>
                    </li>

                    <li onClick={handleClick}>
                        <a onClick={() => handleClickPage("addresses")}>
                            <i className="fa-solid fa-gears"></i> Client addresses
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
    )
}