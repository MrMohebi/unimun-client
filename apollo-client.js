import {ApolloClient, InMemoryCache} from "@apollo/client";

const client = new ApolloClient({
    uri: "https://api.unimun.me/graphql",
    cache: new InMemoryCache(),
});

export default client;