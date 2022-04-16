import * as queryBuilder from "gql-query-builder";

export const updateUser = function (variables: object) {
    console.log(queryBuilder.mutation({
        operation: 'updateUser',
        variables: {
            ...variables
        },
        fields: ['status', {data: ['id']}]
    }))
    return queryBuilder.mutation({
        operation: 'updateUser',
        variables: {
            ...variables
        },
        fields: ['status', {data: ['id']}]
    })
}
