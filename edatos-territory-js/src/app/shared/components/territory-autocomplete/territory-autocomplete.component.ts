import { Component, OnInit } from "@angular/core";
import { Router, RoutesRecognized } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";
import { filter, map, startWith } from "rxjs";

import { Territories } from "@app/core/config";
import { ConfigService } from "@app/core/service";
import { removeDiacritics } from "@app/core/service/util";

type TerritoryInfo = { id: string; name: string; type: string; fullName: string };

@Component({
    selector: "app-territory-autocomplete",
    templateUrl: "./territory-autocomplete.component.html",
    styleUrls: ["./territory-autocomplete.component.scss"],
})
export class TerritoryAutocompleteComponent implements OnInit {
    territoryId?: TerritoryInfo;

    territories: TerritoryInfo[] = [];
    suggestions: TerritoryInfo[] = [];

    constructor(
        private configService: ConfigService,
        private translateService: TranslateService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Since this component is outside <router-outlet> we cannot use
        // ActivatedRoute, because it wouldn't return any data
        // See https://stackoverflow.com/a/45737376/7611990
        this.router.events
            .pipe(
                filter((event): event is RoutesRecognized => {
                    return event instanceof RoutesRecognized;
                }),
                map((elem) => elem.url),
                startWith(this.router.url) // see https://stackoverflow.com/a/71725525/7611990
            )
            .subscribe((url) => {
                const urlSegments = url.split("/");
                if (urlSegments[1] === "territory" && urlSegments[2]) {
                    this.territoryId = this.convertToTerritoryInfo(urlSegments[2]);
                }
            });

        this.configService.getTerritories().subscribe((territories) => {
            this.territories = this.convertToList(territories);
        });
    }

    complete(event: { originalEvent: InputEvent; query: string }) {
        const searchTerm = removeDiacritics(event.query);
        this.suggestions = this.territories.filter((territory) => {
            return new RegExp(searchTerm, "gi").test(removeDiacritics(territory.name));
        });
    }

    goTo(territory: TerritoryInfo) {
        this.router.navigate(["territory", territory.id]);
    }

    private convertToList(territories: Territories): TerritoryInfo[] {
        return territories.groups.flatMap((group) => {
            return group.children.flatMap((child) => {
                if (child.codes) {
                    return child.codes.map((code) => {
                        return this.convertToTerritoryInfo(code);
                    });
                } else {
                    return this.convertToTerritoryInfo(child.id);
                }
            });
        });
    }

    private convertToTerritoryInfo(id: string): TerritoryInfo {
        const name = this.translateService.instant("nodes." + id);
        const type = id.split("_")[0];
        return {
            id,
            name,
            type,
            fullName: `${name} (${this.translateService.instant("territory.type." + type)})`,
        };
    }
}
