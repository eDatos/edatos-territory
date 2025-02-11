export function splitUrnScheme(urn: string): { agency: string, resource: string, version?: string } {
    const tripletIdentifier = removeUrnPrefix(urn);
    return splitUrnWithoutPrefix(tripletIdentifier);
}

export function removeUrnPrefix(urn: string): string {
    if (urn.length === 0) {
        throw new Error("URN is empty");
    }
    const splitUrn = urn.split("=");
    if (splitUrn.length != 2) {
        throw new Error("URN is not valid");
    }
    return splitUrn[1];
}

export function splitUrnWithoutPrefix(identifier: string): { agency: string, resource: string, version?: string } {
    const agency = identifier.substring(0, identifier.indexOf(":"));
    if (identifier.includes("(")) {
        const resource = identifier.substring(identifier.indexOf(":") + 1, identifier.indexOf("("));
        const version = identifier.substring(identifier.indexOf("(") + 1, identifier.indexOf(")"));
        return {agency, resource, version}
    }
    const resource = identifier.substring(identifier.indexOf(":") + 1);
    return {agency, resource}
}