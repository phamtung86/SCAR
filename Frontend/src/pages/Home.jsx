import { faBus, faCar, faHouse, faMotorcycle, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import logo from '../assets/image/SCAR-removebg-preview.png';
import '../assets/style/Home.css';
import { decodeToken } from '../configs/Decode';
import Social from './Social';

const DISPLAY_HOME = 1;
const DISPLAY_CAR = 2;
const DISPLAY_MOTO = 3;
const DISPLAY_VEHICLE = 4;

const NavItem = ({ icon, isActive, onClick, name }) => (
    <div className={`home-item ${name} ${isActive ? "home_item-border" : ""}`} onClick={onClick}>
        <FontAwesomeIcon icon={icon} />
    </div>
);

const Home = () => {
    const [dataToken, setDataToken] = useState(null);
    const [display, setDisplay] = useState(DISPLAY_HOME);
    useEffect(() => {
        const dataToken = decodeToken();
      
        if (dataToken) {
            setDataToken(dataToken);
        }
    }, []);

    const menuItems = [
        { id: DISPLAY_HOME, icon: faHouse, name: "home_social" },
        { id: DISPLAY_CAR, icon: faCar, name: "home_car" },
        { id: DISPLAY_MOTO, icon: faMotorcycle, name: "home_moto" },
    ];

    return (
        <div className="home">
            <div className="home_header">
                <div className="home_logo">
                    <img src={logo} alt="Logo" className="logo_image" />
                </div>
                <div className="home_nav">
                    {menuItems.map((item) => (
                        <NavItem
                            key={item.id}
                            icon={item.icon}
                            isActive={display === item.id}
                            onClick={() => setDisplay(item.id)}
                            name={item.name}
                        />
                    ))}
                    <div className={display === DISPLAY_VEHICLE ? "home_item-border home-item home_vehicle" : "home-item home_vehicle "} onClick={() => setDisplay(DISPLAY_VEHICLE)}>
                        <FontAwesomeIcon icon={faBus} />
                        <FontAwesomeIcon icon={faTruck} />
                    </div>
                </div>
                <div className="home_account"></div>
            </div>
            <div className="home_content">
                <div className="home_main_content">
                    {display === DISPLAY_HOME && <Social />}

                </div>
            </div>
        </div>
    );
}

export default Home;