import {gql, useLazyQuery} from "@apollo/client";
import {useEffect} from "react";

const newMessageMutation = gql`
    mutation($chatID:ID! $text:String) {
        sendMessage(chatID: $chatID text:$text){
            text
            sentAt
            id
        }
    }
`
export const GET_SUPPORT_CHAT_QUERY = gql`
    {
        __typename
        supportChat {
            id
            lastMessage {
                chatID
                editedAt
                id
                sentAt
                tempId
            }
            isPrivate
            members {
                bio
                hasLastSeen
            }
            user {
                bio
                hasLastSeen
                isAdmin
                id
                name
                profiles {
                    thumbnail
                }
                verifiedAt
                lastname
            }
            title
            profiles {
                thumbnail
            }
        }
    }

`

export const NEW_MESSAGE_MUTATION = gql`
    mutation($chatID:ID! $text:String) {
        sendMessage(chatID: $chatID text:$text){
            text
            sentAt
            id
        }
    }
`