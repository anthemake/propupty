type LatLngTuple = [number, number];
type LatLngExpression = LatLngTuple | LatLngTuple[];



export type Zone = {
    name: string;
    coordinates: [number, number][];
    color: string;
    center?: [number, number];
};


export const arlingtonZones = [
    {
        name: "Riverfront / Canal Walk District",
        color: "#3b82f6",
        coordinates: [
            [37.538, -77.447],
            [37.5385, -77.44],
            [37.5375, -77.432],
            [37.5345, -77.43],
            [37.531, -77.435],
            [37.532, -77.445],
        ] as LatLngExpression[],
        center: [37.5375, -77.4375] as LatLngTuple,


    },

    {
        name: "Henrico Smart City",
        color: "#22c55e",
        coordinates: [
            [37.58, -77.32],
            [37.578, -77.30],
            [37.575, -77.295],
            [37.572, -77.305],
            [37.575, -77.32],
        ] as LatLngExpression[],
    }
    ,
    {
        name: "The Fan District",
        color: "#f59e0b",
        coordinates: [
            [37.552, -77.47],
            [37.55, -77.455],
            [37.543, -77.458],
            [37.545, -77.475],
            [37.548, -77.478],
        ] as LatLngExpression[],
    }
    ,
    {
        name: "Scott's Addition",
        color: "#f97316",
        coordinates: [
            [37.567, -77.475],
            [37.567, -77.465],
            [37.563, -77.462],
            [37.558, -77.465],
            [37.558, -77.475],
            [37.563, -77.478],
        ] as LatLngExpression[],
    },
    {
        name: "West End",
        color: "#6366f1",
        coordinates: [
            [37.602, -77.63],
            [37.600, -77.60],
            [37.595, -77.59],
            [37.590, -77.60],
            [37.592, -77.625],
        ] as LatLngExpression[],
    }
    ,
];
