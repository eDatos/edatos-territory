import { Injectable } from "@angular/core";

import { Properties, Territories } from "@app/core/config";

import propertiesJson from "../../../../assets/properties.json";
import territoriesJson from "../../../../assets/territories/territories.json";
import versionJson from "../../../../assets/version.json";

@Injectable({
    providedIn: "root",
})
export class ConfigService {
    constructor() {}

    getConfig(): Properties {
        return { ...propertiesJson, ...versionJson };
    }

    getTerritories(): Territories {
        return territoriesJson;
    }
}
