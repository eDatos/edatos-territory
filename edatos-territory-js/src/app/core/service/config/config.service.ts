import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { forkJoin, map, Observable, shareReplay } from "rxjs";

import { Config, Properties, Territories } from "@app/core/config";

import configJson from "../../../../assets/config.json";


@Injectable({
    providedIn: "root",
})
export class ConfigService {
    static PROPERTIES_FILE_URL = "assets/properties.json";
    static TERRITORIES_FILE_URL = "assets/territories/territories.json";

    private properties$ = this.http.get(ConfigService.PROPERTIES_FILE_URL).pipe(shareReplay(1));
    private territories$ = this.http.get<Territories>(ConfigService.TERRITORIES_FILE_URL).pipe(shareReplay(1));

    constructor(private http: HttpClient) {}

    getProperties(): Observable<Properties> {
        return forkJoin({ properties: this.properties$ }).pipe(
            map((response: any) => {
                return { ...response.properties };
            })
        );
    }

    getTerritories(): Observable<Territories> {
        return this.territories$;
    }

    getConfig(): Config {
        return configJson;
    }
}
