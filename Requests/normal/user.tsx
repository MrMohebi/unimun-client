import React from "react";
import * as queryBuilder from "gql-query-builder";


export const getUserQuery = (params: string[]) => queryBuilder.query({
    operation: 'user',
    fields: [{data: params}]
})
