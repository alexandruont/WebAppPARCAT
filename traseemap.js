'use client'; 

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// CONSTANTE
const BAIA_MARE_CENTER = [47.6593, 23.5828]; 
const INITIAL_ZOOM = 14;

const simulatedRoutes = [
    { id: 1, color: '#ff0000', name: "Traseul Centru (Principal)", path: [[47.659, 23.560], [47.658, 23.580], [47.659, 23.600]] },
    { id: 2, color: '#0000ff', name: "Traseul Nord-Vest", path: [[47.670, 23.570], [47.665, 23.580], [47.660, 23.570]] },
    { id: 3, color: '#800080', name: "Traseul Coșbuc", path: [[47.654, 23.585], [47.654, 23.595]] },
    { id: 4, color: '#008000', name: "Traseul Nordic", path: [[47.670, 23.595], [47.665, 23.595]] },
];

const vehiclePosition = [47.6585, 23.5850];
const controlVehicleIconHtml = '<div style="color: red; font-size: 30px; transform: rotate(-45deg); font-weight: bold;">▶</div>';


export default function TraseeMap({ traseuActiv, height = '500px' }) {
    
    // Iconița este necesară pentru Marker, așa că o definim în state
    const [leafletIcon, setLeafletIcon] = useState(null);

    // *****************************************************************
    // LOGICA CRITICĂ: Inițializarea 'L' și a iconițelor pe client
    // *****************************************************************
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const L = require('leaflet'); 
            
            // Aceasta previne eroarea 404/blocajul generat de Leaflet în Next.js,
            // forțând-ul să nu caute iconițele default albastre
            delete L.Icon.Default.prototype._getIconUrl; 

            // Creăm iconița customizată a vehiculului (Triunghiul roșu)
            const customVehicleIcon = L.divIcon({
                 html: controlVehicleIconHtml,
                 className: 'bg-transparent',
                 iconSize: [30, 30],
                 iconAnchor: [15, 15],
            });
            
            // Setăm starea, ieșind astfel din starea de încărcare
            setLeafletIcon(customVehicleIcon);
        }
    }, []);

    // Așteptăm ca iconița să fie gata înainte de a randa MapContainer
    if (!leafletIcon) { 
        return <p className="text-center p-5 text-muted" style={{ height }}>Așteaptă încărcarea hărții...</p>;
    }
    
    // Găsim traseul activ pentru a-l evidenția (simulat)
    const activeRoute = simulatedRoutes.find(r => r.id === traseuActiv.id);

    return (
        <MapContainer 
            center={BAIA_MARE_CENTER} 
            zoom={INITIAL_ZOOM} 
            scrollWheelZoom={true}
            style={{ height, width: '100%', borderRadius: '0.375rem' }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Linii de Trasee */}
            {simulatedRoutes.map(route => ( 
                <Polyline 
                    key={route.id}
                    positions={route.path} 
                    pathOptions={{ 
                        color: route.color, 
                        weight: route.id === traseuActiv.id ? 6 : 4, // Lățime mai mare pentru traseul activ
                        opacity: route.id === traseuActiv.id ? 1.0 : 0.6 
                    }} 
                />
            ))}

            {/* Marker vehicul cu iconița customizată */}
            <Marker position={vehiclePosition} icon={leafletIcon}>
                <Popup>
                    Vehicul pe {activeRoute?.name || 'Traseu Necunoscut'}
                </Popup>
            </Marker>

        </MapContainer>
    );
}