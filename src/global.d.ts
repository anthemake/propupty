declare module "*.json" {
  import type { FeatureCollection, Polygon, MultiPolygon } from "geojson";
  const value: FeatureCollection<Polygon | MultiPolygon, { LABEL: string }>;
  export default value;
}
