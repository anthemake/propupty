'use client';

import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect, useRef  } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { richmondZones } from '@/lib/zones'; 
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom Pin
const customMarker = new L.Icon({
  iconUrl: '/leaflet/blue-marker.png',
  iconSize: [48, 48],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Fix Leaflet missing default images
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

interface Listing {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
  zone: string;
  lat: number;
  lng: number;
}

export default function MapWrapper({
    listings,
    allListings,
    setSelectedListings,
    handleSearch, // 👈 ADD THIS
  }: {
    listings: any[];
    allListings: any[];
    setSelectedListings: (listings: any[]) => void;
    handleSearch: (query: string) => void; // 👈 ADD THIS
  }) {
  
  const [hoveredZoneIndex, setHoveredZoneIndex] = useState<number | null>(null);
  const [selectedZoneIndex, setSelectedZoneIndex] = useState<number | null>(null);

  function MapEffects({ selectedZoneIndex }: { selectedZoneIndex: number | null }) {
    const map = useMap();
    const hasFlown = useRef(false);
  
    useEffect(() => {
      if (selectedZoneIndex !== null && !hasFlown.current) {
        const selectedZone = richmondZones[selectedZoneIndex];
  
        let center: [number, number];
  
        if (selectedZone.center) {
          center = [selectedZone.center[0], selectedZone.center[1]];
        } else {
          const coords = selectedZone.coordinates;
          const avgLat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
          const avgLng = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
          center = [avgLat, avgLng];
        }
  
        map.flyTo(center, 13, { duration: 1.5 });
        hasFlown.current = true;  // 👈 Prevent flying again
      }
    }, [selectedZoneIndex, map]);
  
    return null;
  }

  return (
    <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[37.5407, -77.4360]}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Polygons */}
        {richmondZones.map((zone, idx) => (
          <Polygon
            key={idx}
            positions={zone.coordinates}
            pathOptions={{
              color: zone.color,
              fillOpacity: hoveredZoneIndex === idx ? 0.7 : 0.5,
              weight: hoveredZoneIndex === idx ? 5 : 2,
              opacity: 1,
            }}
            eventHandlers={{
              mouseover: () => setHoveredZoneIndex(idx),
              mouseout: () => setHoveredZoneIndex(null),
              click: () => {
                const zoneName = richmondZones[idx].name;
                handleSearch('', zoneName);  // ✅ Correct! Fetch listings for this zone
              },
              
              
            }}
          />
        ))}

        {/* Markers */}
        {listings.map((listing, idx) => (

  (listing.lat && listing.lng) ? (
    <Marker
      key={idx}
      position={[listing.lat, listing.lng]}
      icon={customMarker}
    >
<Popup>
  <div className="text-center">
    <img
      src={listing.image}
      alt={listing.title}
      className="w-32 h-20 object-cover rounded-md mx-auto mb-2"
    />
    <h3 className="text-base font-semibold text-gray-800">{listing.title}</h3>
    <p className="text-sm text-gray-500">{listing.price}</p>
    <button
      className="mt-2 text-xs text-blue-600 hover:underline"
      onClick={() => alert('View details (future feature)')}
    >
      View Details →
    </button>
  </div>
</Popup>

    </Marker>
  ) : null
))}




        {/* Zoom Effect */}
        {selectedZoneIndex !== null && (
          <MapEffects selectedZoneIndex={selectedZoneIndex} />
        )}
      </MapContainer>

      {/* HUD Card */}
      <AnimatePresence>
        {selectedZoneIndex !== null && (
          <motion.div
            key="hud"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute top-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-md z-[1000] w-64"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-gray-800">
                {richmondZones[selectedZoneIndex].name}
              </h3>
              <button
                onClick={() => {
                  setSelectedZoneIndex(null);
                  setSelectedListings(allListings); // 🛠 Reset to all
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 text-sm">
              Simulated Drone Zone Coverage
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
