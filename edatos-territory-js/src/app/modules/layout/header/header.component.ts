import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit, ViewContainerRef } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";

import { AVAILABLE_LANGS, DEFAULT_LANG } from "@app/app.constants";
import { HtmlService } from "@app/core/service";
import { appendContextualFragment } from "@app/modules/layout";
import { TerritoryAutocompleteComponent } from "@app/shared/components/territory-autocomplete";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
    headerHtml = "";

    constructor(
        private htmlService: HtmlService,
        private translateService: TranslateService,
        private viewContainerRef: ViewContainerRef,
        private languageService: TranslateService,
        @Inject(DOCUMENT) private document: Document
    ) {}

    ngOnInit() {
        const appName = this.translateService.instant("app.name");
        this.htmlService.getHeaderHtml(appName).subscribe((data) => {
            this.headerHtml = data.toString();
            appendContextualFragment(this.headerHtml, "header");
            this.initializeNavbarComponents();
            this.updateLang();
        });
    }

    private initializeNavbarComponents() {
        const componentRef = this.viewContainerRef.createComponent(TerritoryAutocompleteComponent);
        if (typeof Edatos !== "undefined" && typeof Edatos.HeaderManagement !== "undefined") {
            Edatos.HeaderManagement.addAtEnd(componentRef.location.nativeElement);
        }
    }

    private updateLang() {
        const defaultLanguage = Edatos.i18n.getDefaultLanguage();
        if (defaultLanguage && AVAILABLE_LANGS.includes(defaultLanguage)) {
            this.languageService.setDefaultLang(defaultLanguage);
            console.debug("Default language changed to", defaultLanguage);
        }

        const cookieValue = Edatos.i18n.getChosenLocaleCookie();
        if (cookieValue && AVAILABLE_LANGS.includes(cookieValue)) {
            this.languageService.use(cookieValue).subscribe(() => {
                console.debug("Language changed to", cookieValue);
            });
        }
    }
}
