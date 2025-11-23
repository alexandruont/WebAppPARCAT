import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const BAIA_MARE_CENTER = [47.6531, 23.5800]; 
const INITIAL_ZOOM = 13.1;

const customPingIcon = L.icon({
    iconUrl: '/red ping.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

export default function LeafletMap({ height = '500px', markers = [], onClickMarker = () => {} }) {
  return (
    <MapContainer 
      center={BAIA_MARE_CENTER} 
      zoom={INITIAL_ZOOM}
      scrollWheelZoom={true}
      style={{ height, width: '100%', borderRadius: '0.375rem' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map(marker => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={customPingIcon}
          eventHandlers={{
            click: () => onClickMarker(marker.id)
          }}
        >
          <Popup>
            <b>{marker.nr}</b><br/>
            {marker.details}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
