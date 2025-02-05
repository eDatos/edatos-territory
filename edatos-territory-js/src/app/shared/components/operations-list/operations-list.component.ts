import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";

import { JAXI_TERRITORY_QUERY_KEY, VISUALIZER_TERRITORY_QUERY_KEY } from "@app/app.constants";
import { CacheResource, Categories, Kind, OperationsWithSubjectArea, Resource, ResourcesWithStatisticalOperation, ResourceWithStatisticalOperation, StatisticalOperation } from "@app/core/model";
import { OperationService } from "@app/core/service";
import { SrmService } from "@app/core/service/srm/srm.service";

import { TranslateService } from "@ngx-translate/core";

import { TreeNode } from "primeng/api";
import { forkJoin } from "rxjs";

@Component({
    selector: "app-operations-list",
    templateUrl: "./operations-list.component.html",
    styleUrls: ["./operations-list.component.scss"],
})
export class OperationsListComponent implements OnChanges {
    /**
     * Variable element ID of the territory.
     */
    @Input()
    resources?: CacheResource[];

    @Input()
    territoryId?: string;

    tree: TreeNode[] = [];

    @Output()
    loadingChange = new EventEmitter<boolean>();

    private subjectAreas: Resource[] = [];
    private datasets?: ResourceWithStatisticalOperation[];

    constructor(
        private translateService: TranslateService,
        private operationsService: OperationService,
        private srmService: SrmService,
    ) {
    }

    ngOnChanges(): void {
        this.loadingChange.emit(true);
        this.datasets = this.resources?.flatMap((resource) => resource.relatedResources.resource);

        const operations = this.operationsService.getListOfOperations();
        const defaultSubjectAreas = this.srmService.getDefaultCategorySchemeCategories();

        forkJoin([operations, defaultSubjectAreas])
            .subscribe(([operationsWithSubjectArea, subjectAreas]) => {
                const operations = this.getAllOperationsFromCollections(operationsWithSubjectArea);
                this.tree = this.createTree(operations, subjectAreas);
                this.loadingChange.emit(false)
            });
    }

    private getAllOperationsFromCollections(operationsWithSubjectArea: OperationsWithSubjectArea): StatisticalOperation[] {
        const operations: StatisticalOperation[] = [];
        this.resources?.forEach((resource) => {
            if (!operations.find((op) => op.urn === resource.mainResource.statisticalOperation.urn)) {
                const operationWithSubjectArea = operationsWithSubjectArea.operation.find(
                    (res) => res.id === resource.mainResource.statisticalOperation.id,
                );
                if (operationWithSubjectArea && operationWithSubjectArea.subjectArea) {
                    operations.push(
                        new StatisticalOperation(
                            operationWithSubjectArea.id,
                            operationWithSubjectArea.urn,
                            operationWithSubjectArea.name,
                                operationWithSubjectArea.subjectArea,
                            ),
                    );
                }
            }
        });

        return operations;
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
            const children = this.toTreeNodeListOperations(childOperations);

            if (nestedOperations.length > childOperations.length) {
                // expand branch to add remaining operations if there are still nested operations but none of then is a direct child
                const nestedSubjectAreas = this.subjectAreas.filter((subjectArea) => this.isChildOf(subjectArea, parentSubjectArea, true));
                children.push(...this.expandBranch(nestedOperations, nestedSubjectAreas));
            }

            const node: TreeNode = {
                key: parentSubjectArea.urn,
                label: parentSubjectArea.getName(this.translateService.currentLang, this.translateService.defaultLang) || undefined,
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

    private toTreeNodeListOperations(operations: StatisticalOperation[]): TreeNode[] {
        const children = [];
        for (const elem of operations) {
            const node: TreeNode = {
                key: elem.urn,
                label: elem.getName(this.translateService.currentLang, this.translateService.defaultLang) || undefined,
                data: elem,
                leaf: false,
            };
            children.push(node);
            node.children = this.toTreeNodeListCollections(elem.urn);
        }
        return children.sort((a, b) => a.label!.localeCompare(b.label!) || 0);
    }

    private toTreeNodeListCollections(statisticalOperationUrn: string): TreeNode[] {
        const collections = this.resources?.filter((resource) => resource.mainResource.statisticalOperation.urn === statisticalOperationUrn) || [];
        const children = [];
        for (const elem of collections) {
            const node: TreeNode = {
                key: elem.mainResource.urn,
                label: elem.mainResource.getName(this.translateService.currentLang) || undefined,
                data: elem,
                leaf: false,
            };
            children.push(node);
            node.children = this.toTreeNodeListDatasets(elem.relatedResources);
        }
        return children.sort((a, b) => a.label!.localeCompare(b.label!) || 0);
    }

    private toTreeNodeListDatasets(datasets: ResourcesWithStatisticalOperation) {
        const children = [];
        for (const elem of datasets.resource) {
            const node: TreeNode = {
                key: elem.urn,
                label: elem.getName(this.translateService.currentLang) || undefined,
                data: elem,
                leaf: true,
                type: "dataset",
            };
            children.push(node);
        }
        return children.sort((a, b) => a.label!.localeCompare(b.label!) || 0);
    }

    private isJaxiDataset(url: string) {
        return url.includes("tabla.do");
    }

    registerMatomo($event: MouseEvent) {
        const url = ($event.currentTarget as HTMLAnchorElement).href;
        if (window._paq && window._paq.push) {
            window._paq.push(["trackEvent", "eTerritorio", "ClickOperationLink", url]);
        }
    }
}
