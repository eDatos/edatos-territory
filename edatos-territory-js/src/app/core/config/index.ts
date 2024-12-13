// allows type checking for typescript
import * as PROPERTIES from "../../../assets/properties.json";
import * as VERSION from "../../../assets/version.json";

type Properties = typeof PROPERTIES & typeof VERSION;
export { Properties };

export interface Territories {
    groups: Group[];
}

export interface Group {
    id: string;
    children: { id: string; codes?: string[] }[];
}
