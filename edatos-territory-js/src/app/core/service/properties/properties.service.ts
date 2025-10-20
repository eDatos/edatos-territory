import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { catchError, forkJoin, map, Observable, of, retry, shareReplay, tap } from "rxjs";

import { Properties } from "@app/core/config";
import { MetadataPropertyDto } from "@app/core/model";
import { ConfigService, instantiate } from "@app/core/service";

/**
 * Provides the already loaded values from common-metadata. This service *must* be initialized
 * before the app starts. Please sde {@link init} method documentation.
 *
 *
 * **HOW TO ADD NEW PROPERTIES**
 *
 * Theres a JSON file in the assets folder, <code>properties.json</code>, that contains the
 * *key* of the properties the app needs to load. When the app is deployed that file is fetched (HTTP)
 * and those keys then are used to request their respective values.
 *
 * However, that file is also locally imported to provide static type-checking. So, to add a property:
 *
 * 1. Add the property key in the properties.json file.
 * 2. Load the property in {@link init} method using {@link requestMetadataKeyValue}.
 * 3. Create a getter for the property.
 */
@Injectable({
    providedIn: "root",
})
export class PropertiesService {
    private properties: any;

    private commonMetadataUrl!: string;
    private config: Properties;

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) {
        this.config = this.configService.getConfig();
    }

    /**
     * Initialize app properties. To be run with APP_INITIALIZER.
     *
     * @see https://angular.io/api/core/APP_INITIALIZER
     *
     * @example Initializing the service at app start. Code to be located in {@link AppModule} providers array.
     * {
     *      provide: APP_INITIALIZER,
     *      useFactory: (ms: MetadataService) => () => ms.init(),
     *      deps: [MetadataService],
     *      multi: true,
     * }
     *
     * @return an observable that completes after all properties are loaded.
     */
    init(): Observable<any> {
        /**
         * Add here the values that you need from the config file.
         */
        this.commonMetadataUrl = this.config.endpoints.cmetadata.url;

        /**
         * Add here the properties you need to request to common-metadata.
         */
        const metadataProperties$ = {
            organisation: this.requestMetadataKeyValue(this.config.keys.organisation),
            statisticalResourcesExternalApiUrl: this.requestMetadataKeyValue(
                this.config.keys.statisticalResources.rest.external
            ),
            statisticalOperationsExternalApiUrl: this.requestMetadataKeyValue(
                this.config.keys.statisticalOperations.rest.external
            ),
            structuralResourcesExternalApiUrl: this.requestMetadataKeyValue(
                this.config.keys.structuralResources.rest.external
            ),
            visualizerWebUrl: this.requestMetadataKeyValue(this.config.keys.visualizer.web.external),
            layoutHeaderUrl: this.requestMetadataKeyValue(this.config.keys.layout.header),
            layoutFooterUrl: this.requestMetadataKeyValue(this.config.keys.layout.footer),
            languageCookieName: this.requestMetadataKeyValue(this.config.keys.languageCookieName),
            defaultCategoryScheme: this.requestMetadataKeyValue(this.config.keys.defaultCategoryScheme),
        };

        // load all properties at the same time
        return forkJoin(metadataProperties$).pipe(tap((res) => (this.properties = res)));
    }

    requestMetadataKeyValue(key: string): Observable<string | Error> {
        return this.http.get(this.commonMetadataUrl + "/properties/" + key).pipe(
            instantiate(MetadataPropertyDto),

            retry({ count: 2, delay: 2000 }), // try two more times after error, each request 2 seconds after previous
            shareReplay(1), // cache last value, no new request needed for the same property

            map((res) => res.value),
            tap({
                next: () => console.debug(`Prop '${key}' loaded`),
                error: (err) => console.error(`Could not load property '${key}'`, err),
            }),

            catchError(() => of(new Error(key)))
        );
    }

    getLayoutHeaderUrl(): string {
        return this.properties.layoutHeaderUrl;
    }

    getLayoutFooterUrl(): string {
        return this.properties.layoutFooterUrl;
    }

    getStatisticalResourcesExternalApiUrl(): string {
        return this.properties.statisticalResourcesExternalApiUrl;
    }

    getStatisticalOperationsExternalApiUrl(): string {
        return this.properties.statisticalOperationsExternalApiUrl;
    }

    getStructuralResourcesExternalApiUrl(): string {
        return this.properties.structuralResourcesExternalApiUrl;
    }

    getDefaultCategoryScheme(): string {
        return this.properties.defaultCategoryScheme;
    }

    getVisualizerWebUrl(): string {
        return this.properties.visualizerWebUrl;
    }

    getOrganization() {
        return this.properties.organisation;
    }

    getLanguageCookieName() {
        return this.properties.languageCookieName;
    }

    getAppVersion(): string {
        return this.config.appVersion;
    }

    getApiKey(): string {
        return this.config.apiKeyValue;
    }
}
