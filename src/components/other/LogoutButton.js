import React from "react";

export default function LogoutButton({ handleLogout, email }) {
  return (
    <div className="ButtonContainer">
        <label className="WhoAmI">Zalogowano jako:<br/>{email}</label>
        <button onClick={handleLogout} className="LogoutButton">Wyloguj</button>
    </div>
  );
}