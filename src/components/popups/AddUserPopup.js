import React, { useState } from "react";
import axios from "axios";
import { baseURL, config } from "../functions";

export default function AddUserPopup(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.id);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        email: email,
        password: password ? password : null,
        role: selectedRole
      };

      await axios.post(`${baseURL}/api/users`, data, config(props.token));
      setEmail("");
      setSelectedRole("");
      props.refreshTable(true);
      props.setTrigger(false);

    } catch (error) {
      console.error("Błąd podczas przesyłania danych:", error);
    }
  };

  return props.trigger ? (
    <div className="Popup">
      <div className="PopupInner">
        <button onClick={() => props.setTrigger(false)} className="CloseButton">
          Zamknij
        </button>
        <br />
        <h2>Dodaj użytkownika</h2>
        <input
          type="text"
          placeholder="Login"
          value={email}
          id="LOGIN"
          onChange={handleInputChange}
        ></input>
        <br/>
        <input
          type="password"
          placeholder="Hasło"
          id="PASS"
          value={password}
          onChange={handlePasswordChange}
        ></input>
        <br/>
        <div className="RadioContainer">
        <input
          type="radio"
          id="ADMIN"
          name="role"
          checked={selectedRole === "ADMIN"}
          onChange={handleRoleChange}
        ></input>
        <label htmlFor="ADMIN">Administrator</label>
        </div>
        <div className="RadioContainerUser">
        <input
          type="radio"
          id="USER"
          name="role"
          checked={selectedRole === "USER"}
          onChange={handleRoleChange}
        ></input>
        <label htmlFor="USER">Użytkownik</label>

        </div>
        <button className="SubmitButton" onClick={handleSubmit}>Prześlij</button>
      </div>
    </div>
  ) : "";
}