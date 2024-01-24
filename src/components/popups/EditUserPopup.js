import React, { useState } from "react";
import axios from "axios";
import { baseURL, config } from "../functions";

export default function EditUserPopup(props) {
  const [email, setEmail] = useState(props.user.email);
  const [role, setRole] = useState(props.user.role);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.id);
  };

  const handleSubmit = async () => {
    try {
        const data = {
            email: email,
            role: role
        };
        await axios.patch(`${baseURL}/api/users`, data, config(props.token));
        props.setTrigger(false);
        props.refreshTable(true);
    } catch (error) {
        console.error("Błąd podczas patchowania", error);
    }
};

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/api/users/${email}`, config(props.token));
      props.setTrigger(false);
      props.refreshTable(true);

    } catch (error) {
      console.error("Błąd podczas przesyłania danych:", error);
    }
  };
  return (props.trigger) ? (
      <div className="Popup">
          <div className="PopupInner">
              <button onClick={ () => props.setTrigger(false) } className="CloseButton">Zamknij</button>
              <h2>Edytuj</h2>
              <p>
                <strong>E-Mail: </strong>
                <input type="text" onChange={handleInputChange} value={email}></input>
              </p>
              <p>
              <div className="RadioContainer">
                <input
                  type="radio"
                  id="ADMIN"
                  name="role"
                  checked={role === "ADMIN"}
                  onChange={handleRoleChange}
                ></input>
                <label htmlFor="ADMIN">Administrator</label>
              </div>
              <div className="RadioContainerUser">
                <input
                  type="radio"
                  id="USER"
                  name="role"
                  checked={role === "USER"}
                  onChange={handleRoleChange}
                ></input>
                <label htmlFor="USER">Użytkownik</label>
              </div>
              </p>
              
              <button onClick={handleSubmit}>Prześlij zmiany</button>
              <br/>
              <button onClick={handleDelete} className="DeleteButton">
                  <span role="img" aria-label="Delete">🗑️</span> Usuń
              </button>
          </div>
      </div>
  ) : "";
}