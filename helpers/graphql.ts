import { GraphQLResolveInfo } from "graphql";
import { parseResolveInfo, ResolveTree } from "graphql-parse-resolve-info";

/**
 * Extracts the requested fields from a GraphQLResolveInfo object.
 *
 * This function parses the GraphQLResolveInfo to determine which fields
 * are requested by the client in the query. It returns a record where
 * each key represents a field type and the associated value is an array
 * of field names requested for that type.
 *
 * @param resolveInfo - The GraphQLResolveInfo object, containing information
 * about the execution state of the GraphQL query.
 * @returns A record where keys are field types and values are arrays of
 * requested field names for those types.
 */

export function getFields(resolveInfo: GraphQLResolveInfo): Record<string, string[]> {
    const parsedInfo = parseResolveInfo(resolveInfo);
    if (!parsedInfo) return {};

    const responseFields = parsedInfo.fieldsByTypeName;
    const fields: Record<string, string[]> = {};

    for (const responseType in responseFields) {
        const fieldTree = responseFields[responseType] as Record<string, ResolveTree>;
        for (const key of Object.keys(fieldTree)) {
            const responseObj = fieldTree[key];
            const objTypes = Object.keys(responseObj.fieldsByTypeName);
            if (objTypes.length > 0) {
                fields[key] = Object.keys(responseObj.fieldsByTypeName[objTypes[0]]);
            }
        }
    }

    return fields;
}
