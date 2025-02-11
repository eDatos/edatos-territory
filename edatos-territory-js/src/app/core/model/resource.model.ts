import { InternationalString, Kind, SelfLink, StatisticalOperation } from "@app/core/model";
import { Type } from "class-transformer";

export abstract class Hateoas {
    kind?: Kind;
    total!: number;
    limit?: number;
    offset?: number;
    selfLink?: string;
}

export class Resources<T = Resource> extends Hateoas {
    @Type(() => Resource)
    public resource!: T[];
}

export class Resource {
    public id!: string;
    public nestedId!: string;
    public urn!: string;

    @Type(() => InternationalString)
    public name!: InternationalString;

    @Type(() => SelfLink)
    public selfLink!: SelfLink;

    public kind!: Kind;

    public visualizerHtmlLink?: string;

    getName(lang: string, defaultLang?: string): string | null {
        return this.name.get(lang, defaultLang);
    }
}

export class ResourceWithStatisticalOperation extends Resource {
    @Type(() => StatisticalOperation)
    public statisticalOperation!: StatisticalOperation;
}

export class ResourceWithSubjectArea extends Resource {
    @Type(() => Resource)
    public subjectArea!: Resource;
}

export class CacheResources extends Resources<CacheResource> {
    @Type(() => CacheResource)
    public override resource!: CacheResource[];
}

export class CacheResource {
    @Type(() => ResourceWithStatisticalOperation)
    public mainResource!: ResourceWithStatisticalOperation;

    @Type(() => ResourcesWithStatisticalOperation)
    public relatedResources!: ResourcesWithStatisticalOperation;
}

export class ResourcesWithStatisticalOperation extends Resources {
    @Type(() => ResourceWithStatisticalOperation)
    public override resource!: ResourceWithStatisticalOperation[];
}

export class OperationsWithSubjectArea extends Hateoas {
    @Type(() => ResourceWithSubjectArea)
    public operation!: ResourceWithSubjectArea[];
}

export class Collection {
    public id!: string;
    public urn!: string;
    public kind!: Kind;
    public visualizerHtmlLink!: string;

    @Type(() => SelfLink)
    public selfLink!: SelfLink;

    @Type(() => SelfLink)
    public parentLink!: SelfLink;

    @Type(() => InternationalString)
    public name!: InternationalString;

    @Type(() => InternationalString)
    public description!: InternationalString;

    @Type(() => SelectedLanguages)
    public selectedLanguages!: SelectedLanguages;

    @Type(() => CollectionMetadata)
    public metadata!: CollectionMetadata;

    @Type(() => CollectionData)
    public data!: CollectionData;
}

export class SelectedLanguages {
    public language!: string[];
    public total!: number;
}

export class CollectionMetadata {
    @Type(() => Resource)
    public language!: Resource;

    @Type(() => Resources)
    public languages!: Resources;

    @Type(() => StatisticalOperation)
    public statisticalOperation!: StatisticalOperation;

    public type!: "DATASET" | "COLLECTION" | "QUERY" | "MULTIDATASET";

    @Type(() => Resource)
    public creator!: Resource;

    public lastUpdate!: string;

    @Type(() => Resources)
    public publishers!: Resources;

    @Type(() => Resource)
    public hasPart!: Resource;

    @Type(() => Resource)
    public rightsHolder!: Resource;

    public copyrightDate!: number;

    @Type(() => InternationalString)
    public license!: InternationalString;

    @Type(() => Resource)
    public maintainer!: Resource;

    public version!: string;

    @Type(() => VersionRationaleTypes)
    public versionRationaleTypes!: VersionRationaleTypes;

    public validFrom!: string;
    public nextVersion!: string;

    @Type(() => InternationalString)
    public dataProviderAnnotations!: InternationalString;

    public formatExtentResources!: number;
}


export class VersionRationaleTypes {
    public versionRationaleType!: string[];
    public total!: number;
}

export class Url {
    visualizerHtmlLink!: string;
    kind!: Kind;
}

export class CollectionData {
    @Type(() => CollectionNodes)
    public nodes!: CollectionNodes;
}

export class CollectionNodes {
    @Type(() => CollectionNode)
    public node!: CollectionNode[];
}

export class CollectionNode {
    @Type(() => InternationalString)
    public description!: InternationalString;

    @Type(() => InternationalString)
    public name!: InternationalString;

    @Type(() => Resource)
    public dataset?: Resource;

    @Type(() => Resource)
    public multidataset?: Resource;

    @Type(() => Resource)
    public query?: Resource;

    @Type(() => Resource)
    public publication?: Resource;

    @Type(() => Url)
    public url?: Url;

    @Type(() => CollectionNodes)
    public nodes?: CollectionNodes;

    getElemKey(): string {
        return this.dataset?.urn || this.multidataset?.urn || this.query?.urn || this.publication?.urn || this.url?.visualizerHtmlLink || "";
    }

    getResource(): Resource | Url | undefined {
        return this.dataset || this.multidataset || this.query || this.publication || this.url;
    }
}