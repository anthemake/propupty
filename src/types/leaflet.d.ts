declare module "leaflet" {
    interface IconDefault {
        _getIconUrl?: () => string;
    }

    export class Icon<T extends IconOptions = IconOptions> extends Layer {
        constructor(options?: T);
    }
}
