import { GraphQLResolveInfo } from "graphql";
import { parseResolveInfo, ResolveTree } from "graphql-parse-resolve-info";


/**
 * Extracts and returns a map of fields requested in the GraphQL query.
 * 
 * @param resolveInfo - The GraphQLResolveInfo object containing the query details.
 * @returns A record where keys are either the top-level response types or nested
 *          field names, and values are arrays of field names requested under those
 *          keys.
 * 
 * This function parses the GraphQL resolve info to determine which fields are 
 * being requested in the query and organizes them by response type. It handles
 * both top-level fields and nested fields, allowing resolvers to know exactly 
 * which data to fetch.
 */

export function getFields(resolveInfo: GraphQLResolveInfo): Record<string, string[]> {
    const parsedInfo = parseResolveInfo(resolveInfo);
    if (!parsedInfo) return {};

    const responseFields = parsedInfo.fieldsByTypeName;
    const fields: Record<string, string[]> = {};

    for (const responseType in responseFields) {
        const fieldTree = responseFields[responseType] as Record<string, ResolveTree>;
        // console.log(fieldTree)

        for (const key of Object.keys(fieldTree)) { 
            const responseObj = fieldTree[key];
            // console.log("a ", key, responseType, fieldTree)
            const objTypes = Object.keys(responseObj.fieldsByTypeName);
            // console.log(objTypes)
            if (objTypes.length > 0) { // if response nested
                fields[key] = Object.keys(responseObj.fieldsByTypeName[objTypes[0]]);
            } else { // else add the response type as key
                if (!fields[responseType]) {
                    fields[responseType] = []
                }
                fields[responseType].push(key)
            }
        }
    }

    return fields;
}
