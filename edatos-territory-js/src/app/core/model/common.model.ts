import { Type } from "class-transformer";

export enum Kind {
    DATASET = "statisticalResources#dataset",
    DATASETS = "statisticalResources#datasets",
    OPERATION = "statisticalResources#operation",
    OPERATIONS = "statisticalResources#operations",
    CATEGORIES = "structuralResources#categories",
    CATEGORY = "structuralResources#category",
    PROPERTY = "commonMetadata#property",
}

export class SelfLink {
    public kind: Kind;
    public href: string;

    constructor(kind: Kind, href: string) {
        this.kind = kind;
        this.href = href;
    }
}

export class InternationalString {
    constructor();
    constructor(lang: string, value: string);
    constructor(locStr: LocalisedString);
    constructor(locStrArray: LocalisedString[]);

    constructor(elem?: string | LocalisedString | LocalisedString[], value?: string) {
        if (elem == undefined && value == undefined) {
            this.text = [];
        } else if (typeof elem === "string" && value != undefined) {
            this.text = [new LocalisedString(elem, value)];
        } else if (elem instanceof LocalisedString) {
            this.text = [elem];
        } else if (Array.isArray(elem)) {
            this.text = elem;
        } else {
            throw new Error("Bad initialization of InternationalString, check available constructor signature options");
        }
    }

    @Type(() => LocalisedString)
    public text: LocalisedString[];

    /**
     * Returns the value in the specified language.
     * @param lang Language code according to ISO 639‑1.
     * @param defaultLang Optional language code to return if the specified language is not found.
     */
    get(lang: string, defaultLang?: string): string | null {
        const text = this.findText(lang);
        if (!text && defaultLang) {
            return this.findText(defaultLang);
        }
        return text;
    }

    private findText(lang: string): string | null {
        return this.text?.find((elem) => elem.lang.toLowerCase() === lang.toLowerCase())?.value || null;
    }
}

export class LocalisedString {
    public lang: string;
    public value: string | null;

    constructor(lang: string, value: string | null) {
        this.lang = lang;
        this.value = value;
    }
}