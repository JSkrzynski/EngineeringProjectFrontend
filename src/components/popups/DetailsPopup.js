import React, { useState } from "react";
import { crayfishTypeSwitch } from "../functions";

export default function DetailsPopup(props) {
    const [isImageFullScreen, setIsImageFullScreen] = useState(false);

    const openFullScreenImage = () => {
        setIsImageFullScreen(true);
    };

    const closeFullScreenImage = () => {
        setIsImageFullScreen(false);
    };

    return (props.trigger) ? (
        <div className="DetailsPopup">
            <div className="DetailsPopupInner">
                <button onClick={() => props.setTrigger(false)} className="CloseButton">Zamknij</button>
                <h2>{props.marker.title}</h2>
                <div className="DetailsPopupContent">
                    <div className="IframeDiv">
                        <iframe
                            className="DetailsIframe"
                            title={props.marker.crayfishType}
                            src={`https://maps.google.com/maps?q=${props.marker.lat},${props.marker.lng}&z=14&output=embed`}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
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
                        <strong className="DetailsLabel">Data dodania: </strong>{props.marker.date}
                        <strong className="DetailsLabel">Typ: </strong>{crayfishTypeSwitch(props.marker.crayfishType)}
                        <strong className="DetailsLabel">Opis: </strong>{props.marker.description}
                        <strong className="DetailsLabel">Dodane przez: </strong>{props.marker.userEmail}
                    </div>
                </div>
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