import { Type } from "class-transformer";

import {InternationalString, Kind, Resource} from "@app/core/model";

export class StatisticalOperation {
    public id!: string;
    public urn!: string;

    @Type(() => InternationalString)
    public name!: InternationalString;

    public kind = Kind.OPERATION;

    @Type(() => Resource)
    public subjectArea: Resource;

    getName(lang: string, defaultLang?: string): string | null {
        return this.name.get(lang, defaultLang);
    }

    constructor(id: string, urn: string, name: InternationalString, subjectArea: Resource) {
        this.id = id;
        this.urn = urn;
        this.name = name;
        this.subjectArea = subjectArea;
    }
}
