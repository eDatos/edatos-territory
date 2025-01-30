import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";

import { ResourceWithStatisticalOperation } from "@app/core/model";
import { DatasetService } from "@app/core/service";

@Component({
    selector: "app-territory-info",
    templateUrl: "./territory-detail.component.html",
    styleUrls: ["./territory-detail.component.scss"],
})
export class TerritoryDetailComponent implements OnInit {
    resources?: ResourceWithStatisticalOperation[];
    loading = true;
    territoryId?: string;

    constructor(
        private route: ActivatedRoute,
        private datasetService: DatasetService,
        private translateService: TranslateService,
        private title: Title,
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.init(params["territoryId"]);
        });
    }

    init(territoryId: string) {
        this.territoryId = territoryId;
        this.loading = true;

        const territoryName = this.translateService.instant(`nodes.${this.territoryId}`);
        const title = this.translateService.instant("territory.page.title", { territory: territoryName });
        this.title.setTitle(title);

        this.resources = undefined; // prevents multiple calls to ngOnChanges
        this.datasetService
            .getAllDatasetsByTerritoryVariableElementId(this.territoryId)
            .subscribe((resources) => {
                this.resources = resources.resource;
            });
    }
}
