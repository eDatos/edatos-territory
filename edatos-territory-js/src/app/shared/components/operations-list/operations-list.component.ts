import { Component, Input, OnInit } from "@angular/core";

import { JAXI_TERRITORY_QUERY_KEY, VISUALIZER_TERRITORY_QUERY_KEY } from "@app/app.constants";
import { Categories, OperationsWithSubjectArea, Resource, ResourceWithStatisticalOperation, StatisticalOperation } from "@app/core/model";
import { OperationService } from "@app/core/service";
import { SrmService } from "@app/core/service/srm/srm.service";

import { TranslateService } from "@ngx-translate/core";

import { TreeNode } from "primeng/api";
import { finalize, forkJoin } from "rxjs";

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
    loading = true;

    private subjectAreas: Resource[] = [];

    constructor(
        private translateService: TranslateService,
        private operationsService: OperationService,
        private srmService: SrmService,
    ) {
    }

    private getAllOperationsFromDatasets(operationsWithSubjectArea: OperationsWithSubjectArea): StatisticalOperation[] {
        const operations: StatisticalOperation[] = [];
        if (this.datasets) {
            this.datasets.forEach((dataset) => {
                if (!operations.find((op) => op.urn === dataset.statisticalOperation.urn)) {
                    const subjectArea = operationsWithSubjectArea.operation.find(
                        (res) => res.id === dataset.statisticalOperation.id,
                    )?.subjectArea; // subjectArea should always be present
                    if (subjectArea) {
                        operations.push(
                            new StatisticalOperation(
                                dataset.statisticalOperation.id,
                                dataset.statisticalOperation.urn,
                                dataset.statisticalOperation.name,
                                subjectArea,
                            ),
                        );
                    }
                }
            });
        }

        return operations;
    }

    ngOnInit(): void {
        const operations = this.operationsService.getListOfOperations();
        const defaultSubjectAreas = this.srmService.getDefaultCategorySchemeCategories();

        forkJoin([operations, defaultSubjectAreas])
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(([operationsWithSubjectArea, subjectAreas]) => {
                const operations = this.getAllOperationsFromDatasets(operationsWithSubjectArea);
                this.tree = this.createTree(operations, subjectAreas);
            });
    }

    private createTree(operations: StatisticalOperation[], allSubjectAreas: Categories) {
        this.subjectAreas = allSubjectAreas.category.sort((a, b) => a.id.localeCompare(b.id) || 0);
        const rootAreas = this.subjectAreas.filter(subjectArea => !subjectArea.nestedId.includes("."));
        return this.expandBranch(operations, rootAreas);
    }


    private expandBranch(operations: StatisticalOperation[], parentSubjectAreas: Resource[]): TreeNode[] {
        const level = [];
        for (const parentSubjectArea of parentSubjectAreas) {
            // nested operations may be direct children of this parent subject area or may be deeper in the tree
            const nestedOperations = operations.filter((operation) => {
                return this.isChildOf(operation.subjectArea, parentSubjectArea) || operation.subjectArea.nestedId === parentSubjectArea.nestedId;
            });
            if (nestedOperations.length === 0) {
                continue; // don't show subject area if it has no operations
            }

            // operations that are direct children of the subject area
            const childOperations = nestedOperations.filter((operation) => operation.subjectArea.nestedId === parentSubjectArea.nestedId);

            // show first operations, then subject areas
            const children = this.toTreeNodeList(childOperations);

            if (nestedOperations.length > childOperations.length) {
                // expand branch to add remaining operations if there are still nested operations but none of then is a direct child
                const nestedSubjectAreas = this.subjectAreas.filter((subjectArea) => this.isChildOf(subjectArea, parentSubjectArea, true));
                children.push(...this.expandBranch(nestedOperations, nestedSubjectAreas));
            }

            const node: TreeNode = {
                key: parentSubjectArea.urn,
                label: parentSubjectArea.getName(this.translateService.currentLang) || undefined,
                data: parentSubjectArea,
                leaf: false,
                children,
            };
            level.push(node)
        }
        return level;
    }

    private isChildOf(child: Resource, parent: Resource, checkIfDirectChild = false) {
        const childNestedId = child.nestedId.split(".");
        const parentNestedId = parent.nestedId.split(".");

        if (checkIfDirectChild && childNestedId.length - parentNestedId.length != 1) {
            return false;
        }

        if (childNestedId.length <= parentNestedId.length) {
            return false;
        }

        for (let i = 0; i < parentNestedId.length; i++) {
            if (childNestedId[i] !== parentNestedId[i]) {
                return false;
            }
        }

        return true;
    }

    getVisualizerUrl(datasetId: string): string {
        let dataset = this.datasets!.find((dataset) => dataset.id === datasetId);
        if (!dataset?.visualizerHtmlLink) {
            throw Error("dataset has invalid format: no visualizerHtmlLink")
        }
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
        return children.sort((a, b) => a.label!.localeCompare(b.label!) || 0);
    }

    private getDatasetsByStatisticalOperation(statisticalOperationUrn: string): Resource[] {
        return this.datasets?.filter((dataset) => dataset.statisticalOperation?.urn === statisticalOperationUrn) || [];
    }

    private isJaxiDataset(url: string) {
        return url.includes("tabla.do");
    }
}
