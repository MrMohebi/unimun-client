import React from "react";
import * as queryBuilder from "gql-query-builder";

export const newAppealQuery = (title:string, lowerPrice:number, upperPrice:number, description:string, hashtags:string[],files:[]) => {
    return queryBuilder.mutation({
        operation: "createAppeal",
        variables: {
            title: {value: title, required: true},
            priceStart: {value: lowerPrice * 1000, required: true},
            priceEnd: {value: upperPrice * 1000, required: true},
            details: {value: description},
            hashtags: {value: JSON.stringify(hashtags), type: "[String]"},
            files:{value:files,type:"[UploadedFileInput]"}
        },
        fields: ['status', 'message', 'errors', {data: ['id', 'title']}]
    })
}

