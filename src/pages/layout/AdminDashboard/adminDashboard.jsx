import { useEffect, useState } from 'react'

// COMPONENTS
import Main from './components/main';
import Header from './components/header';
import SideBar from './components/sideBar';
import Adresses from './components/adresses';
import Employees from './components/employees'


export default function AdminDashboard() {
    
    const [isMenuOpen, setIsMenuOpen] = useState(true)

    // ROUTES-TEST start
    const [showComposant, setShowComposant] = useState("employees");
    const [showPage, setShowPage] = useState();
    const [ titrePage, setTitrePage] = useState("Employees")
    
    const route = [
        {path: "employees", composant: <Employees />},
        // {path: "profil", composant: <ProfilPage />},
        {path: "addresses", composant: <Adresses />}
    ]
    const changeComposant = (composant="") => {
        if (composant == "") {
            if (window.location.hash) {
                setShowPage(route.find(e => e.path === window.location.hash.split('/')[1]).composant)
                setTitrePage(window.location.hash.split('/')[1])
            }else{
                setShowPage(route.find(e => e.path === "employees").composant)
                setTitrePage("employees")
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