import React from 'react';
import * as queryBuilder from "gql-query-builder";


export const getAppealsQuery = (adParams: string[], searchText?: string) => {

    let variables = {after: '', searchText}
    variables.after = '';
    if (searchText)
        variables.searchText = searchText
    return queryBuilder.query({
        operation: 'appeals',
        variables: variables,
        fields: [{edges: ['cursor', {node: adParams}],}]
    }, null, {operationName: 'getAppeals'})
}

export const getAppealQuery = () => {
    return queryBuilder.query({
        operation: 'appeal',
        variables: {id: {name:'id',type:'ID!',value:''}},
        fields: ['title', 'connectWay', 'details', 'createdAt', 'priceStart', 'priceEnd', 'hashtags', {attachments: ['preview', 'url', 'uploadedAsFile']}]
    }, null, {operationName: 'getAppeal'})
}