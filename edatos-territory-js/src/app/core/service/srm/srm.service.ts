import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { Categories } from "@app/core/model";
import { PropertiesService, instantiate, splitUrnScheme } from "@app/core/service";

@Injectable({
  providedIn: 'root'
})
export class SrmService {
    public static REST_URL: string;
    private static LIMIT: string = "1000";

    constructor(private http: HttpClient, private propertiesService: PropertiesService) {
        SrmService.REST_URL =
            this.propertiesService.getStructuralResourcesExternalApiUrl() + "/v1.0";
    }

    getDefaultCategorySchemeCategories(): Observable<Categories> {
        const defaultCategorySchemeUrn = this.propertiesService.getDefaultCategoryScheme();
        const {agency, resource, version} =  splitUrnScheme(defaultCategorySchemeUrn);
        const url = `${SrmService.REST_URL}/categoryschemes/${agency}/${resource}/${version}/categories?limit=${SrmService.LIMIT}`;
        return this.http.get(url).pipe(instantiate(Categories));
    }
}
