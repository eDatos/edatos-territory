import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MessageService } from "primeng/api";
import { ProgressSpinner, ProgressSpinnerModule } from "primeng/progressspinner";
import { Toast, ToastModule } from "primeng/toast";

import { LoadingBarModule } from "@ngx-loading-bar/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";

import { AppRoutingModule } from "@app/app-routing.module";
import { AppComponent } from "@app/app.component";
import { AVAILABLE_LANGS, DEFAULT_LANG } from "@app/app.constants";
import { PropertiesService } from "@app/core/service";
import { ErrorModule } from "@app/modules/error";
import { LayoutModule } from "@app/modules/layout";
import { TerritoryModule } from "@app/modules/territory";
import { HeadersInterceptor } from "@app/core/interceptor/headers/headers.interceptor";

export function createTranslateLoader(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: "./assets/i18n/", suffix: ".json" },
        { prefix: "./assets/i18n/territories/", suffix: ".json" },
    ]);
}

export function configureTranslationService(translateService: TranslateService): Function {
    translateService.addLangs(AVAILABLE_LANGS);
    return () => translateService.use(DEFAULT_LANG);
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        LayoutModule,
        TerritoryModule,
        ErrorModule,
        LoadingBarHttpClientModule,
        LoadingBarRouterModule,
        LoadingBarModule,
        TranslateModule.forRoot({
            defaultLanguage: DEFAULT_LANG,
            useDefaultLang: true,
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
        ToastModule,
        ProgressSpinnerModule,
    ],
    providers: [
        MessageService,
        {
            provide: APP_INITIALIZER,
            useFactory: configureTranslationService,
            deps: [TranslateService],
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: (ms: PropertiesService) => () => ms.init(),
            deps: [PropertiesService],
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeadersInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
