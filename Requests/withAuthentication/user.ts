import * as queryBuilder from "gql-query-builder";

export const updateUser = function (variables: object) {
    return queryBuilder.mutation({
        operation: 'updateUser',
        variables: {
            ...variables
        },
        fields: ['status', {data: ['id']}]
    })
}
