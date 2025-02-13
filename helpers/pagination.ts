import { PaginationRequest, PaginationResponse } from "../graphql/__generated__/resolvers-types";

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