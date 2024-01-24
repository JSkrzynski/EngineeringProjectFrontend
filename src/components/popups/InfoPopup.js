import React, { useState } from 'react';

export default function InfoPopup(props) {
    
    const [selectedImage, setSelectedImage] = useState("");
    const [isImageFullScreen, setIsImageFullScreen] = useState(false);

    const openFullScreenImage = (image) => {
        setSelectedImage(image);
        setIsImageFullScreen(true);
    };

    const closeFullScreenImage = () => {
        setSelectedImage("");
        setIsImageFullScreen(false);
    };

    return props.trigger ? (
        <div className="Popup">
            <div className="InfoPopupInner">
                <button onClick={() => props.setTrigger(false)} className="CloseButton">
                    Zamknij
                </button><br/>
                <h2>Kliknij na zdjęcie żeby je powiększyć</h2>
                <img
                    className="InfoImg"
                    src="wskazowka1.png"
                    alt="Wskazówka1"
                    onClick={() => openFullScreenImage("wskazowka1.png")}
                />
                <img
                    className="InfoImg"
                    src="wskazowka2.png"
                    alt="Wskazówka2"
                    onClick={() => openFullScreenImage("wskazowka2.png")}
                />
                <img
                    className="InfoImg"
                    src="wskazowka3.png"
                    alt="Wskazówka3"
                    onClick={() => openFullScreenImage("wskazowka3.png")}
                />
                <img
                    className="InfoImg"
                    src="wskazowka4.png"
                    alt="Wskazówka4"
                    onClick={() => openFullScreenImage("wskazowka4.png")}
                />
                <br/><a href='https://www.google.com/maps/@52.8398919,20.0731928,7.75z?hl=pl-PL' target="_blank">Wejdź na Google Maps</a><br/>
            </div>
            {isImageFullScreen && (
                <div className="FullScreenImageOverlay" onClick={closeFullScreenImage}>
                    <img
                        className="FullScreenImage"
                        src={selectedImage}
                        alt="Pełnoekranowe Zdjęcie"
                    />
                </div>
            )}
        </div>
  ) : "";
}