import { api } from "encore.dev/api";
import { ApolloServer, HeaderMap } from "@apollo/server";
import { readFileSync } from "node:fs";
import { json } from "node:stream/consumers";
import resolvers from "./resolvers";

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8"});

export interface Context {
    token?: string;
}

const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
})

await server.start();

export const graphqlAPI = api.raw(
    {expose: true, path: "/graphql", method: "*"},
    async (req, res) => {
        server.assertStarted("/graphql");

        const headers = new HeaderMap();
        for (const [key, value] of Object.entries(req.headers)) {
            if (value !== undefined) {
                headers.set(key, Array.isArray(value) ? value.join(", ") : value);
            }
        }

        const httpGraphqlResponse = await server.executeHTTPGraphQLRequest({
            httpGraphQLRequest: {
                headers,
                method: req.method!.toUpperCase(),
                body: await json(req),
                search: new URLSearchParams(req.url ?? "").toString(),
            },
            context: async () => {
                return {req, res, token: req.headers.authorization};
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