import { Component, Input, OnInit } from "@angular/core";

import { TreeNode } from "primeng/api";

import { TranslateService } from "@ngx-translate/core";

import { JAXI_TERRITORY_QUERY_KEY, VISUALIZER_TERRITORY_QUERY_KEY } from "@app/app.constants";
import {
    OperationsWithSubjectArea,
    Resource,
    ResourceWithStatisticalOperation,
    StatisticalOperation,
} from "@app/core/model";
import { OperationService } from "@app/core/service";

@Component({
    selector: "app-operations-list",
    templateUrl: "./operations-list.component.html",
    styleUrls: ["./operations-list.component.scss"],
})
export class OperationsListComponent implements OnInit {
    /**
     * Variable element ID of the territory.
     */
    @Input()
    datasets?: ResourceWithStatisticalOperation[];

    @Input()
    territoryId?: string;

    tree: TreeNode[] = [];
    loading = false;

    constructor(
        private translateService: TranslateService,
        private operationsService: OperationService
    ) {}

    private getAllOperationsFromDatasets(operationsWithSubjectArea: OperationsWithSubjectArea): StatisticalOperation[] {
        const operations: StatisticalOperation[] = [];
        if (this.datasets) {
            this.datasets.forEach((dataset) => {
                if (!operations.find((op) => op.urn === dataset.statisticalOperation.urn)) {
                    const subjectArea = operationsWithSubjectArea.operation.find(
                        (res) => res.id === dataset.statisticalOperation.id
                    )?.subjectArea; // subjectArea should always be present
                    if (subjectArea) {
                        operations.push(
                            new StatisticalOperation(
                                dataset.statisticalOperation.id,
                                dataset.statisticalOperation.urn,
                                dataset.statisticalOperation.name,
                                subjectArea
                            )
                        );
                    }
                }
            });
        }

        return operations;
    }

    ngOnInit(): void {
        this.operationsService.getListOfOperations().subscribe((operationsWithSubjectArea) => {
            const operations = this.getAllOperationsFromDatasets(operationsWithSubjectArea);
            this.tree = this.createTree(operations);
        });
    }

    private createTree(operations: StatisticalOperation[]) {
        const uniqueSubjectAreas = operations
            .map((op) => op.subjectArea)
            .filter((res, index, self) => {
                return self.findIndex((innerRes) => innerRes.id === res.id) === index;
            })
            .sort((a, b) => a.id.localeCompare(b.id) || 0);
        const firstLevel = [];
        for (const subjectArea of uniqueSubjectAreas) {
            const node: TreeNode = {
                key: subjectArea.urn,
                label: subjectArea.getName(this.translateService.currentLang) || undefined,
                data: subjectArea,
                leaf: false,
                children: this.toTreeNodeList(operations.filter((op) => op.subjectArea.id === subjectArea.id)).sort(
                    (a, b) => a.label!.localeCompare(b.label!) || 0
                ),
            };
            firstLevel.push(node);
        }

        return firstLevel;
    }

    getVisualizerUrl(datasetId: string): string {
        let dataset = this.datasets!.find((dataset) => dataset.id === datasetId);
        let url = new URL(dataset!.visualizerHtmlLink);
        if (this.territoryId) {
            const paramName = this.isJaxiDataset(url.toString()) ? JAXI_TERRITORY_QUERY_KEY : VISUALIZER_TERRITORY_QUERY_KEY;
            url.searchParams.set(paramName, this.territoryId);
        }
        return url.toString();
    }

    private toTreeNodeList(siemacResource: { urn: string; getName: Function }[]): TreeNode[] {
        const children = [];
        for (const elem of siemacResource) {
            const isDataset = elem instanceof Resource;
            const node: TreeNode = {
                key: elem.urn,
                label: elem.getName(this.translateService.currentLang),
                data: elem,
                leaf: isDataset,
                type: isDataset ? "dataset" : undefined,
            };
            children.push(node);
            if (!isDataset) {
                node.children = this.toTreeNodeList(this.getDatasetsByStatisticalOperation(elem.urn));
            }
        }
        return children;
    }

    private getDatasetsByStatisticalOperation(statisticalOperationUrn: string): Resource[] {
        return this.datasets?.filter((dataset) => dataset.statisticalOperation?.urn === statisticalOperationUrn) || [];
    }

    private isJaxiDataset(url: string) {
        return url.includes("tabla.do");
    }
}
