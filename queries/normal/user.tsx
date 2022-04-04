import React from "react";
import * as queryBuilder from "gql-query-builder";


export const getUserQuery = () => queryBuilder.query({
    operation: 'user',
    fields: [{data: ['id', 'name', 'created_at']}]
})
