import React, { useState } from 'react';
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { baseURL, config } from '../functions';
import InfoPopup from './InfoPopup';

export default function AddMarkerPopupFN(props) {
  const [role] = useState(props.role);

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [crayfishType, setCrayfishType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [infoPopupButton, setInfoPopupButton] = useState(false);

  const handleLatChange = (e) => {
    setLat(e.target.value);
  };

  const handleLngChange = (e) => {
    setLng(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleCrayfishTypeChange = (e) => {
    setCrayfishType(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const binaryData = reader.result;
  
        const binaryString = String.fromCharCode.apply(null, new Uint8Array(binaryData));
  
        const imageData = { name: title, data: btoa(binaryString) };
        setSelectedFile(imageData);
      };
  
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async () => {
    if (!lat || !lng || !title || !description || !date || !crayfishType) {
      alert("Proszę wypełnić wszystkie pola (plik jest opcjonalny)!");
      return;
    }
    const data = {
      mapMarker: {
          position: {
              lat: lat.replace(" ", "").replace(",",""),
              lng: lng.replace(" ", "").replace(",","")
          },
          title: title,
          description: description            
      },
      userEmail: props.email,
      CrayfishType: crayfishType,
      date: date.toISOString().split('T')[0],
      verified: false,
      image: selectedFile ? selectedFile : null
    };
    if (role === "ADMIN") {
      try {
        data.verified = true;
        await axios.post(`${baseURL}/api/admin/markers`, data, config(props.token));
      } catch (error) {
        console.error("Błąd podczas przesyłania danych:", error);
      }
    } else {
      try {
        await axios.post(`${baseURL}/api/markers`, data, config(props.token));
      } catch (error) {
        console.error("Błąd podczas przesyłania danych:", error);
      }
    }
    props.setTrigger(false);
    props.refreshTable(true);
    setLat("");
    setLng("");
    setTitle("");
    setDescription("");
    setDate(new Date());
    setCrayfishType("");
  };

  const showInfo = async () => {
    setInfoPopupButton(true);
  }

  return props.trigger ? (
    <div className="Popup">
      <div className="PopupInner">
        <button onClick={() => props.setTrigger(false)} className="CloseButton">Zamknij</button>
        <br/>
        <h2>Dodaj Znacznik</h2>
        <div className='inputs'>
          <div className="LatLngContainer">
            <a className='InfoLink' href='#' onClick={showInfo}>Skąd wziąć długość i szerokość geograficzną?</a>
            <input
              className="SameLengthInputs"
              type="text"
              placeholder="Szerokość geograficzna"
              value={lat}
              onChange={handleLatChange}
            />
          <input
            className="SameLengthInputs"
            type="text"
            placeholder="Długość geograficzna"
            value={lng}
            onChange={handleLngChange}
          />
          </div>
          <input
            className="SameLengthInputs"
            type="text"
            placeholder="Tytuł"
            value={title}
            onChange={handleTitleChange}
          />
          <DatePicker
            className="SameLengthInputs"
            selected={date}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
          />
          <select value={crayfishType} onChange={handleCrayfishTypeChange}>
            <option value="">Wybierz typ raka</option>
            <option value="SIGNAL">Sygnałowy</option>
            <option value="AMERICAN">Amerykański</option>
            <option value="NOBLE">Szlachetny</option>
            <option value="GALICIAN">Galicyjski</option>
            <option value="OTHER">Inne</option>
          </select>
          <textarea
            className='AddMarkerDescTextarea'
            placeholder="Opis"
            value={description}
            onChange={handleDescriptionChange}
          />
          <input className='MarkerFileInput' type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <button className="SubmitButton" onClick={handleSubmit}>Prześlij</button>

      </div>
      {infoPopupButton && (
        <InfoPopup trigger={infoPopupButton} setTrigger={setInfoPopupButton}/>
      )}
    </div>
  ) : "";
}