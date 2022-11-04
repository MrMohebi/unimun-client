import {ApolloClient, createHttpLink, InMemoryCache, split} from "@apollo/client";
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {getMainDefinition} from '@apollo/client/utilities';
import {createClient} from 'graphql-ws';
import {setContext} from "@apollo/client/link/context";
import {UserToken} from "./store/user";


let isTesting = (process.env.NODE_ENV === 'development') || (process.env.NEXT_PUBLIC_IS_DEV_MOD === '1');

// isTesting = false;

let uri = isTesting ? 'https://tttapi.unimun.me/graphql' : 'https://api.unimun.me/graphql'
let uriChat = isTesting ? 'https://tttchat.unimun.me/graphql' : 'https://chat.unimun.me/graphql'
let urlChatWss = isTesting ? 'wss://tttchat.unimun.me/graphql' : 'wss://chat.unimun.me/graphql'


const httpLink = createHttpLink({
    uri: uri,
});
const httpLinkChat = createHttpLink({
    uri: uriChat,
});
const wssLinkChat = typeof window !== "undefined" ?
    new GraphQLWsLink(createClient({
        url: () => {
            const token = UserToken()
            return urlChatWss + "?token=" + token
        }
    }))
    :
    null;

const createSplitLinkChat = () => {
    return split(
        ({query}) => {
            const def = getMainDefinition(query);
            return (def.kind === "OperationDefinition" && def.operation === "subscription");
        },
        wssLinkChat,
        httpLinkChat
    )
}


const splitLinkChat = (typeof window !== "undefined" && typeof wssLinkChat !== "undefined") ?
    createSplitLinkChat()
    :
    httpLinkChat;


const authLink = setContext((_, {headers}) => {
    const token = UserToken()
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            token: token ? `${token}` : "",
        }
    }
});


export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export const clientChat = new ApolloClient({
    link: authLink.concat(splitLinkChat),
    cache: new InMemoryCache()
});
