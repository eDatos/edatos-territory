import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Properties, Territories } from "@app/core/config";

import { forkJoin, map, Observable, shareReplay } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ConfigService {
    static PROPERTIES_FILE_URL = "assets/properties.json";
    static VERSION_FILE_URL = "assets/version.json";
    static TERRITORIES_FILE_URL = "assets/territories/territories.json";

    private properties$ = this.http.get(ConfigService.PROPERTIES_FILE_URL).pipe(shareReplay(1));
    private version$ = this.http.get(ConfigService.VERSION_FILE_URL).pipe(shareReplay(1));
    private territories$ = this.http.get<Territories>(ConfigService.TERRITORIES_FILE_URL).pipe(shareReplay(1));

    constructor(private http: HttpClient) {
    }

    getProperties(): Observable<Properties> {
        return forkJoin({properties: this.properties$, version: this.version$})
            .pipe(
                map((response: any) => {
                    return ({...response.properties, ...response.version});
                }));
    }

    getTerritories(): Observable<Territories> {
        return this.territories$;
    }
}
