import React, {useEffect, useState, useCallback} from "react";
import MarkerTable from "./tables/MarkerTable";
import AdminView from "./views/AdminView"
import axios from 'axios';
import { saveAs } from 'file-saver';
import LoginForm from "./popups/LoginForm";
import LoggedUserView from "./views/LoggedUserView";
import { baseURL } from "./functions";
import LogoutButton from "./other/LogoutButton";

export default function Home() {

    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");
    const [loginPopupButton, setLoginPopupButton] = useState(false);
    const [refreshTable, setRefreshTable] = useState(false);
    const [downloadTrigger, setDownloadTrigger] = useState(false);
    const [selectedMarkers, setSelectedMarkers] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${baseURL}/api/markers`);
            setMarkers(response.data.sort( (a,b) => b.date.localeCompare(a.date)));
        } catch (error) {
            console.error('Error while fetching data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
        setRefreshTable(false);
    }, [refreshTable, fetchData]);

    const handleFetchedData = (email, role) => {
        setEmail(email);
        if (role === "ADMIN") {
            setIsAdmin(true);
            setIsLogged(true);
        } else if (role === "USER") {
            setIsLogged(true);
        }
    }

    useEffect(() => {
        const whoAmI = async () => {
            try {
                const response = await axios.get(`${baseURL}/me`, {
                    withCredentials: true
                });
                handleFetchedData(response.data.email, response.data.role);
            } catch (error) {
                console.error('Error while fetching data:', error);
            }
        };
    
        whoAmI();
    }, []);

    const setTriggerAndClearArr = (trigger) => {
        setDownloadTrigger(trigger);
        setSelectedMarkers([]);
    }
    
    const startExportingProcess = () => {
        setDownloadTrigger(true);
    }
    
    const cancelDownloading = () => {
        setTriggerAndClearArr(false);
    }

    const handleDownload = () => {
        if (selectedMarkers.length > 0) {
            const markersJson = JSON.stringify(selectedMarkers, null, 2);
            const blob = new Blob([markersJson], { type: 'application/json' });
            saveAs(blob, 'selectedMarkers.json');
            setTriggerAndClearArr(false);
        } else {
            alert("Najpierw proszę coś zaznaczyć!");
        }
    }

    const exportAllMarkers = () => {
        const markersJson = JSON.stringify(markers, null, 2);
        const blob = new Blob([markersJson], { type: 'application/json' });
        saveAs(blob, 'markers.json');
        setTriggerAndClearArr(false);
    };

    const handleLoginSuccess = (token, email, role) => {
        setIsLogged(true);
        setToken(token);
        setEmail(email);
        setIsAdmin(role === 'ADMIN');
    };

    const handleLoginError = (error) => {
        console.error("Błąd logowania:", error);
    };

    const handleLogout = () => {
        setIsAdmin(false);
        setIsLogged(false);
        window.location.href = `${baseURL}/logout`;
    }
    
    return (
        <>
        <div className="App">
            <div className="Topnav">
                {downloadTrigger ? <button className='TopnavButton' id='exportAllButton' onClick={exportAllMarkers}>Eksportuj wszystkie</button> : ""}
                {downloadTrigger 
                    ? <button className='TopnavButton' id='cancelButton' onClick={cancelDownloading}>Anuluj</button>
                    : <button className='TopnavButton' id='exportButton' onClick={startExportingProcess}>Eksportuj znaczniki</button>}
                {downloadTrigger ? <button className='TopnavButton' id='exportChosenButton' onClick={handleDownload}>Pobierz wybrane</button> : ""}
            </div>
            <div className="PanelPart">
                {isAdmin && isLogged && (
                    <>
                    <LogoutButton handleLogout={handleLogout} email={email}/>
                    <AdminView 
                        markers={markers} 
                        token={token} 
                        email={email} 
                        refreshTable={setRefreshTable}
                        downloadTrigger={downloadTrigger} 
                        selectedMarkers={selectedMarkers} 
                        setSelectedMarkers={setSelectedMarkers}
                    />
                    </>
                )}
                {isLogged && !isAdmin && (
                    <>
                    <LogoutButton handleLogout={handleLogout} email={email}/>
                    <LoggedUserView 
                        markers={markers} 
                        token={token} 
                        email={email} 
                        refreshTable={setRefreshTable}
                        downloadTrigger={downloadTrigger} 
                        selectedMarkers={selectedMarkers} 
                        setSelectedMarkers={setSelectedMarkers}
                    />
                    </>
                )}
                {!isLogged && !isAdmin && (
                    <>
                    <div className="ButtonContainer">
                        <button onClick={ () => setLoginPopupButton(true) } className="LoginButton">Zaloguj</button><br/>
                    </div>
                    <MarkerTable 
                        markers={markers} 
                        downloadTrigger={downloadTrigger}
                        selectedMarkers={selectedMarkers} 
                        setSelectedMarkers={setSelectedMarkers}
                    />
                    </>
                )}
            </div>
            {loginPopupButton && (
                <LoginForm 
                    trigger={loginPopupButton} 
                    setTrigger={setLoginPopupButton} 
                    onLoginSuccess={handleLoginSuccess}
                    onLoginError={handleLoginError}
                />
            )}
            
        </div>
        </>
    );
    
}