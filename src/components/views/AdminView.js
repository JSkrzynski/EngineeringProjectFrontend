import React, {useState} from "react";
import UserTable from "../tables/UserTable";
import MarkerTableForLoggedUsers from "../tables/MarkerTableForLoggedUsers";

export default function AdminView({markers, token, email, refreshTable, downloadTrigger, selectedMarkers, setSelectedMarkers}) {

    const [markersVisible, setMarkersVisible] = useState(true);
    const [usersVisible, setUsersVisible] = useState(false);

    const markersHandler = () => {
        setMarkersVisible(true);
        setUsersVisible(false);
    }
    const usersHandler = () => {
        setMarkersVisible(false);
        setUsersVisible(true);
    }

    return(
        <div className='AdminList'>
            <button className="MarkersButton" onClick={() => markersHandler()}>Znaczniki</button>
            <button className="UsersButton" onClick={() => usersHandler()}>Użytkownicy</button>
            {markersVisible && (
                <MarkerTableForLoggedUsers 
                    markers={markers} 
                    token={token} 
                    email={email} 
                    role={"ADMIN"} 
                    refreshTable={refreshTable}
                    downloadTrigger={downloadTrigger}
                    selectedMarkers={selectedMarkers} 
                    setSelectedMarkers={setSelectedMarkers}
                />
            )}
            {usersVisible && (
                <UserTable token={token} email={email}/>
            )}
        </div>
        
    )
}