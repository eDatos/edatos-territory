import { Component, ElementRef, OnInit, ViewContainerRef } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";

import { AVAILABLE_LANGS } from "@app/app.constants";
import { HtmlService, PropertiesService } from "@app/core/service";
import { reinsertScripts } from "@app/modules/layout";
import { TerritoryAutocompleteComponent } from "@app/shared/components/territory-autocomplete";

declare const Edatos: any;

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
    headerHtml = "";

    constructor(
        private elementRef: ElementRef,
        private htmlService: HtmlService,
        private translateService: TranslateService,
        private viewContainerRef: ViewContainerRef,
        private propertiesService: PropertiesService,
        private cookieService: CookieService,
        private languageService: TranslateService
    ) {}

    ngOnInit() {
        const appName = this.translateService.instant("app.name");
        this.htmlService.getHeaderHtml(appName).subscribe((data) => {
            this.headerHtml = data.toString();
            setTimeout(() => {
                reinsertScripts(this.elementRef);
                this.initializeNavbarComponents();
                this.updateLang();
            });
        });
    }

    private initializeNavbarComponents() {
        const componentRef = this.viewContainerRef.createComponent(TerritoryAutocompleteComponent);
        if (typeof Edatos !== "undefined" && Edatos.HeaderManagement) {
            Edatos.HeaderManagement.addAtEnd(componentRef.location.nativeElement);
        }
    }

    private updateLang() {
        const cookieName = this.propertiesService.getLanguageCookieName();
        const cookieValue = this.cookieService.get(cookieName);
        if (cookieValue && AVAILABLE_LANGS.includes(cookieValue)) {
            this.languageService.use(cookieValue).subscribe(() => {
                console.debug("Language changed to", cookieValue);
            });
        }
    }
}
