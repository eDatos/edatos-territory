import { Type } from "class-transformer";

import { InternationalString, Kind, SelfLink, StatisticalOperation } from "@app/core/model";

export class Resources {
    public kind?: Kind;

    public total!: number;
    public limit?: number;
    public offset?: number;
    public selfLink?: string;
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

export class CacheResources extends Resources {
    @Type(() => CacheResource)
    public resource!: CacheResource[];
}
export class CacheResource {
    @Type(() => ResourceWithStatisticalOperation)
    public mainResource!: ResourceWithStatisticalOperation;

    @Type(() => ResourcesWithStatisticalOperation)
    public relatedResources!: ResourcesWithStatisticalOperation;
}

export class ResourcesWithStatisticalOperation extends Resources {
    @Type(() => ResourceWithStatisticalOperation)
    public resource!: ResourceWithStatisticalOperation[];
}

export class OperationsWithSubjectArea extends Resources {
    @Type(() => ResourceWithSubjectArea)
    public operation!: ResourceWithSubjectArea[];
}
