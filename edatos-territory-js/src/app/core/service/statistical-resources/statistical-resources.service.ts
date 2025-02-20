import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { forkJoin, map, Observable, of, switchMap } from "rxjs";

import { CacheResources, Collection, JaxiCollection } from "@app/core/model";
import { instantiate, PropertiesService, splitUrnScheme } from "@app/core/service";

@Injectable({
    providedIn: "root",
})
export class StatisticalResourcesService {
    public static REST_URL: string;
    private static JAXI_REST_URL: string;
    private static LIMIT = 1000;

    constructor(
        private http: HttpClient,
        private propertiesService: PropertiesService,
    ) {
        StatisticalResourcesService.REST_URL = this.propertiesService.getStatisticalResourcesExternalApiUrl() + "/v1.0";
        StatisticalResourcesService.JAXI_REST_URL = this.propertiesService.getJaxiExternalApiUrl();
    }

    getCollectionByUrn(urn: string): Observable<Collection> {
        const { agency, resource } = splitUrnScheme(urn);
        return this.http
            .get(`${StatisticalResourcesService.REST_URL}/collections/${agency}/${resource}`, {
                params: { fields: "-metadata" },
            })
            .pipe(instantiate(Collection));
    }

    getJaxiCollectionByUrn(urn: string): Observable<JaxiCollection> {
        const { resource } = splitUrnScheme(urn);
        return this.http.get<JaxiCollection>(`${StatisticalResourcesService.JAXI_REST_URL}/${resource}`).pipe(instantiate(JaxiCollection));
    }

    /**
     * Returns all possible datasets that contains info about a territory.
     *
     * Note that this implies that multiple requests are made in order to
     * overcome API pagination, so HATEOAS attributes are not present in
     * the response object of this method.
     */
    getAllDatasetsByTerritoryVariableElementId(
        variableElementId: string,
    ): Observable<CacheResources> {
        return this.getDatasetsByTerritoryVariableElementId(variableElementId).pipe(
            instantiate(CacheResources),
            switchMap((firstResponse: CacheResources) => {
                const total = firstResponse.total;

                const requestsNeeded = Math.ceil(total / StatisticalResourcesService.LIMIT);
                if (requestsNeeded <= 1) {
                    return of(firstResponse);
                }

                const requests = Array.from({length: requestsNeeded}, (_, i) => i * StatisticalResourcesService.LIMIT)
                    .slice(1) // slice the first element since it corresponds with the first request already fetched
                    .map((offset) => this.getDatasetsByTerritoryVariableElementId(variableElementId, offset));

                // run all requests in parallel
                return forkJoin(requests).pipe(
                    map((responses) => {
                        return responses.reduce((acc, response) => {
                            acc.resource = acc.resource.concat(response.resource);
                            return acc;
                        }, firstResponse);
                    }),
                );
            }),
        );
    }

    getDatasetsByTerritoryVariableElementId(
        variableElementId: string,
        offset = 0,
    ): Observable<CacheResources> {
        const url = new URL(`${StatisticalResourcesService.REST_URL}/resources.json`);
        url.searchParams.append("query", `GEOCOV_VARELEM_ID eq '${variableElementId}'`);
        url.searchParams.append("fields", "-relatedResourcesWithoutSelectedCriteria,+operationTitle");
        url.searchParams.append("limit", StatisticalResourcesService.LIMIT.toString());
        url.searchParams.append("offset", offset.toString());
        return this.http.get(url.toString()).pipe(instantiate(CacheResources));
    }
}
