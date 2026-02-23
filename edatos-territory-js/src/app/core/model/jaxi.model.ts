import { Type } from "class-transformer";

export abstract class JaxiResource {
    name!: string;

    "px:catalan"?: string;
    "px:castellano"?: string;
    "px:prefixsort"?: string;

    get sort(): string | undefined {
        return this["px:prefixsort"];
    }

    private get(locale?: string | null) {
        switch (locale) {
            case "ca":
                return this["px:catalan"];
            case "es":
                return this["px:castellano"];
            default:
                return this.name;
        }
    }

    getName(locale?: string, defaultLocale?: string): string {
        return this.get(locale) || this.get(defaultLocale) || this.name;
    }
}

export class JaxiCollection extends JaxiResource {
    code!: number;
    code_operation!: string;
    message!: string;

    @Type(() => JaxiCollectionData)
    data!: JaxiCollectionData;
}

export class JaxiCollectionData {
    @Type(() => JaxiCollectionNodes)
    nodes!: JaxiCollectionNodes;

    @Type(() => JaxiCollectionFile)
    files!: JaxiCollectionFile[];
}

export class JaxiCollectionNodes {
    @Type(() => JaxiCollectionNode)
    node!: JaxiCollectionNode[];
}

export class JaxiCollectionNode extends JaxiResource {
    @Type(() => JaxiCollectionNodes)
    nodes!: JaxiCollectionNodes;

    @Type(() => JaxiCollectionFile)
    files!: JaxiCollectionFile[];
}

export class JaxiCollectionFile extends JaxiResource {
    jsonLink!: string;
    jsonStatLink!: string;
    pxLink!: string;

    get id() {
        return this.name.substring(0, this.name.indexOf(".px"));
    }
}
