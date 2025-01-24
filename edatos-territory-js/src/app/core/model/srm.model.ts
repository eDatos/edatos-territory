import { Resource, Resources } from "@app/core/model";
import { Type } from "class-transformer";

export class Categories extends Resources {
    @Type(() => Resource)
    public category!: Resource[];
}
