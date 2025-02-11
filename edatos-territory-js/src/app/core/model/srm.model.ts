import { Hateoas, Resource } from "@app/core/model";
import { Type } from "class-transformer";

export class Categories extends Hateoas {
    @Type(() => Resource)
    public category!: Resource[];
}
