import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, } from "@angular/core";

import { Observable } from "rxjs";

import { PropertiesService } from "@app/core/service";

@Injectable() export class HeadersInterceptor implements HttpInterceptor {
    constructor(private propertiesService: PropertiesService) {}

    intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
        const apiKey = this.propertiesService.getApiKey();
        if (apiKey) {
            request = request.clone({
                setHeaders: {
                    'api-key': apiKey
                }
            });
        }
        return next.handle(request);
    }
}
