import React, { useState } from "react";
import MarkerTable from "../tables/MarkerTable";
import MarkerTableForLoggedUsers from "../tables/MarkerTableForLoggedUsers";

export default function LoggedUserView({markers, token, email, refreshTable, downloadTrigger, selectedMarkers, setSelectedMarkers}) {

    const [userMarkersVisible, setUserMarkersVisible] = useState(true);
    const [allMarkersVisible, setAllMarkersVisible] = useState(false);

    const userMarkersHandler = () => {
        setUserMarkersVisible(true);
        setAllMarkersVisible(false);
    }
    const allMarkersHandler = () => {
        setAllMarkersVisible(true);
        setUserMarkersVisible(false);
    }

    return (
        <div className="LoggedUserView">
            <button className="UserMarkersButton" onClick={() => userMarkersHandler()}>Moje Znaczniki</button>
            <button className="AllMarkersButton" onClick={() => allMarkersHandler()}>Wszystkie Znaczniki</button>
            {userMarkersVisible && (
                <MarkerTableForLoggedUsers 
                    markers={markers} 
                    token={token} 
                    email={email} 
                    role="USER" 
                    refreshTable={refreshTable}
                    downloadTrigger={downloadTrigger}
                    selectedMarkers={selectedMarkers} 
                    setSelectedMarkers={setSelectedMarkers}
                />
            )}
            {allMarkersVisible && (
                <MarkerTable markers={markers} 
                    downloadTrigger={downloadTrigger}
                    selectedMarkers={selectedMarkers} 
                    setSelectedMarkers={setSelectedMarkers}
                />
            )}
            
            
        </div>
    )
} 