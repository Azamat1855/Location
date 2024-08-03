import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TelegramLocationSender = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          sendLocationToTelegram(latitude, longitude);
        },
        (error) => {
          alert('Error retrieving location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const sendLocationToTelegram = (latitude, longitude) => {
    const botToken = '6577906656:AAGs_hZA-pNVUMoZ256gBAZ_uookJ2oEnh8';
    const chatId = '797379797';

    fetch(
      `https://api.telegram.org/bot${botToken}/sendLocation?chat_id=${chatId}&latitude=${latitude}&longitude=${longitude}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          alert('Location sent to Telegram!');
        } else {
          alert('Failed to send location to Telegram.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error sending location to Telegram.');
      });
  };

  const handleButtonClick = () => {
    getLocation();
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Send Location to Telegram</button>
      <p>lat: {location.lat}</p>
      <p>lon: {location.lon}</p>
      {location.lat && location.lon && (
        <MapContainer center={[location.lat, location.lon]} zoom={13} style={{ height: '450px', width: '600px' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[location.lat, location.lon]}>
            <Popup>
              Your location: {location.lat}, {location.lon}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default TelegramLocationSender;
