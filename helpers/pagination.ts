import { PaginationRequest, PaginationResponse } from "../graphql/__generated__/resolvers-types";

/**
 * Given a pagination request and a total number of items, returns
 * a pagination response which includes "limit", "next_key",
 * "previous_key", and "total_data" fields.
 *
 * "limit" is the number of items to return per "page" of the
 * result set. It is required.
 *
 * "next_key" is the key to use to fetch the next page of results.
 * If the result set is exhausted, this field is set to undefined.
 *
 * "previous_key" is the key to use to fetch the previous page of
 * results. If the result set is exhausted, this field is set to 1.
 *
 * "total_data" is the total number of items in the result set,
 * which is required.
 *
 * @param req - The pagination request. It should include "limit" and
 * "start_key" fields.
 * @param total - The total number of items in the result set.
 * @returns A pagination response.
 */
export function getPagination(req: PaginationRequest, total: number): PaginationResponse {
    let next_key: undefined | number = (req.limit ?? 1) + (req.start_key ?? 1)
    if (next_key > total) {
        next_key = undefined
    }

    let previous_key: undefined | number = (req.start_key ?? 1) - (req.limit ?? 1)
    if (previous_key <= 0) {
        previous_key = 1
    }
    return {
        limit: req.limit ?? 1,
        next_key,
        previous_key,
        total_data: total ?? 0
    }
}