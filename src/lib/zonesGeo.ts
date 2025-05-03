import arlingtonZonesJson from './arlingtonZones.json';
console.log(arlingtonZonesJson.features.map(f => [f.properties.LABEL, f.properties.ZN_DESIG]));

const TARGET_ZONES = ["Dominion Hills", "Ballston", "Rosslyn", "Clarendon", "Pentagon City"];



// 🗺️ Mapping zone labels to your neighborhood names
const ZONE_TO_NEIGHBORHOOD: Record<string, string> = {
    "Apartment Dwelling District": "Ballston",
    "Local Commercial District": "Clarendon",
    "Service Commercial - Community Business Districts": "Rosslyn",
    "Special District": "Pentagon City",
    "Commercial Off. Bldg, Hotel and Multiple-Family Dwelling": "Rosslyn",
    "One-Family Dwelling District": "Dominion Hills",
    // Add more if needed
  };
  

  const COLORS = ["#FF5733", "#FF5733", "#FF5733", "#FF5733", "#FF5733"];

  function getCenterFromFeature(geometry: any): [number, number] {
    const coords: number[][] =
      geometry.type === "Polygon"
        ? geometry.coordinates[0]
        : geometry.coordinates.flat(2); // flatten all polygons into single array of [lng, lat]
  
    const lats = coords.map(([lng, lat]) => lat);
    const lngs = coords.map(([lng, lat]) => lng);
    const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
    return [avgLat, avgLng];
  }
  
  export const arlingtonZones = arlingtonZonesJson.features
//  .filter((feature) => {
//    const mappedNeighborhood = ZONE_TO_NEIGHBORHOOD[feature.properties.LABEL];
//    return mappedNeighborhood && TARGET_ZONES.includes(mappedNeighborhood);
//  })
  .map((feature) => {
    const name = ZONE_TO_NEIGHBORHOOD[feature.properties.LABEL] || feature.properties.LABEL;
    
    console.log("🗺️ Found zone:", name);  // 🔥 ← log inside map!

    return {
      name,
      color: "#FF5733",
      coordinates:
        feature.geometry.type === "Polygon"
          ? [feature.geometry.coordinates[0].map(([lng, lat]: [number, number]) => [lat, lng])]
          : feature.geometry.coordinates.map(
              (polygon) => polygon[0].map(([lng, lat]: [number, number]) => [lat, lng])
            ),
      center: [
        feature.geometry.coordinates[0][0][0][1],
        feature.geometry.coordinates[0][0][0][0],
      ],
    };
  });
  console.log("✅ Final arlingtonZones names:", arlingtonZones.map(z => z.name));
