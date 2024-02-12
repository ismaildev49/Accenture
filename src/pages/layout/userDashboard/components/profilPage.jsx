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
                        <p>Employer</p> <span className='line'></span> 
                        {infosUser.eligible ? <p style={{color: 'green'}}>eligible pour le FMB</p> : 
                        <p style={{color: 'red'}}>non eligible pour le FMB</p>}
                    </div>
                    <div className="ProfilPage_content_details_item">
                        <p><span>Adresse: &nbsp; </span>{infosUser.homeAdress}</p>
                    </div>
                    <div className="ProfilPage_content_details_item">
                        <p><span>Email: &nbsp; </span>email@email.com</p>
                    </div>
                    <div className="ProfilPage_content_details_item">
                        <p><span>GSM: &nbsp; </span>0000.000.000.000</p>
                    </div>
        </div>
        </div>
    </div>
    );
}