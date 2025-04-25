import { GraphQLResolveInfo } from "graphql";
import { parseResolveInfo, ResolveTree } from "graphql-parse-resolve-info";

/**
 * Extracts and returns a mapping of field names to their respective nested field names
 * from a given GraphQL resolve information object.
 *
 * This function parses the provided `resolveInfo` using `graphql-parse-resolve-info` to
 * retrieve a structured representation of the requested fields in a GraphQL query. It
 * then recursively traverses the field tree to build a record where each key represents
 * a top-level field name and the associated value is an array of strings representing
 * the nested field names under that key.
 *
 * @param resolveInfo - The GraphQLResolveInfo object containing information about the
 *                      GraphQL query being resolved.
 * @returns A record mapping each top-level field name to an array of its nested field names.
 */

export function getFields(resolveInfo: GraphQLResolveInfo): Record<string, string[]> {
    const parsedInfo = parseResolveInfo(resolveInfo);
    if (!parsedInfo) return {};

    const fields: Record<string, string[]> = {};

    const recurse = (
        tree: Record<string, ResolveTree>,
        parentKey: string
    ) => {
        for (const key in tree) {
            const node = tree[key];
            const typenameKeys = Object.keys(node.fieldsByTypeName);

            if (typenameKeys.length > 0) {
                const typename = typenameKeys[0];
                const nestedFields = node.fieldsByTypeName[typename];

                fields[key] = Object.keys(nestedFields);

                recurse(nestedFields, key);
            } else {
                if (!fields[parentKey]) {
                    fields[parentKey] = [];
                }
                fields[parentKey].push(key);
            }
        }
    };

    for (const typeName in parsedInfo.fieldsByTypeName) {
        const fieldTree = parsedInfo.fieldsByTypeName[typeName];

        if (
            fieldTree &&
            typeof fieldTree === "object" &&
            !("name" in fieldTree)
        ) {
            // Top-level typename (Cart, ErrorResponse, etc.)
            recurse(fieldTree as Record<string, ResolveTree>, typeName);
        }
    }

    return fields;
}
