import { InfosUsersSession } from "../../../dashboard/Dashboard";
import { useContext } from "react";


export default function ProfilPage() {
    const infosUser = useContext(InfosUsersSession);

    return (
    <div className="ProfilPage">
        <div className="ProfilPage_content">
        <div className="ProfilPage_content_photo">
            <img src={infosUser.profile_picture} alt="photo profil" />
        </div>

                <div className="ProfilPage_content_details">
                    <div className="ProfilPage_content_details_item">
                        <h2>{infosUser.firstName} {infosUser.lastName}</h2>
                    </div>
                    <div className="ProfilPage_content_details_item">
                        <p>Employee</p> <span className='line'></span> 
                        {infosUser.eligible ? <p style={{color: 'green'}}>Eligible for the FMB</p> : 
                        <p style={{color: 'red'}}>Not eligible for the FMB</p>}
                    </div>
                    <div className="ProfilPage_content_details_item">
                        <p><span>Adress: &nbsp; </span>{infosUser.homeAdress}</p>
                    </div>
                    <div className="ProfilPage_content_details_item">
                        <p><span>Email: &nbsp; </span>{infosUser.email}</p>
                    </div>
                    <div className="ProfilPage_content_details_item">
                        <p><span>Phone: &nbsp; </span>{infosUser.phone}</p>
                    </div>
        </div>
        </div>
    </div>
    );
}