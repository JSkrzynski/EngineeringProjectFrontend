import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { baseURL, config } from "../functions";

export default function DetailsPopupWithEditing(props) {
    const [role] = useState(props.role);

    const [date, setDate] = useState(new Date(props.marker.date));
    const [crayfishType, setCrayfishType] = useState(props.marker.crayfishType);
    const [title, setTitle] = useState(props.marker.title);
    const [description, setDescription] = useState(props.marker.description);
    const [verified, setVerified] = useState(props.marker.verified);
    const [selectedFile, setSelectedFile] = useState(null);

    const [isImageFullScreen, setIsImageFullScreen] = useState(false);

    const openFullScreenImage = () => {
        setIsImageFullScreen(true);
    };

    const closeFullScreenImage = () => {
        setIsImageFullScreen(false);
    };

    const handleClose = () => {
        props.setTrigger(false);
    }

    const handleDateChange = (date) => {
        setDate(date);
    };

    const handleCrayfishTypeChange = (e) => {
        setCrayfishType(e.target.value);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
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

    const handleDelete = async () => {
        if (role === "ADMIN") {
            try {
                await axios.delete(`${baseURL}/api/admin/markers/${props.marker.id}`, config(props.token));
            } catch (error) {
                console.error("Błąd podczas usuwania rekordu", error);
            }
        } else {
            try {
                await axios.delete(`${baseURL}/api/markers/${props.marker.id}`, config(props.token));
            } catch (error) {
                console.error("Błąd podczas usuwania rekordu", error);
            }
        }
        props.setTrigger(false);
        props.refreshTable(true);
       
    };
    
    const handleSubmit = async () => {
        const data = {
            _id: props.marker.id,
            mapMarker: {
                position: {
                    lat: props.marker.lat,
                    lng: props.marker.lng
                },
                title: title,
                description: description            
            },
            userEmail: props.marker.userEmail,
            CrayfishType: crayfishType,
            date: date.toISOString().split('T')[0],
            verified: verified,
            image: selectedFile ? selectedFile : null
        };
        if (role === "ADMIN") {
            try {
                await axios.patch(`${baseURL}/api/admin/markers`, data, config(props.token));
    
            } catch (error) {
                console.error("Błąd podczas patchowania", error);
            }
        } else {
            try {
                await axios.patch(`${baseURL}/api/markers`, data, config(props.token));
            } catch (error) {
                console.error("Błąd podczas patchowania", error);
            }
        }
        props.setTrigger(false);
        props.refreshTable(true);
    };
    const handleStatusChange = async () => {
        try {
            const data = {
                _id: props.marker.id,
                mapMarker: {
                    position: {
                        lat: props.marker.lat,
                        lng: props.marker.lng
                    },
                    title: props.marker.title,
                    description: props.marker.description            
                },
                userEmail: props.marker.userEmail,
                CrayfishType: props.marker.crayfishType,
                date: props.marker.date,
                verified: !verified
            };
            await axios.patch(`${baseURL}/api/admin/markers`, data, config(props.token));
            // props.setTrigger(false);
            setVerified(!verified);
            props.refreshTable(true);
        } catch (error) {
            console.error("Błąd podczas patchowania", error);
        }
    };

    return (props.trigger) ? (
        <div className="DetailsPopup">
            <div className="DetailsPopupInner">
                <button onClick={ () => handleClose() } className="CloseButton">Zamknij</button>
                <h2>{props.marker.title}</h2>
                <div className="DetailsPopupContent">
                    <div className="IframeDiv">
                        <iframe className="AdminsDetailsIframe" title={title} src={`https://maps.google.com/maps?q=${props.marker.lat},${props.marker.lng}&z=14&output=embed`} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                    <div className="Details">
                        {props.marker.image && (
                            <img
                                className="MarkerImg"
                                src={`data:image/jpeg;base64,${props.marker.image.data}`}
                                alt="Marker"
                                onClick={openFullScreenImage}
                            />
                        )}
                        <br/><label htmlFor="dpicker"><strong>Data dodania: </strong></label>
                            <DatePicker
                                className="SameLengthInputs"
                                id="dpicker"
                                selected={date}
                                onChange={handleDateChange}
                                dateFormat="yyyy-MM-dd"
                            />
                        
                        <strong>Typ: </strong>
                            <select value={crayfishType} onChange={handleCrayfishTypeChange}>
                              <option value="SIGNAL">Sygnałowy</option>
                              <option value="AMERICAN">Amerykański</option>
                              <option value="NOBLE">Szlachetny</option>
                              <option value="GALICIAN">Galicyjski</option>
                              <option value="OTHER">Pozostałe</option>
                        </select>
                        
                        <strong>Tytuł: </strong><input className="TitleInput" type="text" value={title} onChange={handleTitleChange}/>
                        <strong>Opis: </strong><textarea className="DescriptionTextarea" value={description} onChange={handleDescriptionChange}/>
                        {role === "ADMIN" ? 
                            <><strong>Status: </strong><button className="DetailsButton" onClick={handleStatusChange}>{verified === true ? "Zweryfikowany" : "Niezweryfikowany" }</button></>
                            : <><strong>Status: </strong>{verified === true ? "Zweryfikowany" : "Niezweryfikowany" }</>
                        }
                        <strong className="AddedBy">Dodane przez: </strong>{props.marker.userEmail}
                        <strong className="ChangePhoto">Zmień zdjęcie:</strong>
                        <input className="FileLoader" type="file" accept="image/*" onChange={handleFileChange} />
                        <button className="DetailsButton" onClick={handleSubmit}>Prześlij zmiany</button>
                    </div>
                </div>
                <button onClick={handleDelete} className="DeleteButton">
                    <span role="img" aria-label="Delete">🗑️</span> Usuń
                </button>
            </div>
            {isImageFullScreen && (
                <div className="FullScreenImageOverlay" onClick={closeFullScreenImage}>
                    <img
                        className="FullScreenImage"
                        src={`data:image/jpeg;base64,${props.marker.image.data}`}
                        alt="Marker"
                    />
                </div>
            )}
        </div>
    ) : "";
}