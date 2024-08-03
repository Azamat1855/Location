import React, { useState } from "react";

const TelegramLocationSender = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [mapUrl, setMapUrl] = useState("");

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        setMapUrl(`https://maps.google.com/?q=${latitude},${longitude}`);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const sendLocationToTelegram = () => {
    const botToken = "6577906656:AAGs_hZA-pNVUMoZ256gBAZ_uookJ2oEnh8";
    const chatId = "797379797";
    const { lat, lon } = location;

    fetch(
      `https://api.telegram.org/bot${botToken}/sendLocation?chat_id=${chatId}&latitude=${lat}&longitude=${lon}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          alert("Location sent to Telegram!");
        } else {
          alert("Failed to send location to Telegram.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error sending location to Telegram.");
      });
  };

  const handleButtonClick = () => {
    getLocation();
    sendLocationToTelegram();
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Send Location to Telegram</button>
      <p>lat: {location.lat}</p>
      <p>lon: {location.lon}</p>
      {mapUrl && (
        <iframe
          src={mapUrl}
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      )}
    </div>
  );
};

export default TelegramLocationSender;
