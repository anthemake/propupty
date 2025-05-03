"use client";

import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { arlingtonZones } from "@/lib/zonesGeo";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import type { MapContainerProps } from "react-leaflet";
import type { Zone } from "@/types/zone";
import type { Listing } from "@/types/listing";



type LatLngTuple = [number, number];

const customMarker = new Icon({
  iconUrl: "/leaflet/blue-marker.png",
  iconSize: [48, 48],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

interface MapWrapperProps {
  listings: Listing[];
  allListings: Listing[];
  setSelectedListings: (listings: Listing[]) => void;
  handleSearch?: (query: string) => Promise<void>;
  activeZone: string | null;
}

function MapEffects({
  selectedZoneIndex,
}: {
  selectedZoneIndex: number | null;
}) {
  const map = useMap();
  const hasFlown = useRef(false);

  useEffect(() => {
    if (selectedZoneIndex !== null && !hasFlown.current) {
      const selectedZone = arlingtonZones[selectedZoneIndex];
      const coords = selectedZone.center ?? [37.54, -77.436];
      map.flyTo(coords as [number, number], 13, { duration: 1.5 });
      hasFlown.current = true;
    }
  }, [selectedZoneIndex, map]);

  return null;
}

export default function MapWrapper({
  listings,
  allListings,
  setSelectedListings,
  // handleSearch,
  activeZone,
}: MapWrapperProps) {
  const [hoveredZoneIndex, setHoveredZoneIndex] = useState<number | null>(null);
  const [selectedZoneIndex, setSelectedZoneIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (activeZone) {
      const index = arlingtonZones.findIndex(
        (z: Zone) => z.name === activeZone
      );

      setSelectedZoneIndex(index >= 0 ? index : null);
    } else {
      setSelectedZoneIndex(null);
    }
  }, [activeZone]);

  return (
    <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
      <MapContainer
        {...({
          center: [38.8895, -77.0847],
          zoom: 12,
          scrollWheelZoom: true,
        } as Partial<MapContainerProps>)}
        className="h-full w-full"
      >
        <TileLayer
          // @ts-expect-error known typing bug in react-leaflet v5
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {arlingtonZones.map((zone: Zone, idx: number) => {
          function isMultiPolygon(
            coords: [number, number][][] | [number, number][]
          ): coords is [number, number][][] {
            return Array.isArray(coords[0][0]);
          }

          if (isMultiPolygon(zone.coordinates)) {
            return zone.coordinates.map((poly, idx2) => (
              <Polygon
                key={`${idx}-${idx2}`}
                positions={poly}
                pathOptions={{
                  color: zone.color,
                  fillOpacity: hoveredZoneIndex === idx ? 0.7 : 0.5,
                  weight: hoveredZoneIndex === idx ? 5 : 2,
                  opacity: 1,
                }}
                eventHandlers={{
                  mouseover: () => setHoveredZoneIndex(idx),
                  mouseout: () => setHoveredZoneIndex(null),
                }}
              />
            ));
          } else {
           
            return (
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
                }}
              />
            );
          }
        })}

        {listings.map((listing, idx) =>
          listing.lat && listing.lng ? (
            <Marker
              key={listing.id ?? idx}
              position={[listing.lat, listing.lng] as LatLngTuple}
              // @ts-expect-error icon prop missing from MarkerProps typing
              icon={customMarker}
            >
              <Popup>
                <div style={{ textAlign: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={listing.image}
                    alt={listing.title}
                    style={{
                      width: "100px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      marginBottom: "4px",
                    }}
                  />
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {listing.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {listing.price}
                  </div>
                  <a
                    href={`/listing/${listing.id}`}
                    style={{
                      display: "inline-block",
                      marginTop: "6px",
                      padding: "6px 12px",
                      background: "#1E40AF",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  >
                    View Details
                  </a>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}

        {selectedZoneIndex !== null && (
          <MapEffects selectedZoneIndex={selectedZoneIndex} />
        )}
      </MapContainer>

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
                {arlingtonZones[selectedZoneIndex]?.name ?? "Unknown Zone"}
              </h3>

              <button
                onClick={() => {
                  setSelectedZoneIndex(null);
                  setSelectedListings(allListings);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 text-sm">
              Zone Coverage
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
