import { InternationalString } from "@app/core/model/common.model";
import { Type } from "class-transformer";

export class JaxiInternationalString extends InternationalString {
    public sort!: string;
}

export class JaxiCollection {
    code!: number;
    name!: string;
    message!: "Success";

    @Type(() => JaxiCollectionData)
    data!: JaxiCollectionData;

    @Type(() => JaxiInternationalString)
    title?: JaxiInternationalString;
}

export class JaxiCollectionData {
    @Type(() => JaxiCollectionNodes)
    nodes!: JaxiCollectionNodes;

    @Type(() => JaxiCollectionFile)
    files?: JaxiCollectionFile[];
}

export class JaxiCollectionNodes {
    @Type(() => JaxiCollectionNode)
    node!: JaxiCollectionNode[];
}

export class JaxiCollectionNode {
    name!: string;
    type?: string;

    @Type(() => JaxiInternationalString)
    title?: JaxiInternationalString;

    @Type(() => JaxiCollectionNodes)
    nodes!: JaxiCollectionNodes;

    @Type(() => JaxiCollectionFile)
    files?: JaxiCollectionFile[];

    get nameNoExt() {
        return this.name.substring(0, this.name.indexOf(".px"));
    }
}

export class JaxiCollectionFile {
    name!: string;

    get nameNoExt() {
        return this.name.substring(0, this.name.indexOf(".px"));
    }
}