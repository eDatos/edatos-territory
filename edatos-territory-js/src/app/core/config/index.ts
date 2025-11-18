// allows type checking for typescript
import * as PROPERTIES from "../../../assets/properties.json";
import * as CONFIG from "../../../assets/config.json";

type Properties = typeof PROPERTIES;
export { Properties };

type Config = typeof CONFIG;
export { Config };

export interface Territories {
    groups: Group[];
}

export interface Group {
    id: string;
    children: { id: string; codes?: string[] }[];
}
