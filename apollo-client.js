import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {UserToken} from "./store/user";

const env = process.env.NODE_ENV

let uri = env === "development" ? 'https://tttapi.unimun.me/graphql' : 'https://api.unimun.me/graphql'
const httpLink = createHttpLink({
    uri: uri,
});


const authLink = setContext((_, {headers}) => {
    // get the authentication token from local storage if it exists
    const token = UserToken()
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            token: token ? `${token}` : "",
        }
    }
});


const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});


export default client;