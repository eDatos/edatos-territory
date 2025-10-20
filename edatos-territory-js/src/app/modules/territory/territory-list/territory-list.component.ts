import { Component, OnInit } from "@angular/core";

import { Group, Territories } from "@app/core/config";
import { ConfigService } from "@app/core/service";

@Component({
    selector: "app-territory-detail",
    templateUrl: "./territory-list.component.html",
    styleUrls: ["./territory-list.component.scss"],
})
export class TerritoryListComponent implements OnInit {
    groups: Group[] = [];

    constructor(private configService: ConfigService) {}

    ngOnInit(): void {
        this.init(this.configService.getTerritories());
    }

    init(territories: Territories) {
        this.groups = territories.groups;
    }
}
