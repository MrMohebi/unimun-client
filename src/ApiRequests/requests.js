import {ApolloClient, InMemoryCache, gql} from "@apollo/client";
import { WebSocketLink } from '@apollo/client/link/ws';


// const wsLink = new WebSocketLink({
//     uri: 'ws://127.0.0.1:6060/graphql/subscriptions/webhook',
//     // timeout: 30000,
//     options: {
//         reconnect: true
//     }
// });
//
// // wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () => wsLink.subscriptionClient.maxConnectTimeGenerator.max
//
//
// const client = new ApolloClient({
//     link: wsLink,
//     cache: new InMemoryCache()
// });
//
// export let getData = () =>{
//     // client.query({
//     //     query: gql`
//     //         subscription x{chatUpdate(id:"asdfasfd")}
//     //     `
//     // }).then(result => console.log(result));
//     // console.log("test to open")
// }
