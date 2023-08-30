import React from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const MapComponent = ({ apiKey, initialCenter }) => {
  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '400px', margin: '20px 0' }}
      center={initialCenter}
      zoom={14}
    >
      <Marker position={initialCenter} />
    </GoogleMap>
  );
};

const App = () => {
  const apiKey = 'YOUR_API_KEY'; // Replace with your Google Maps API key

  const location1 = { lat: 37.7749, lng: -122.4194 };
  const location2 = { lat: 34.0522, lng: -118.2437 };

  return (
    <div>
      <LoadScript googleMapsApiKey={apiKey}>
        <MapComponent apiKey={apiKey} initialCenter={location1} />
        <MapComponent apiKey={apiKey} initialCenter={location2} />
      </LoadScript>
    </div>
  );
};

export default App;
