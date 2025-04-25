import { api } from "encore.dev/api";
import { ApolloServer, HeaderMap } from "@apollo/server";
import { readdirSync, readFileSync } from "node:fs";
import { json } from "node:stream/consumers";
import resolvers from "./resolvers";
import packageJson from "../package.json";
import { BaseResponse } from "./__generated__/resolvers-types";
import { join } from "node:path";
import { getSessionIdFromCookies, setSessionCookie } from "../helpers/cookie";

const typeDefs = readdirSync("./schema")
    .filter(file => file.endsWith(".graphql")) // Get only .graphql files
    .map(file => readFileSync(join("./schema", file), { encoding: "utf-8" })); // Read them

export const version = packageJson.version

export interface Context {
    session_id: string
}

const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
})

await server.start();

export const graphqlAPI = api.raw(
    { expose: true, path: "/graphql", method: "*" }, // the only exposed API
    async (req, res) => {
        server.assertStarted("/graphql");

        const headers = new HeaderMap();
        for (const [key, value] of Object.entries(req.headers)) {
            if (value !== undefined) {
                headers.set(key, Array.isArray(value) ? value.join(", ") : value);
            }
        }

        if (req.method === "GET") { // requesting base endpoint
            res.setHeader("Content-Type", "application/json");

            const body: BaseResponse = {
                code: "success",
                message: "backend graphql e-commerce by fatah4561 v" + version,
                success: true
            }
            res.end(JSON.stringify(body));
            return
        }

        // cookie
        let session_id = getSessionIdFromCookies(req)
        if (!session_id) {
            session_id = setSessionCookie(res)
        }

        const httpGraphqlResponse = await server.executeHTTPGraphQLRequest({
            httpGraphQLRequest: {
                headers,
                method: req.method!.toUpperCase(),
                body: await json(req),
                search: new URLSearchParams(req.url ?? "").toString(),
            },
            context: async () => {
                return { req, res, session_id: session_id };
            }
        })

        for (const [key, value] of httpGraphqlResponse.headers) {
            res.setHeader(key, value);
        }
        res.statusCode = httpGraphqlResponse.status ?? 200;

        if (httpGraphqlResponse.body.kind === "complete") {
            res.end(httpGraphqlResponse.body.string);
            return;
        }

        for await (const chunk of httpGraphqlResponse.body.asyncIterator) {
            res.write(chunk);
        }
        res.end();
    }
)