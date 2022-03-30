import React from "react";
import * as queryBuilder from "gql-query-builder";

export const newItemQuery = (title:string, lowerPrice:number, upperPrice:number, description:string, hashtags:string[]) => {
    return queryBuilder.mutation({
        operation: "createAd",
        variables: {
            title: {value: title, required: true},
            priceStart: {value: lowerPrice * 1000, required: true},
            priceEnd: {value: upperPrice * 1000, required: true},
            details: {value: description},
            hashtags: {value: JSON.stringify(hashtags), type: "[String]"}
        },
        fields: ['status', 'message', 'errors', {data: ['id', 'title']}]
    })
}

