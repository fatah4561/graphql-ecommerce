import { PaginationRequest, PaginationResponse } from "../graphql/__generated__/resolvers-types";

/**
 * Given a pagination request and a total number of items, returns
 * a pagination response which includes "limit", "next_cursor",
 * "previous_cursor", and "total_data" fields.
 *
 * "limit" is the number of items to return per "page" of the
 * result set. It is required.
 *
 * "next_cursor" is the key to use to fetch the next page of results.
 * If the result set is exhausted, this field is set to undefined.
 *
 * "previous_cursor" is the key to use to fetch the previous page of
 * results. If the result set is exhausted, this field is set to 1.
 *
 * "total_data" is the total number of items in the result set,
 * which is required.
 *
 * @param req - The pagination request. It should include "limit" and
 * "cursor" fields.
 * @param total - The total number of items in the result set.
 * @returns A pagination response.
 */
export function getPagination(req: PaginationRequest, total: number): PaginationResponse {
    let next_cursor: undefined | number = (req.limit ?? 1) + (req.cursor ?? 1)
    if (next_cursor > total) {
        next_cursor = undefined
    }

    let previous_cursor: undefined | number = (req.cursor ?? 1) - (req.limit ?? 1)
    if (previous_cursor <= 0) {
        previous_cursor = 1
    }
    return {
        limit: req.limit ?? 1,
        next_cursor,
        previous_cursor,
        total_data: total ?? 0
    }
}