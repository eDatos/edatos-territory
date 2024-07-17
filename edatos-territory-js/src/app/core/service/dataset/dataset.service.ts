import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { forkJoin, map, Observable, of, switchMap } from "rxjs";

import { ResourcesWithStatisticalOperation, ResourcesWithStatisticalOperationNoHateoas } from "@app/core/model";
import { instantiate, PropertiesService } from "@app/core/service";

@Injectable({
    providedIn: "root",
})
export class DatasetService {
    public static REST_URL: string;
    private static LIMIT = 1000;

    constructor(
        private http: HttpClient,
        private propertiesService: PropertiesService
    ) {
        DatasetService.REST_URL = this.propertiesService.getStatisticalResourcesExternalApiUrl() + "/v1.0";
    }

    /**
     * Returns all possible datasets that contains info about a territory.
     *
     * Note that this implies that multiple requests are made in order to
     * overcome API pagination, so HATEOAS attributes are not present in
     * the response object of this method.
     */
    getAllDatasetsByTerritoryVariableElementId(
        variableElementId: string
    ): Observable<ResourcesWithStatisticalOperationNoHateoas> {
        return this.getDatasetsByTerritoryVariableElementId(variableElementId).pipe(
            instantiate(ResourcesWithStatisticalOperationNoHateoas),
            switchMap((firstResponse: ResourcesWithStatisticalOperationNoHateoas) => {
                const total = firstResponse.total;

                const requestsNeeded = Math.ceil(total / DatasetService.LIMIT);
                if (requestsNeeded <= 1) {
                    return of(firstResponse);
                }

                const requests = Array.from({ length: requestsNeeded }, (_, i) => i * DatasetService.LIMIT)
                    .slice(1) // slice the first element since it corresponds with the first request already fetched
                    .map((offset) => this.getDatasetsByTerritoryVariableElementId(variableElementId, offset));

                // run all requests in parallel
                return forkJoin(requests).pipe(
                    map((responses) => {
                        return responses.reduce((acc, response) => {
                            acc.resource = acc.resource.concat(response.resource);
                            return acc;
                        }, firstResponse);
                    })
                );
            })
        );
    }

    getDatasetsByTerritoryVariableElementId(
        variableElementId: string,
        offset = 0
    ): Observable<ResourcesWithStatisticalOperation> {
        const url = `${DatasetService.REST_URL}/resources.json?query=GEOCOV_VARELEM_ID eq '${variableElementId}' AND IS_LAST_VERSION EQ 'true'&limit=${DatasetService.LIMIT}&offset=${offset}`;
        return this.http.get(url).pipe(instantiate(ResourcesWithStatisticalOperation));
    }
}
