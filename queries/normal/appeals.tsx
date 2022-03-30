import React from 'react';
import * as queryBuilder from "gql-query-builder";


export const getAppealsQuery = (adParams: string[]) => {
    return queryBuilder.query({
        operation: 'appeals',
        variables:{first:1},
        fields: [{edges: [{node: adParams}]}]
    }, null, {operationName: 'getAppeals'})
}