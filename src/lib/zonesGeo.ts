import arlingtonZonesJson from "./arlingtonZones.json";
import type { Zone } from "@/types/zone";
import type { FeatureCollection, Polygon, MultiPolygon } from "geojson";

const TARGET_ZONES = ["Dominion Hills", "Ballston", "Rosslyn", "Clarendon", "Pentagon City"];

const ZONE_TO_NEIGHBORHOOD: Record<string, string> = {
  "Apartment Dwelling District": "Ballston",
  "Local Commercial District": "Clarendon",
  "Service Commercial - Community Business Districts": "Rosslyn",
  "Special District": "Pentagon City",
  "Commercial Off. Bldg, Hotel and Multiple-Family Dwelling": "Rosslyn",
  "One-Family Dwelling District": "Dominion Hills",
};


function getCenterFromFeature(geometry: Polygon | MultiPolygon): [number, number] {
  const coords: [number, number][] =
    geometry.type === "Polygon"
      ? (geometry.coordinates[0] as [number, number][])
      : (geometry.coordinates.flat(2) as [number, number][]);

  const lats = coords.map(([, lat]) => lat);
  const lngs = coords.map(([lng]) => lng);
  const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const avgLng = lngs.reduce((a, b) => a + b, 0) / lats.length;
  return [avgLat, avgLng];
}

const typedJson = arlingtonZonesJson as FeatureCollection<Polygon | MultiPolygon, { LABEL: string }>;

const validFeatures = typedJson.features.filter((feature) => {
  const mappedNeighborhood = ZONE_TO_NEIGHBORHOOD[feature.properties.LABEL];
  return mappedNeighborhood && TARGET_ZONES.includes(mappedNeighborhood);
});

export const arlingtonZones: Zone[] = validFeatures.map((feature) => {
  const name = ZONE_TO_NEIGHBORHOOD[feature.properties.LABEL] ?? feature.properties.LABEL;
  const geometry = feature.geometry;

  const coordinates: Zone["coordinates"] =
    geometry.type === "Polygon"
      ? (geometry.coordinates[0] as [number, number][]).map(
        ([lng, lat]): [number, number] => [lat, lng]
      )
      : geometry.coordinates.map((polygon) =>
        (polygon[0] as [number, number][]).map(
          ([lng, lat]): [number, number] => [lat, lng]
        )
      );

  return {
    name,
    color: "#FF5733",
    coordinates,
    center: getCenterFromFeature(geometry),
  };
});
