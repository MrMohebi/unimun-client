import React from "react";
import {gql} from "@apollo/client";


export const getAds = (content: string[]) => (gql`
    query getAdds($count:Int){
        ads(first:$count){
            edges{
                node{
                    ${content.map(eachContent=>(eachContent))}
                }
            }
            pageInfo{
                currentPage
            }
        }
    }
`)


