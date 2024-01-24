import React, {useState, useEffect, useCallback} from "react";
import AddUserPopup from "../popups/AddUserPopup";
import EditUserPopup from "../popups/EditUserPopup";
import axios from 'axios';
import { sortUsers, generateTableHeaders, handleHeaderClick, baseURL, config } from "../functions";

export default function UserTable( {token, email} ) {

    const [users, setUsers] = useState([]);
    const [refreshTable, setRefreshTable] = useState(false);
    const [AddUserPopupButton, setAddUserPopupButton] = useState(false);
    const [EditUserPopupButton, setEditUserPopupButton] = useState(false);
    const [selectedUser, setSelectedUser] = useState({email: "", role: ""});

    const headers = ["E-Mail", "Rola"];
    const [currentHeader, setCurrentHeader] = useState("Rola");
    const [sortAs, setSortAs] = useState("asc");

    const fetchData = useCallback(async () => {
        try {
          const response = await axios.get(`${baseURL}/api/users`, config(token));
          setUsers(response.data);
        } catch (error) {
          console.error('Error while fetching data:', error);
        }
      }, [token]);

    useEffect(() => {
        fetchData();
        setRefreshTable(false);
    }, [refreshTable, token, fetchData]);


    const handleHeaderClickWrapper = (header) => {
        handleHeaderClick(header, currentHeader, sortAs, setCurrentHeader, setSortAs);
    };

    const handleEditButton = (user) => {
        if (user.email !== email) {
            setSelectedUser({email: user.email, role: user.role});
            setEditUserPopupButton(true);
        } else {
            alert("Nie edytujemy swoich uprawnień!");
        }
    }
    
    return(
        <div>
            <h2>Lista użytkowników:</h2>
            <table className="UserTable">
                <thead>
                    <tr>
                        {generateTableHeaders(headers, currentHeader, sortAs, handleHeaderClickWrapper)}
                        <th><button onClick={() => setAddUserPopupButton(true)} className="TableAddButton">Dodaj</button></th>
                    </tr>
                </thead>
                <tbody>
                    {sortUsers(users, currentHeader, sortAs).map( (user, index) => (
                        <tr key={index} className="UserRow">
                            <td>{user.email}</td>
                            <td className={user.role === "ADMIN" ? "AdminRole" : "UserRole"}>{user.role === "ADMIN" ? "Administrator" : "Użytkownik"}</td>
                            <td><button onClick={() => handleEditButton(user)} className="TableButton">Edytuj</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {AddUserPopupButton && (
                <AddUserPopup trigger={AddUserPopupButton} setTrigger={setAddUserPopupButton} refreshTable={setRefreshTable} token={token}></AddUserPopup>
            )}
            {EditUserPopupButton && (
                <EditUserPopup email={email} trigger={EditUserPopupButton} setTrigger={setEditUserPopupButton} user={selectedUser} refreshTable={setRefreshTable} token={token}></EditUserPopup>
            )}
        </div>
    )
}